import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, ArrowUpRight, Filter } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { marketService } from '../services/marketService';

export const MarketsPage = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const data = await marketService.getOverview();
        setOverview(data);
      } catch (err) {
        console.error('Failed to load markets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarkets();
  }, []);

  if (loading && !overview) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const allStocks = overview?.allStocks || [];

  // Filter stocks by search and sector
  const filteredStocks = allStocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Equities Market</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover US stocks, compare intraday price action, and execute instant simulated trades.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Filter by symbol or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Major Market Indices Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {overview?.indices?.map((idx) => {
          const isUp = idx.d >= 0;
          return (
            <Card key={idx.symbol} hover>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                    {idx.symbol === 'SPY' ? 'S&P 500 ETF' : 'NASDAQ 100 ETF'}
                  </span>
                  <h4 className="text-lg font-bold text-slate-100 font-mono mt-2">
                    {formatCurrency(idx.c)}
                  </h4>
                </div>
                <div
                  className={`flex items-center gap-1 font-mono font-bold text-xs ${
                    isUp ? 'text-profit' : 'text-loss'
                  }`}
                >
                  {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {formatPercent(idx.dp)}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Stocks Table */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100">
            Available Stocks ({filteredStocks.length})
          </h3>
          <span className="text-xs text-slate-500">Quotes update in real-time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-2">Symbol</th>
                <th className="pb-3">Company</th>
                <th className="pb-3 text-right">Price</th>
                <th className="pb-3 text-right">Today Change</th>
                <th className="pb-3 text-right">Day High</th>
                <th className="pb-3 text-right">Day Low</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredStocks.map((stock) => {
                const isUp = stock.d >= 0;
                return (
                  <tr key={stock.symbol} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 pl-2 font-bold text-brand-400 font-sans text-sm">
                      <Link to={`/stock/${stock.symbol}`} className="hover:underline">
                        {stock.symbol}
                      </Link>
                    </td>
                    <td className="py-3.5 font-sans font-medium text-slate-200">
                      {stock.companyName}
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-100">
                      {formatCurrency(stock.c)}
                    </td>
                    <td className="py-3.5 text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          isUp ? 'text-profit' : 'text-loss'
                        }`}
                      >
                        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {formatCurrency(stock.d)} ({formatPercent(stock.dp)})
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-slate-400">{formatCurrency(stock.h)}</td>
                    <td className="py-3.5 text-right text-slate-400">{formatCurrency(stock.l)}</td>
                    <td className="py-3.5 text-right pr-2 font-sans">
                      <Link to={`/stock/${stock.symbol}`}>
                        <Button size="sm" className="px-3 py-1 text-xs gap-1">
                          Trade <ArrowUpRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
