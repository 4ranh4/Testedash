import axios from "axios";
import { Account } from "@prisma/client";
import { prisma } from "../../index";
import logger from "../../utils/logger";

const TIKTOK_API_VERSION = "v1.3";
const TIKTOK_BASE_URL = `https://business-api.tiktok.com/open_api/${TIKTOK_API_VERSION}`;

// ============================================
// Fetch Campaign Insights from TikTok Ads
// ============================================
export async function fetchTikTokInsights(account: Account) {
  const startTime = Date.now();
  
  try {
    logger.info(`Fetching TikTok Ads insights for account: ${account.advertiserId}`);

    const advertiserId = account.advertiserId;
    if (!advertiserId) {
      throw new Error("Missing advertiserId for TikTok account");
    }

    const accessToken = account.accessToken;

    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    // Fetch campaign-level data
    const campaignUrl = `${TIKTOK_BASE_URL}/report/integrated/get/`;
    const campaignParams = {
      advertiser_id: advertiserId,
      report_type: "BASIC",
      data_level: "AUCTION_CAMPAIGN",
      dimensions: ["campaign_id"],
      metrics: [
        "campaign_name",
        "impressions",
        "clicks",
        "spend",
        "conversions",
        "conversion_rate",
        "ctr",
        "cpc",
        "cpm",
        "total_cost_per_complete_payment"
      ],
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      page: 1,
      page_size: 1000
    };

    const campaignHeaders = {
      "Access-Token": accessToken,
      "Content-Type": "application/json"
    };

    const campaignRes = await axios.get(campaignUrl, { 
      params: campaignParams,
      headers: campaignHeaders 
    });

    const campaignData = campaignRes.data.data?.list || [];

    // Process and store campaign insights
    for (const campaign of campaignData) {
      const metrics = campaign.metrics;
      const dimensions = campaign.dimensions;

      const spend = parseFloat(metrics.spend || 0);
      const impressions = parseInt(metrics.impressions || 0);
      const clicks = parseInt(metrics.clicks || 0);
      const conversions = parseInt(metrics.conversions || 0);
      const ctr = parseFloat(metrics.ctr || 0);
      const cpc = parseFloat(metrics.cpc || 0);
      const cpm = parseFloat(metrics.cpm || 0);
      const cpa = parseFloat(metrics.total_cost_per_complete_payment || 0);
      
      // TikTok doesn't always provide revenue, calculate ROAS if available
      const revenue = conversions * cpa; // Approximation
      const roas = spend > 0 ? revenue / spend : 0;

      await prisma.campaignInsight.upsert({
        where: {
          accountId_provider_campaignId_date: {
            accountId: account.id,
            provider: "tiktok",
            campaignId: String(dimensions.campaign_id),
            date: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        update: {
          campaignName: metrics.campaign_name,
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
          rawData: campaign
        },
        create: {
          accountId: account.id,
          provider: "tiktok",
          campaignId: String(dimensions.campaign_id),
          campaignName: metrics.campaign_name,
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
          rawData: campaign
        }
      });
    }

    // Fetch ad-level data
    const adParams = {
      advertiser_id: advertiserId,
      report_type: "BASIC",
      data_level: "AUCTION_AD",
      dimensions: ["campaign_id", "ad_id"],
      metrics: [
        "ad_name",
        "impressions",
        "clicks",
        "spend",
        "conversions",
        "conversion_rate",
        "ctr",
        "cpc",
        "cpm",
        "total_cost_per_complete_payment"
      ],
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      page: 1,
      page_size: 1000
    };

    const adRes = await axios.get(campaignUrl, { 
      params: adParams,
      headers: campaignHeaders 
    });

    const adData = adRes.data.data?.list || [];

    // Process and store ad insights
    for (const ad of adData) {
      const metrics = ad.metrics;
      const dimensions = ad.dimensions;

      const spend = parseFloat(metrics.spend || 0);
      const impressions = parseInt(metrics.impressions || 0);
      const clicks = parseInt(metrics.clicks || 0);
      const conversions = parseInt(metrics.conversions || 0);
      const ctr = parseFloat(metrics.ctr || 0);
      const cpc = parseFloat(metrics.cpc || 0);
      const cpm = parseFloat(metrics.cpm || 0);
      const cpa = parseFloat(metrics.total_cost_per_complete_payment || 0);
      
      const revenue = conversions * cpa;
      const roas = spend > 0 ? revenue / spend : 0;

      await prisma.adInsight.upsert({
        where: {
          accountId_provider_adId_date: {
            accountId: account.id,
            provider: "tiktok",
            adId: String(dimensions.ad_id),
            date: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        update: {
          campaignId: String(dimensions.campaign_id),
          adName: metrics.ad_name,
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
          rawData: ad
        },
        create: {
          accountId: account.id,
          provider: "tiktok",
          campaignId: String(dimensions.campaign_id),
          adId: String(dimensions.ad_id),
          adName: metrics.ad_name,
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
          rawData: ad
        }
      });
    }

    const duration = Date.now() - startTime;

    // Log API request
    await prisma.apiRequestLog.create({
      data: {
        provider: "tiktok",
        accountId: account.id,
        endpoint: "/report/integrated/get/",
        method: "GET",
        statusCode: 200,
        duration,
        response: {
          campaignsCount: campaignData.length,
          adsCount: adData.length
        }
      }
    });

    logger.info(`TikTok Ads insights fetched successfully. Campaigns: ${campaignData.length}, Ads: ${adData.length}`);
    
    return [...campaignData, ...adData];
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    // Log error
    await prisma.apiRequestLog.create({
      data: {
        provider: "tiktok",
        accountId: account.id,
        endpoint: "/report/integrated/get/",
        method: "GET",
        statusCode: error.response?.status || 500,
        duration,
        response: {
          error: error.response?.data || error.message
        }
      }
    });

    logger.error("TikTok Ads insights fetch error:", error.response?.data || error.message);
    throw error;
  }
}
