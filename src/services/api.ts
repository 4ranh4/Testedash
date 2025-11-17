/**
 * API Service - Cliente para comunicação com o backend
 */

// Verificar se import.meta.env está disponível e usar fallback
const getApiUrl = () => {
  try {
    return import.meta?.env?.VITE_API_URL || 'http://localhost:4000/api';
  } catch {
    return 'http://localhost:4000/api';
  }
};

const API_URL = getApiUrl();

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export interface Account {
  id: string;
  provider: 'meta' | 'google' | 'tiktok';
  advertiserId: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

export interface InsightsSummary {
  summary: {
    totalImpressions: number;
    totalClicks: number;
    totalSpend: number;
    totalConversions: number;
    totalRevenue: number;
    avgCTR: number;
    avgCPC: number;
    avgCPM: number;
    avgCPA: number;
    avgROAS: number;
  };
  connectedAccounts: Array<{
    id: string;
    provider: string;
  }>;
}

export interface CampaignInsight {
  id: string;
  accountId: string;
  provider: string;
  campaignId: string;
  campaignName: string | null;
  date: string;
  impressions: number | null;
  clicks: number | null;
  spend: number | null;
  conversions: number | null;
  revenue: number | null;
  ctr: number | null;
  cpc: number | null;
  cpm: number | null;
  cpa: number | null;
  roas: number | null;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Carregar token do localStorage
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/#login';
      }
      
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ============================================
  // AUTH ENDPOINTS
  // ============================================
  
  async register(email: string, password: string, name: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.setToken(response.token);
    return response;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<{ id: string; email: string; name: string | null; createdAt: string }>('/auth/me');
  }

  logout() {
    this.clearToken();
  }

  // ============================================
  // OAUTH ENDPOINTS
  // ============================================
  
  getOAuthUrl(provider: 'meta' | 'google' | 'tiktok', userId: string): string {
    return `${API_URL}/auth/${provider}/start?userId=${userId}`;
  }

  // ============================================
  // ACCOUNTS ENDPOINTS
  // ============================================
  
  async listAccounts(): Promise<{ accounts: Account[] }> {
    return this.request('/accounts');
  }

  async getAccount(accountId: string): Promise<Account> {
    return this.request(`/accounts/${accountId}`);
  }

  async deleteAccount(accountId: string): Promise<{ message: string }> {
    return this.request(`/accounts/${accountId}`, {
      method: 'DELETE',
    });
  }

  async syncAccount(accountId: string): Promise<{ message: string; recordsProcessed: number }> {
    return this.request(`/accounts/${accountId}/sync`, {
      method: 'POST',
    });
  }

  // ============================================
  // INSIGHTS ENDPOINTS
  // ============================================
  
  async getInsightsSummary(params: {
    startDate?: string;
    endDate?: string;
    provider?: string;
  }): Promise<InsightsSummary> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.provider) queryParams.append('provider', params.provider);
    
    return this.request(`/insights/summary?${queryParams}`);
  }

  async getCampaignInsights(params: {
    startDate?: string;
    endDate?: string;
    provider?: string;
    accountId?: string;
  }): Promise<{ insights: CampaignInsight[] }> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.provider) queryParams.append('provider', params.provider);
    if (params.accountId) queryParams.append('accountId', params.accountId);
    
    return this.request(`/insights/campaigns?${queryParams}`);
  }

  async getAdInsights(params: {
    startDate?: string;
    endDate?: string;
    provider?: string;
    accountId?: string;
    campaignId?: string;
  }): Promise<{ insights: any[] }> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.provider) queryParams.append('provider', params.provider);
    if (params.accountId) queryParams.append('accountId', params.accountId);
    if (params.campaignId) queryParams.append('campaignId', params.campaignId);
    
    return this.request(`/insights/ads?${queryParams}`);
  }

  // ============================================
  // LOGS ENDPOINTS
  // ============================================
  
  async getApiLogs(params?: {
    provider?: string;
    limit?: number;
  }): Promise<{ logs: any[] }> {
    const queryParams = new URLSearchParams();
    if (params?.provider) queryParams.append('provider', params.provider);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return this.request(`/logs/api-requests?${queryParams}`);
  }
}

export const api = new ApiClient();