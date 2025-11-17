import axios from "axios";
import { Account } from "@prisma/client";
import { prisma } from "../../index";
import logger from "../../utils/logger";

const META_API_VERSION = "v18.0";
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

// ============================================
// Fetch Campaign Insights from Meta
// ============================================
export async function fetchMetaInsights(account: Account) {
  const startTime = Date.now();
  
  try {
    logger.info(`Fetching Meta insights for account: ${account.advertiserId}`);

    const adAccountId = account.advertiserId;
    if (!adAccountId) {
      throw new Error("Missing advertiserId for Meta account");
    }

    // Fetch insights at campaign level
    const campaignInsightsUrl = `${META_BASE_URL}/${adAccountId}/insights`;
    const campaignParams = {
      access_token: account.accessToken,
      fields: "campaign_id,campaign_name,impressions,clicks,spend,actions,reach,ctr,cpc,cpm",
      date_preset: "last_30d",
      level: "campaign",
      limit: 1000
    };

    const campaignRes = await axios.get(campaignInsightsUrl, { params: campaignParams });
    const campaignData = campaignRes.data.data || [];

    // Process and store campaign insights
    for (const campaign of campaignData) {
      const conversions = extractConversions(campaign.actions);
      const revenue = extractRevenue(campaign.actions);
      
      const spend = parseFloat(campaign.spend || 0);
      const ctr = parseFloat(campaign.ctr || 0);
      const cpc = parseFloat(campaign.cpc || 0);
      const cpm = parseFloat(campaign.cpm || 0);
      const cpa = conversions > 0 ? spend / conversions : 0;
      const roas = spend > 0 ? revenue / spend : 0;

      await prisma.campaignInsight.upsert({
        where: {
          accountId_provider_campaignId_date: {
            accountId: account.id,
            provider: "meta",
            campaignId: campaign.campaign_id,
            date: new Date(new Date().setHours(0, 0, 0, 0)) // Today at midnight
          }
        },
        update: {
          campaignName: campaign.campaign_name,
          impressions: parseInt(campaign.impressions || 0),
          clicks: parseInt(campaign.clicks || 0),
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
          provider: "meta",
          campaignId: campaign.campaign_id,
          campaignName: campaign.campaign_name,
          date: new Date(new Date().setHours(0, 0, 0, 0)),
          impressions: parseInt(campaign.impressions || 0),
          clicks: parseInt(campaign.clicks || 0),
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

    // Fetch insights at ad level
    const adInsightsUrl = `${META_BASE_URL}/${adAccountId}/insights`;
    const adParams = {
      access_token: account.accessToken,
      fields: "campaign_id,ad_id,ad_name,impressions,clicks,spend,actions,reach,ctr,cpc,cpm",
      date_preset: "last_30d",
      level: "ad",
      limit: 1000
    };

    const adRes = await axios.get(adInsightsUrl, { params: adParams });
    const adData = adRes.data.data || [];

    // Process and store ad insights
    for (const ad of adData) {
      const conversions = extractConversions(ad.actions);
      const revenue = extractRevenue(ad.actions);
      
      const spend = parseFloat(ad.spend || 0);
      const ctr = parseFloat(ad.ctr || 0);
      const cpc = parseFloat(ad.cpc || 0);
      const cpm = parseFloat(ad.cpm || 0);
      const cpa = conversions > 0 ? spend / conversions : 0;
      const roas = spend > 0 ? revenue / spend : 0;

      await prisma.adInsight.upsert({
        where: {
          accountId_provider_adId_date: {
            accountId: account.id,
            provider: "meta",
            adId: ad.ad_id,
            date: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        update: {
          campaignId: ad.campaign_id,
          adName: ad.ad_name,
          impressions: parseInt(ad.impressions || 0),
          clicks: parseInt(ad.clicks || 0),
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
          provider: "meta",
          campaignId: ad.campaign_id,
          adId: ad.ad_id,
          adName: ad.ad_name,
          date: new Date(new Date().setHours(0, 0, 0, 0)),
          impressions: parseInt(ad.impressions || 0),
          clicks: parseInt(ad.clicks || 0),
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
        provider: "meta",
        accountId: account.id,
        endpoint: "/insights",
        method: "GET",
        statusCode: 200,
        duration,
        response: {
          campaignsCount: campaignData.length,
          adsCount: adData.length
        }
      }
    });

    logger.info(`Meta insights fetched successfully. Campaigns: ${campaignData.length}, Ads: ${adData.length}`);
    
    return [...campaignData, ...adData];
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    // Log error
    await prisma.apiRequestLog.create({
      data: {
        provider: "meta",
        accountId: account.id,
        endpoint: "/insights",
        method: "GET",
        statusCode: error.response?.status || 500,
        duration,
        response: {
          error: error.response?.data || error.message
        }
      }
    });

    logger.error("Meta insights fetch error:", error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// Helper Functions
// ============================================
function extractConversions(actions: any[]): number {
  if (!actions || !Array.isArray(actions)) return 0;
  
  const conversionAction = actions.find(
    a => a.action_type === "purchase" || 
         a.action_type === "lead" || 
         a.action_type === "offsite_conversion.fb_pixel_purchase"
  );
  
  return conversionAction ? parseInt(conversionAction.value || 0) : 0;
}

function extractRevenue(actions: any[]): number {
  if (!actions || !Array.isArray(actions)) return 0;
  
  const revenueAction = actions.find(
    a => a.action_type === "purchase" || 
         a.action_type === "offsite_conversion.fb_pixel_purchase"
  );
  
  return revenueAction ? parseFloat(revenueAction.value || 0) : 0;
}
