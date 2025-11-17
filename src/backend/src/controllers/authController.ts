import { Request, Response } from "express";
import { stringify as qsStringify } from "querystring";
import { upsertAccountFromOAuth, generateToken, hashPassword, comparePassword } from "../services/tokenService";
import { prisma } from "../index";
import logger from "../utils/logger";

const startOAuth = async (req: Request, res: Response) => {
  const provider = req.params.provider;
  const userId = req.query.userId as string; // Pass userId from frontend
  
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    if (provider === "meta") {
      const url = "https://www.facebook.com/v18.0/dialog/oauth?" + qsStringify({
        client_id: process.env.META_APP_ID,
        redirect_uri: process.env.META_REDIRECT_URI,
        scope: "ads_management,ads_read,business_management",
        response_type: "code",
        state: userId // Pass userId in state for callback
      });
      return res.redirect(url);
    }

    if (provider === "google") {
      const url = "https://accounts.google.com/o/oauth2/v2/auth?" + qsStringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/userinfo.email",
        access_type: "offline",
        prompt: "consent",
        state: userId
      });
      return res.redirect(url);
    }

    if (provider === "tiktok") {
      const url = "https://ads.tiktok.com/marketing_api/auth?" + qsStringify({
        app_id: process.env.TIKTOK_CLIENT_KEY,
        redirect_uri: process.env.TIKTOK_REDIRECT_URI,
        state: userId,
        scope: "ads.read"
      });
      return res.redirect(url);
    }

    res.status(400).json({ error: "Unknown provider" });
  } catch (error) {
    logger.error("OAuth start error:", error);
    res.status(500).json({ error: "OAuth initialization failed" });
  }
};

const oauthCallback = async (req: Request, res: Response) => {
  const provider = req.params.provider;
  const code = req.query.code as string;
  const state = req.query.state as string; // userId
  
  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  if (!state) {
    return res.status(400).send("Missing state (userId)");
  }

  try {
    await upsertAccountFromOAuth(provider, code, state);
    
    // Retornar HTML que fecha o popup e notifica o parent
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Autenticação Concluída</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            .success-icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✅</div>
            <h1>Conectado com sucesso!</h1>
            <p>Esta janela será fechada automaticamente...</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'oauth-success', 
                provider: '${provider}' 
              }, '*');
              window.opener.dispatchEvent(new CustomEvent('oauth-success', { 
                detail: { provider: '${provider}' } 
              }));
            }
            setTimeout(() => window.close(), 2000);
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    logger.error("OAuth callback error:", error);
    
    // Retornar HTML de erro
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Erro de Autenticação</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            .error-icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-icon">❌</div>
            <h1>Erro ao conectar</h1>
            <p>Ocorreu um erro durante a autenticação.</p>
            <p>Esta janela será fechada automaticamente...</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'oauth-error', 
                provider: '${provider}',
                message: 'Erro ao conectar plataforma'
              }, '*');
              window.opener.dispatchEvent(new CustomEvent('oauth-error', { 
                detail: { 
                  provider: '${provider}',
                  message: 'Erro ao conectar plataforma'
                } 
              }));
            }
            setTimeout(() => window.close(), 3000);
          </script>
        </body>
      </html>
    `);
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });

    // Generate token
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    logger.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Set by authMiddleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    logger.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
};

export default { 
  startOAuth, 
  oauthCallback, 
  register, 
  login, 
  getCurrentUser 
};