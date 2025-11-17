import { useState, useEffect } from 'react';
import { api, InsightsSummary, CampaignInsight, Account } from '../services/api';

// ============================================
// Hook para Accounts
// ============================================
export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.listAccounts();
      setAccounts(response.accounts);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const syncAccount = async (accountId: string) => {
    try {
      await api.syncAccount(accountId);
      await fetchAccounts(); // Recarregar lista
    } catch (err) {
      throw err;
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      await api.deleteAccount(accountId);
      await fetchAccounts(); // Recarregar lista
    } catch (err) {
      throw err;
    }
  };

  return { 
    accounts, 
    loading, 
    error, 
    refetch: fetchAccounts,
    syncAccount,
    deleteAccount
  };
}

// ============================================
// Hook para Insights Summary
// ============================================
export function useInsightsSummary(params: {
  startDate?: string;
  endDate?: string;
  provider?: string;
}) {
  const [data, setData] = useState<InsightsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.getInsightsSummary(params);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.startDate, params.endDate, params.provider]);

  return { data, loading, error };
}

// ============================================
// Hook para Campaign Insights
// ============================================
export function useCampaignInsights(params: {
  startDate?: string;
  endDate?: string;
  provider?: string;
  accountId?: string;
}) {
  const [insights, setInsights] = useState<CampaignInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.getCampaignInsights(params);
        setInsights(result.insights);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.startDate, params.endDate, params.provider, params.accountId]);

  return { insights, loading, error };
}

// ============================================
// Hook para verificar conexões
// ============================================
export function useApiConnections() {
  const { accounts, loading } = useAccounts();

  const connections = {
    meta: accounts.some(acc => acc.provider === 'meta'),
    google: accounts.some(acc => acc.provider === 'google'),
    tiktok: accounts.some(acc => acc.provider === 'tiktok'),
  };

  return { connections, loading, accounts };
}
