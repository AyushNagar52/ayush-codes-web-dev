import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Building2,
  PieChart,
  Calendar,
  DollarSign,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { PriceChart } from '../charts/PriceChart';
import { TradePanel } from '../components/trading/TradePanel';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { marketService } from '../services/marketService';
import { watchlistService } from '../services/watchlistService';
import { usePortfolio } from '../hooks/usePortfolio';

export const StockDetailsPage = () => {
  const { symbol } = useParams();
  const cleanSymbol = (symbol || 'AAPL').toUpperCase();

  const { summary, refreshPortfolio } = usePortfolio();

  const [quote, setQuote] = useState(null);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeRange, setActiveRange] = useState('1M');
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const fetchStockData = useCallback(async () => {
    try {
      setLoading(true);
      const [quoteData, profileData, historyData, watchlistData] = await Promise.all([
        marketService.getQuote(cleanSymbol),
        marketService.getProfile(cleanSymbol),
        marketService.getHistory(cleanSymbol, activeRange),
        watchlistService.getWatchlist(),
      ]);

      setQuote(quoteData);
      setProfile(profileData);
      setHistory(historyData);
      setInWatchlist(watchlistData.some((item) => item.symbol === cleanSymbol));
    } catch (err) {
      console.error('Failed to load stock details:', err);
    } finally {
      setLoading(false);
    }
  }, [cleanSymbol, activeRange]);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  const handleToggleWatchlist = async () => {
    try {
      setWatchlistLoading(true);
      if (inWatchlist) {
        await watchlistService.remove(cleanSymbol);
        setInWatchlist(false);
      } else {
        await watchlistService.add(cleanSymbol);
        setInWatchlist(true);
      }
    } catch (err) {
      console.error('Watchlist toggle error:', err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading && !quote) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const isProfit = (quote?.d || 0) >= 0;

  // Check if user currently holds this stock
  const currentHolding = summary?.holdings?.find((h) => h.symbol === cleanSymbol);

  return (
    <div className="space-y-6">
      {/* Top Back Navigation & Watchlist Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/markets"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Markets
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleWatchlist}
          loading={watchlistLoading}
          className="gap-1.5 text-xs"
        >
          <Star className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-amber-400 text-amber-400' : ''}`} />
          {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
        </Button>
      </div>

      {/* Stock Quote Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white">{cleanSymbol}</h1>
            <span className="text-sm text-slate-400 font-medium">
              {profile?.name || quote?.companyName}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {profile?.industry || 'Equities'}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-3">
            <span className="text-3xl font-black text-slate-100 font-mono">
              {formatCurrency(quote?.c || 0)}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-sm font-bold font-mono ${
                isProfit ? 'text-profit' : 'text-loss'
              }`}
            >
              {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatCurrency(quote?.d || 0)} ({formatPercent(quote?.dp || 0)})
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div>
            <span className="block text-[10px] text-slate-500 font-sans uppercase">Day High</span>
            <span className="text-slate-200 font-semibold">{formatCurrency(quote?.h || 0)}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 font-sans uppercase">Day Low</span>
            <span className="text-slate-200 font-semibold">{formatCurrency(quote?.l || 0)}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 font-sans uppercase">Prev Close</span>
            <span className="text-slate-200 font-semibold">{formatCurrency(quote?.pc || 0)}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 font-sans uppercase">Market Cap</span>
            <span className="text-slate-200 font-semibold">{profile?.marketCap || '$25.0B'}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Chart + Trade Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Price Chart */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100">Price Chart</h3>
              <p className="text-xs text-slate-400">Historical performance & intraday price</p>
            </div>
          </div>

          <PriceChart
            data={history}
            activeRange={activeRange}
            onRangeChange={setActiveRange}
            isProfit={isProfit}
            height={340}
          />
        </Card>

        {/* Right Col: Instant Trade Panel & User Holding Status */}
        <div className="space-y-4">
          <TradePanel
            stock={quote}
            onTradeSuccess={() => {
              fetchStockData();
              refreshPortfolio();
            }}
          />

          {/* User's Position in this stock */}
          {currentHolding && (
            <Card className="space-y-2.5 text-xs bg-slate-900/90 border-brand-500/20">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-400">
                Your Active Position
              </span>
              <div className="flex justify-between text-slate-400">
                <span>Shares Owned:</span>
                <span className="font-mono font-bold text-slate-100">
                  {currentHolding.quantity} shares
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Average Cost:</span>
                <span className="font-mono text-slate-100">
                  {formatCurrency(currentHolding.averageBuyPrice)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Market Value:</span>
                <span className="font-mono font-bold text-slate-100">
                  {formatCurrency(currentHolding.positionValue)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Unrealized P&L:</span>
                <span
                  className={`font-mono font-bold ${
                    currentHolding.unrealizedPnL >= 0 ? 'text-profit' : 'text-loss'
                  }`}
                >
                  {formatCurrency(currentHolding.unrealizedPnL)} (
                  {formatPercent(currentHolding.unrealizedPnLPercentage)})
                </span>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Company Fundamentals Section */}
      <Card className="space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-400" />
          Company Profile & Fundamentals
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          {profile?.description}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
          <div>
            <span className="block text-[10px] text-slate-500 font-sans uppercase">P/E Ratio</span>
            <span className="text-slate-200 font-semibold">{profile?.peRatio || 24.5}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 font-sans uppercase">52-Week High</span>
            <span className="text-slate-200 font-semibold">{formatCurrency(profile?.high52 || 0)}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 font-sans uppercase">52-Week Low</span>
            <span className="text-slate-200 font-semibold">{formatCurrency(profile?.low52 || 0)}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 font-sans uppercase">Currency</span>
            <span className="text-slate-200 font-semibold">USD ($)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
