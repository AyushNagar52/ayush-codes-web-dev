import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, TrendingUp, TrendingDown, DollarSign, Wallet, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { HoldingsTable } from '../components/portfolio/HoldingsTable';
import { AllocationDonut } from '../charts/AllocationDonut';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { usePortfolio } from '../hooks/usePortfolio';

export const PortfolioPage = () => {
  const { summary, loading } = usePortfolio();

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const isProfit = (summary?.totalUnrealizedPnL || 0) >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Portfolio</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed breakdown of your stock holdings, total net worth, and cash reserves.
          </p>
        </div>
        <Link to="/markets">
          <Button size="sm" className="gap-1.5">
            Buy More Stocks <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Portfolio Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Total Net Worth
          </span>
          <h3 className="text-2xl font-black text-slate-100 font-mono mt-1">
            {formatCurrency(summary?.totalPortfolioValue || 100000)}
          </h3>
          <div className="mt-2 text-xs font-mono">
            <span className={isProfit ? 'text-profit font-bold' : 'text-loss font-bold'}>
              {isProfit ? '+' : ''}
              {formatCurrency(summary?.totalUnrealizedPnL || 0)} (
              {formatPercent(summary?.totalReturnPercentage || 0)})
            </span>
          </div>
        </Card>

        <Card hover>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Available Cash
          </span>
          <h3 className="text-2xl font-black text-slate-100 font-mono mt-1">
            {formatCurrency(summary?.cashBalance || 100000)}
          </h3>
          <p className="mt-2 text-xs text-slate-500">Unallocated liquidity</p>
        </Card>

        <Card hover>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Invested Equity
          </span>
          <h3 className="text-2xl font-black text-slate-100 font-mono mt-1">
            {formatCurrency(summary?.investedValue || 0)}
          </h3>
          <p className="mt-2 text-xs text-slate-400">
            Across {summary?.holdingsCount || 0} active positions
          </p>
        </Card>
      </div>

      {/* Main Grid: Holdings Table & Allocation Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100">
              Holdings ({summary?.holdings?.length || 0})
            </h3>
            <span className="text-xs text-slate-500">Sorted by value</span>
          </div>

          <HoldingsTable holdings={summary?.holdings || []} />
        </Card>

        <Card className="space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Asset Allocation</h3>
            <p className="text-xs text-slate-400">Portfolio capital distribution</p>
          </div>

          <AllocationDonut
            holdings={summary?.holdings || []}
            cash={summary?.cashBalance || 100000}
            height={260}
          />
        </Card>
      </div>
    </div>
  );
};
