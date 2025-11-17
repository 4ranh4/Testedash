import axios from "axios";
import { prisma } from "../index";
import { stringify as qsStringify } from "querystring";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import logger from "../utils/logger";

// ============================================
// JWT Token Management
// ============================================
export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET || "default_secret";
  return jwt.sign({ userId }, secret, { expiresIn: "30d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const secret = process.env.JWT_SECRET || "default_secret";
    return jwt.verify(token, secret) as { userId: string };
  } catch (error) {
    return null;
  }
}

// ============================================
// Password Management
// ============================================
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

// ============================================
// OAuth Token Exchange
// ============================================
export async function upsertAccountFromOAuth(
  provider: string, 
  code: string, 
  userId: string
) {
  logger.info(`Starting OAuth token exchange for provider: ${provider}`);

  if (provider === "meta") {
    return await handleMetaOAuth(code, userId);
  }

  if (provider === "google") {
    return await handleGoogleOAuth(code, userId);
  }

  if (provider === "tiktok") {
    return await handleTikTokOAuth(code, userId);
  }

  throw new Error("Provider not implemented");
}

// ============================================
// META (Facebook) OAuth
// ============================================
async function handleMetaOAuth(code: string, userId: string) {
  try {
    // Exchange code for short-lived token
    const tokenRes = await axios.get("https://graph.facebook.com/v18.0/oauth/access_token", {
      params: {
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: process.env.META_REDIRECT_URI,
        code
      }
    });

    const { access_token } = tokenRes.data;

    // Exchange for long-lived token
    const longTokenRes = await axios.get("https://graph.facebook.com/v18.0/oauth/access_token", {
      params: {
        grant_type: "fb_exchange_token",
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        fb_exchange_token: access_token
      }
    });

    const longToken = longTokenRes.data.access_token;
    const expiresIn = longTokenRes.data.expires_in;

    // Get user's ad accounts
    const adAccountsRes = await axios.get("https://graph.facebook.com/v18.0/me/adaccounts", {
      params: {
        access_token: longToken,
        fields: "id,name,account_id"
      }
    });

    const adAccounts = adAccountsRes.data.data || [];

    // Store each ad account
    for (const adAccount of adAccounts) {
      await prisma.account.upsert({
        where: {
          userId_provider_advertiserId: {
            userId,
            provider: "meta",
            advertiserId: adAccount.id
          }
        },
        update: {
          accessToken: longToken,
          expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : null
        },
        create: {
          userId,
          provider: "meta",
          advertiserId: adAccount.id,
          accessToken: longToken,
          expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : null
        }
      });
    }

    logger.info(`Meta OAuth successful. ${adAccounts.length} ad accounts stored`);
    return adAccounts;
  } catch (error: any) {
    logger.error("Meta OAuth error:", error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// GOOGLE Ads OAuth
// ============================================
async function handleGoogleOAuth(code: string, userId: string) {
  try {
    // Exchange code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      qsStringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code"
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    // Get user email to identify account
    const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const userEmail = userInfoRes.data.email;

    // Store account (advertiserId will be the email for now, can be updated later)
    await prisma.account.upsert({
      where: {
        userId_provider_advertiserId: {
          userId,
          provider: "google",
          advertiserId: userEmail
        }
      },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: new Date(Date.now() + expires_in * 1000)
      },
      create: {
        userId,
        provider: "google",
        advertiserId: userEmail,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: new Date(Date.now() + expires_in * 1000)
      }
    });

    logger.info("Google OAuth successful");
    return { email: userEmail };
  } catch (error: any) {
    logger.error("Google OAuth error:", error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// TIKTOK Ads OAuth
// ============================================
async function handleTikTokOAuth(code: string, userId: string) {
  try {
    // Exchange code for tokens
    const tokenRes = await axios.post(
      "https://business-api.tiktok.com/open_api/v1.2/oauth2/access_token/",
      {
        app_id: process.env.TIKTOK_CLIENT_KEY,
        secret: process.env.TIKTOK_CLIENT_SECRET,
        auth_code: code,
        grant_type: "authorization_code"
      }
    );

    const { data } = tokenRes.data;

    if (!data || !data.access_token) {
      throw new Error("Failed to get TikTok access token");
    }

    const advertiserId = data.advertiser_id ? String(data.advertiser_id) : "unknown";

    // Store account
    await prisma.account.upsert({
      where: {
        userId_provider_advertiserId: {
          userId,
          provider: "tiktok",
          advertiserId
        }
      },
      update: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || null,
        expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null
      },
      create: {
        userId,
        provider: "tiktok",
        advertiserId,
        accessToken: data.access_token,
        refreshToken: data.refresh_token || null,
        expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null
      }
    });

    logger.info("TikTok OAuth successful");
    return { advertiserId };
  } catch (error: any) {
    logger.error("TikTok OAuth error:", error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// Token Refresh (for expired tokens)
// ============================================
export async function refreshAccessToken(account: any) {
  if (account.provider === "google" && account.refreshToken) {
    try {
      const tokenRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        qsStringify({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: account.refreshToken,
          grant_type: "refresh_token"
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { access_token, expires_in } = tokenRes.data;

      // Update account
      await prisma.account.update({
        where: { id: account.id },
        data: {
          accessToken: access_token,
          expiresAt: new Date(Date.now() + expires_in * 1000)
        }
      });

      return access_token;
    } catch (error) {
      logger.error("Token refresh error:", error);
      throw error;
    }
  }

  throw new Error("Token refresh not supported for this provider");
}
