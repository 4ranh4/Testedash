import { Router } from "express";
import authController from "./controllers/authController";
import platformController from "./controllers/platformController";
import { authMiddleware } from "./middleware/authMiddleware";

const router = Router();

// ============================================
// AUTH ROUTES (OAuth flows)
// ============================================
router.get("/auth/:provider/start", authController.startOAuth);
router.get("/auth/:provider/callback", authController.oauthCallback);
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.getCurrentUser);

// ============================================
// PLATFORM ROUTES (protected)
// ============================================
router.get("/accounts", authMiddleware, platformController.listAccounts);
router.get("/accounts/:id", authMiddleware, platformController.getAccountById);
router.delete("/accounts/:id", authMiddleware, platformController.deleteAccount);
router.post("/accounts/:id/sync", authMiddleware, platformController.syncAccount);

// ============================================
// INSIGHTS ROUTES (protected)
// ============================================
router.get("/insights/campaigns", authMiddleware, platformController.getCampaignInsights);
router.get("/insights/ads", authMiddleware, platformController.getAdInsights);
router.get("/insights/summary", authMiddleware, platformController.getInsightsSummary);

// ============================================
// LOGS ROUTES (protected, admin only)
// ============================================
router.get("/logs/api-requests", authMiddleware, platformController.getApiLogs);

export default router;
