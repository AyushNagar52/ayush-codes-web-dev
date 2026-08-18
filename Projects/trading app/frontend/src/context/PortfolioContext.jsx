import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { portfolioService } from '../services/portfolioService';
import { AuthContext } from './AuthContext';

export const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    if (!user) {
      setSummary(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await portfolioService.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch portfolio summary:', err);
      setError(err.response?.data?.message || 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return (
    <PortfolioContext.Provider
      value={{
        summary,
        loading,
        error,
        refreshPortfolio: fetchPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
