import axios from "axios";
import { Account } from "@prisma/client";
import { prisma } from "../../index";
import logger from "../../utils/logger";
import { refreshAccessToken } from "../tokenService";

const GOOGLE_ADS_API_VERSION = "v15";
const GOOGLE_ADS_BASE_URL = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}`;

// ============================================
// Fetch Campaign Insights from Google Ads
// ============================================
export async function fetchGoogleInsights(account: Account) {
  const startTime = Date.now();
  
  try {
    logger.info(`Fetching Google Ads insights for account: ${account.advertiserId}`);

    // Check if token is expired and refresh if needed
    let accessToken = account.accessToken;
    if (account.expiresAt && account.expiresAt < new Date()) {
      logger.info("Google Ads token expired, refreshing...");
      accessToken = await refreshAccessToken(account);
    }

    // Note: Google Ads API requires a developer token and customer ID
    // This is a simplified example. In production, you'll need to:
    // 1. Get the developer token from Google Ads
    // 2. Get the customer ID (account ID) from the user
    // 3. Use Google Ads API client library for easier integration

    const customerId = account.advertiserId; // Should be the customer ID
    const developerToken = process.env.GOOGLE_DEVELOPER_TOKEN;

    if (!developerToken) {
      throw new Error("Google Developer Token not configured");
    }

    // Google Ads API uses GAQL (Google Ads Query Language)
    const query = `
      SELECT 
        campaign.id,
        campaign.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value,
        metrics.ctr,
        metrics.average_cpc,
        metrics.average_cpm
      FROM campaign
      WHERE segments.date DURING LAST_30_DAYS
    `;

    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "developer-token": developerToken,
      "login-customer-id": customerId?.replace(/-/g, ""), // Remove dashes
      "Content-Type": "application/json"
    };

    // Search campaigns
    const searchUrl = `${GOOGLE_ADS_BASE_URL}/customers/${customerId?.replace(/-/g, "")}/googleAds:search`;
    
    const response = await axios.post(searchUrl, { query }, { headers });
    const results = response.data.results || [];

    // Process and store campaign insights
    for (const result of results) {
      const campaign = result.campaign;
      const metrics = result.metrics;

      const spend = parseFloat(metrics.cost_micros || 0) / 1000000; // Convert micros to currency
      const clicks = parseInt(metrics.clicks || 0);
      const impressions = parseInt(metrics.impressions || 0);
      const conversions = parseInt(metrics.conversions || 0);
      const revenue = parseFloat(metrics.conversions_value || 0);
      const ctr = parseFloat(metrics.ctr || 0);
      const cpc = parseFloat(metrics.average_cpc || 0) / 1000000;
      const cpm = parseFloat(metrics.average_cpm || 0) / 1000000;
      const cpa = conversions > 0 ? spend / conversions : 0;
      const roas = spend > 0 ? revenue / spend : 0;

      await prisma.campaignInsight.upsert({
        where: {
          accountId_provider_campaignId_date: {
            accountId: account.id,
            provider: "google",
            campaignId: String(campaign.id),
            date: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        update: {
          campaignName: campaign.name,
          impressions,
          clicks,
          spend,
          conversions,
          revenue,
          ctr,
          cpc,
          cpm,
          cpa,
          roas,
          rawData: result
        },
        create: {
          accountId: account.id,
          provider: "google",
          campaignId: String(campaign.id),
          campaignName: campaign.name,
          date: new Date(new Date().setHours(0, 0, 0, 0)),
          impressions,
          clicks,
          spend,
          conversions,
          revenue,
          ctr,
          cpc,
          cpm,
          cpa,
          roas,
          rawData: result
        }
      });
    }

    // Fetch ad-level data
    const adQuery = `
      SELECT 
        campaign.id,
        ad_group.id,
        ad_group_ad.ad.id,
        ad_group_ad.ad.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value,
        metrics.ctr,
        metrics.average_cpc,
        metrics.average_cpm
      FROM ad_group_ad
      WHERE segments.date DURING LAST_30_DAYS
        AND ad_group_ad.status = 'ENABLED'
    `;

    const adResponse = await axios.post(searchUrl, { query: adQuery }, { headers });
    const adResults = adResponse.data.results || [];

    // Process and store ad insights
    for (const result of adResults) {
      const ad = result.ad_group_ad.ad;
      const metrics = result.metrics;
      const campaign = result.campaign;

      const spend = parseFloat(metrics.cost_micros || 0) / 1000000;
      const clicks = parseInt(metrics.clicks || 0);
      const impressions = parseInt(metrics.impressions || 0);
      const conversions = parseInt(metrics.conversions || 0);
      const revenue = parseFloat(metrics.conversions_value || 0);
      const ctr = parseFloat(metrics.ctr || 0);
      const cpc = parseFloat(metrics.average_cpc || 0) / 1000000;
      const cpm = parseFloat(metrics.average_cpm || 0) / 1000000;
      const cpa = conversions > 0 ? spend / conversions : 0;
      const roas = spend > 0 ? revenue / spend : 0;

      await prisma.adInsight.upsert({
        where: {
          accountId_provider_adId_date: {
            accountId: account.id,
            provider: "google",
            adId: String(ad.id),
            date: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        update: {
          campaignId: String(campaign.id),
          adName: ad.name,
          impressions,
          clicks,
          spend,
          conversions,
          revenue,
          ctr,
          cpc,
          cpm,
          cpa,
          roas,
          rawData: result
        },
        create: {
          accountId: account.id,
          provider: "google",
          campaignId: String(campaign.id),
          adId: String(ad.id),
          adName: ad.name,
          date: new Date(new Date().setHours(0, 0, 0, 0)),
          impressions,
          clicks,
          spend,
          conversions,
          revenue,
          ctr,
          cpc,
          cpm,
          cpa,
          roas,
          rawData: result
        }
      });
    }

    const duration = Date.now() - startTime;

    // Log API request
    await prisma.apiRequestLog.create({
      data: {
        provider: "google",
        accountId: account.id,
        endpoint: "/googleAds:search",
        method: "POST",
        statusCode: 200,
        duration,
        response: {
          campaignsCount: results.length,
          adsCount: adResults.length
        }
      }
    });

    logger.info(`Google Ads insights fetched successfully. Campaigns: ${results.length}, Ads: ${adResults.length}`);
    
    return [...results, ...adResults];
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    // Log error
    await prisma.apiRequestLog.create({
      data: {
        provider: "google",
        accountId: account.id,
        endpoint: "/googleAds:search",
        method: "POST",
        statusCode: error.response?.status || 500,
        duration,
        response: {
          error: error.response?.data || error.message
        }
      }
    });

    logger.error("Google Ads insights fetch error:", error.response?.data || error.message);
    throw error;
  }
}
