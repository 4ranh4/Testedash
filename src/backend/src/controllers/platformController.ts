import { Request, Response } from "express";
import { prisma } from "../index";
import { fetchMetaInsights } from "../services/platformClients/metaClient";
import { fetchGoogleInsights } from "../services/platformClients/googleClient";
import { fetchTikTokInsights } from "../services/platformClients/tiktokClient";
import logger from "../utils/logger";

const listAccounts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        advertiserId: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true
      }
    });

    res.json({ accounts });
  } catch (error) {
    logger.error("List accounts error:", error);
    res.status(500).json({ error: "Failed to list accounts" });
  }
};

const getAccountById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const accountId = req.params.id;

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId
      },
      select: {
        id: true,
        provider: true,
        advertiserId: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true
      }
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json(account);
  } catch (error) {
    logger.error("Get account error:", error);
    res.status(500).json({ error: "Failed to get account" });
  }
};

const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const accountId = req.params.id;

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId
      }
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    await prisma.account.delete({
      where: { id: accountId }
    });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    logger.error("Delete account error:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
};

const syncAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const accountId = req.params.id;

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId
      }
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    let insights;
    switch (account.provider) {
      case "meta":
        insights = await fetchMetaInsights(account);
        break;
      case "google":
        insights = await fetchGoogleInsights(account);
        break;
      case "tiktok":
        insights = await fetchTikTokInsights(account);
        break;
      default:
        return res.status(400).json({ error: "Unknown provider" });
    }

    res.json({ 
      message: "Sync completed successfully",
      recordsProcessed: insights.length
    });
  } catch (error) {
    logger.error("Sync account error:", error);
    res.status(500).json({ error: "Failed to sync account" });
  }
};

const getCampaignInsights = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { startDate, endDate, provider, accountId } = req.query;

    const whereClause: any = {};
    
    if (provider) {
      whereClause.provider = provider as string;
    }
    
    if (accountId) {
      // Verify account belongs to user
      const account = await prisma.account.findFirst({
        where: { id: accountId as string, userId }
      });
      if (!account) {
        return res.status(403).json({ error: "Access denied" });
      }
      whereClause.accountId = accountId as string;
    } else {
      // Get all accounts for user
      const userAccounts = await prisma.account.findMany({
        where: { userId },
        select: { id: true }
      });
      whereClause.accountId = {
        in: userAccounts.map(a => a.id)
      };
    }

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const insights = await prisma.campaignInsight.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    });

    res.json({ insights });
  } catch (error) {
    logger.error("Get campaign insights error:", error);
    res.status(500).json({ error: "Failed to get insights" });
  }
};

const getAdInsights = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { startDate, endDate, provider, accountId, campaignId } = req.query;

    const whereClause: any = {};
    
    if (provider) {
      whereClause.provider = provider as string;
    }
    
    if (accountId) {
      const account = await prisma.account.findFirst({
        where: { id: accountId as string, userId }
      });
      if (!account) {
        return res.status(403).json({ error: "Access denied" });
      }
      whereClause.accountId = accountId as string;
    } else {
      const userAccounts = await prisma.account.findMany({
        where: { userId },
        select: { id: true }
      });
      whereClause.accountId = {
        in: userAccounts.map(a => a.id)
      };
    }

    if (campaignId) {
      whereClause.campaignId = campaignId as string;
    }

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const insights = await prisma.adInsight.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    });

    res.json({ insights });
  } catch (error) {
    logger.error("Get ad insights error:", error);
    res.status(500).json({ error: "Failed to get insights" });
  }
};

const getInsightsSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { startDate, endDate, provider } = req.query;

    // Get user accounts
    const whereAccount: any = { userId };
    if (provider) {
      whereAccount.provider = provider as string;
    }
    
    const userAccounts = await prisma.account.findMany({
      where: whereAccount,
      select: { id: true, provider: true }
    });

    const accountIds = userAccounts.map(a => a.id);

    const whereInsights: any = {
      accountId: { in: accountIds }
    };

    if (startDate && endDate) {
      whereInsights.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    // Aggregate campaign insights
    const campaignStats = await prisma.campaignInsight.aggregate({
      where: whereInsights,
      _sum: {
        impressions: true,
        clicks: true,
        spend: true,
        conversions: true,
        revenue: true
      },
      _avg: {
        ctr: true,
        cpc: true,
        cpm: true,
        cpa: true,
        roas: true
      }
    });

    res.json({
      summary: {
        totalImpressions: campaignStats._sum.impressions || 0,
        totalClicks: campaignStats._sum.clicks || 0,
        totalSpend: campaignStats._sum.spend || 0,
        totalConversions: campaignStats._sum.conversions || 0,
        totalRevenue: campaignStats._sum.revenue || 0,
        avgCTR: campaignStats._avg.ctr || 0,
        avgCPC: campaignStats._avg.cpc || 0,
        avgCPM: campaignStats._avg.cpm || 0,
        avgCPA: campaignStats._avg.cpa || 0,
        avgROAS: campaignStats._avg.roas || 0
      },
      connectedAccounts: userAccounts.map(a => ({
        id: a.id,
        provider: a.provider
      }))
    });
  } catch (error) {
    logger.error("Get insights summary error:", error);
    res.status(500).json({ error: "Failed to get summary" });
  }
};

const getApiLogs = async (req: Request, res: Response) => {
  try {
    const { provider, limit = 100 } = req.query;

    const whereClause: any = {};
    if (provider) {
      whereClause.provider = provider as string;
    }

    const logs = await prisma.apiRequestLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string)
    });

    res.json({ logs });
  } catch (error) {
    logger.error("Get API logs error:", error);
    res.status(500).json({ error: "Failed to get logs" });
  }
};

export default {
  listAccounts,
  getAccountById,
  deleteAccount,
  syncAccount,
  getCampaignInsights,
  getAdInsights,
  getInsightsSummary,
  getApiLogs
};
