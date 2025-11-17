import cron from "node-cron";
import { prisma } from "../index";
import { fetchMetaInsights } from "../services/platformClients/metaClient";
import { fetchGoogleInsights } from "../services/platformClients/googleClient";
import { fetchTikTokInsights } from "../services/platformClients/tiktokClient";
import logger from "../utils/logger";

// ============================================
// Scheduled ETL Job
// ============================================
export function startScheduler() {
  const intervalMinutes = parseInt(process.env.SCHEDULER_INTERVAL_MINUTES || "60");
  
  // Convert minutes to cron expression
  const cronExpression = `*/${intervalMinutes} * * * *`;
  
  logger.info(`Starting scheduler with interval: ${intervalMinutes} minutes`);
  logger.info(`Cron expression: ${cronExpression}`);

  // Run every X minutes
  cron.schedule(cronExpression, async () => {
    logger.info("========================================");
    logger.info("Scheduler: Starting ETL job");
    logger.info("========================================");

    try {
      const accounts = await prisma.account.findMany();
      logger.info(`Found ${accounts.length} accounts to sync`);

      for (const account of accounts) {
        try {
          logger.info(`Processing account: ${account.id} (${account.provider})`);

          switch (account.provider) {
            case "meta":
              await fetchMetaInsights(account);
              break;
            case "google":
              await fetchGoogleInsights(account);
              break;
            case "tiktok":
              await fetchTikTokInsights(account);
              break;
            default:
              logger.warn(`Unknown provider: ${account.provider}`);
          }

          logger.info(`✅ Successfully synced account: ${account.id}`);
        } catch (error: any) {
          logger.error(`❌ Error syncing account ${account.id}:`, error.message);
          
          // Continue with next account even if one fails
          continue;
        }
      }

      logger.info("========================================");
      logger.info("Scheduler: ETL job completed");
      logger.info("========================================");
    } catch (error) {
      logger.error("Scheduler: Fatal error during ETL job:", error);
    }
  });

  // Also run immediately on startup (optional)
  logger.info("Running initial ETL sync...");
  setTimeout(async () => {
    try {
      const accounts = await prisma.account.findMany();
      for (const account of accounts) {
        try {
          switch (account.provider) {
            case "meta":
              await fetchMetaInsights(account);
              break;
            case "google":
              await fetchGoogleInsights(account);
              break;
            case "tiktok":
              await fetchTikTokInsights(account);
              break;
          }
        } catch (error: any) {
          logger.error(`Initial sync error for account ${account.id}:`, error.message);
        }
      }
      logger.info("Initial ETL sync completed");
    } catch (error) {
      logger.error("Initial sync error:", error);
    }
  }, 10000); // Run after 10 seconds
}

// ============================================
// Manual Sync Function (can be called from API)
// ============================================
export async function manualSync(accountId?: string) {
  logger.info(`Manual sync triggered${accountId ? ` for account: ${accountId}` : ' for all accounts'}`);

  try {
    const whereClause = accountId ? { id: accountId } : {};
    const accounts = await prisma.account.findMany({ where: whereClause });

    const results = [];

    for (const account of accounts) {
      try {
        let data;
        switch (account.provider) {
          case "meta":
            data = await fetchMetaInsights(account);
            break;
          case "google":
            data = await fetchGoogleInsights(account);
            break;
          case "tiktok":
            data = await fetchTikTokInsights(account);
            break;
          default:
            throw new Error(`Unknown provider: ${account.provider}`);
        }

        results.push({
          accountId: account.id,
          provider: account.provider,
          success: true,
          recordsProcessed: data.length
        });
      } catch (error: any) {
        results.push({
          accountId: account.id,
          provider: account.provider,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  } catch (error) {
    logger.error("Manual sync error:", error);
    throw error;
  }
}
