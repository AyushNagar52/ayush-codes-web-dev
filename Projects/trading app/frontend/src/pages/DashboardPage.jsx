import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { PerformanceChart } from '../charts/PerformanceChart';
import { AllocationDonut } from '../charts/AllocationDonut';
import { HoldingsTable } from '../components/portfolio/HoldingsTable';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { usePortfolio } from '../hooks/usePortfolio';
import { portfolioService } from '../services/portfolioService';
import { marketService } from '../services/marketService';
import { orderService } from '../services/orderService';

export const DashboardPage = () => {
  const { summary, loading: portfolioLoading, refreshPortfolio } = usePortfolio();
  const [performanceData, setPerformanceData] = useState([]);
  const [marketOverview, setMarketOverview] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeChartRange, setActiveChartRange] = useState('1M');
  const [loadingExtras, setLoadingExtras] = useState(true);

  useEffect(() => {
    const loadDashboardExtras = async () => {
      try {
        setLoadingExtras(true);
        const [perf, market, ordersRes] = await Promise.all([
          portfolioService.getPerformance(activeChartRange),
          marketService.getOverview(),
          orderService.getOrders(1, 5),
        ]);
        setPerformanceData(perf);
        setMarketOverview(market);
        setRecentOrders(ordersRes.orders || []);
      } catch (err) {
        console.error('Error loading dashboard extras:', err);
      } finally {
        setLoadingExtras(false);
      }
    };

    loadDashboardExtras();
  }, [activeChartRange]);

  if (portfolioLoading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const isOverallProfit = (summary?.totalUnrealizedPnL || 0) >= 0;
  const isTodayProfit = (summary?.todayChange || 0) >= 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time simulated performance, asset allocation, and market movements.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link to="/markets">
            <Button size="sm" variant="outline" className="gap-1.5">
              Explore Markets <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link to="/stock/NVDA">
            <Button size="sm" className="gap-1.5">
              Quick Trade <ShoppingBag className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <Card hover className="relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Portfolio Net Worth
              </span>
              <h3 className="text-2xl font-black text-slate-100 font-mono mt-1">
                {formatCurrency(summary?.totalPortfolioValue || 100000)}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <span
              className={`font-mono font-bold flex items-center gap-0.5 ${
                isOverallProfit ? 'text-profit' : 'text-loss'
              }`}
            >
              {isOverallProfit ? '+' : ''}
              {formatCurrency(summary?.totalUnrealizedPnL || 0)} (
              {formatPercent(summary?.totalReturnPercentage || 0)})
            </span>
            <span className="text-[11px] text-slate-500">all-time</span>
          </div>
        </Card>

        {/* Available Cash */}
        <Card hover>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Available Cash
              </span>
              <h3 className="text-2xl font-black text-slate-100 font-mono mt-1">
                {formatCurrency(summary?.cashBalance || 100000)}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Ready to deploy for instant market orders
          </div>
        </Card>

        {/* Invested Equity */}
        <Card hover>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Invested Equity
              </span>
              <h3 className="text-2xl font-black text-slate-100 font-mono mt-1">
                {formatCurrency(summary?.investedValue || 0)}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">{summary?.holdingsCount || 0}</span>{' '}
            active stock position{summary?.holdingsCount === 1 ? '' : 's'}
          </div>
        </Card>

        {/* Today's Return */}
        <Card hover>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Today's P&L
              </span>
              <h3 className="text-2xl font-black text-slate-100 font-mono mt-1">
                {formatCurrency(summary?.todayChange || 0)}
              </h3>
            </div>
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                isTodayProfit
                  ? 'bg-profit-bg border-profit/20 text-profit'
                  : 'bg-loss-bg border-loss/20 text-loss'
              }`}
            >
              {isTodayProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Estimated intraday market movement
          </div>
        </Card>
      </div>

      {/* Main Row: Performance Area Chart & Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Net Worth Chart */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Portfolio Performance</h3>
              <p className="text-xs text-slate-400">Historical net worth progression ($ USD)</p>
            </div>
            <div className="flex gap-1">
              {['1W', '1M', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveChartRange(range)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    activeChartRange === range
                      ? 'bg-slate-800 text-brand-400 border border-slate-700'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <PerformanceChart data={performanceData} height={280} />
        </Card>

        {/* Asset Allocation Breakdown */}
        <Card className="space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Asset Allocation</h3>
            <p className="text-xs text-slate-400">Holdings distribution vs cash balance</p>
          </div>

          <AllocationDonut
            holdings={summary?.holdings || []}
            cash={summary?.cashBalance || 100000}
            height={220}
          />
        </Card>
      </div>

      {/* Second Row: Active Holdings Table & Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Holdings Table */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100">Active Positions</h3>
              <p className="text-xs text-slate-400">Real-time valuation of your stock holdings</p>
            </div>
            <Link to="/portfolio" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
              View Full Portfolio →
            </Link>
          </div>

          <HoldingsTable holdings={summary?.holdings || []} />
        </Card>

        {/* Top Market Gainers / Losers */}
        <Card className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">Market Top Movers</h3>
            <p className="text-xs text-slate-400">Active stocks on US exchanges</p>
          </div>

          <div className="space-y-2">
            {marketOverview?.gainers?.slice(0, 5).map((stock) => (
              <Link
                key={stock.symbol}
                to={`/stock/${stock.symbol}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/60 transition-colors text-xs"
              >
                <div>
                  <span className="font-bold text-slate-100">{stock.symbol}</span>
                  <span className="block text-[10px] text-slate-400 line-clamp-1">
                    {stock.companyName}
                  </span>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-slate-100">{formatCurrency(stock.c)}</div>
                  <div className="text-[11px] font-semibold text-profit">
                    {formatPercent(stock.dp)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">Recent Executed Orders</h3>
            <p className="text-xs text-slate-400">Audit of your last 5 simulated trades</p>
          </div>
          <Link to="/orders" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
            View Order Ledger →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No trade orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <th className="pb-2">Side</th>
                  <th className="pb-2">Symbol</th>
                  <th className="pb-2 text-right">Shares</th>
                  <th className="pb-2 text-right">Exec Price</th>
                  <th className="pb-2 text-right">Total Amount</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 font-mono">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 font-sans">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.side === 'BUY'
                            ? 'bg-profit-bg text-profit border border-profit/20'
                            : 'bg-loss-bg text-loss border border-loss/20'
                        }`}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td className="py-2.5 font-bold text-slate-100 font-sans">
                      {order.symbol}
                    </td>
                    <td className="py-2.5 text-right">{order.quantity}</td>
                    <td className="py-2.5 text-right text-slate-300">
                      {formatCurrency(order.executionPrice)}
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-100">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-2.5 text-right font-sans">
                      <span className="text-emerald-400 text-[10px] font-semibold uppercase">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
