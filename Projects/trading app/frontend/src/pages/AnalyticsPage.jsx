import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, TrendingDown, Award, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { PerformanceChart } from '../charts/PerformanceChart';
import { AllocationDonut } from '../charts/AllocationDonut';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { usePortfolio } from '../hooks/usePortfolio';
import { portfolioService } from '../services/portfolioService';

export const AnalyticsPage = () => {
  const { summary, loading } = usePortfolio();
  const [performanceData, setPerformanceData] = useState([]);
  const [chartRange, setChartRange] = useState('1M');

  useEffect(() => {
    const fetchPerf = async () => {
      try {
        const data = await portfolioService.getPerformance(chartRange);
        setPerformanceData(data);
      } catch (err) {
        console.error('Error fetching performance:', err);
      }
    };
    fetchPerf();
  }, [chartRange]);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const holdings = summary?.holdings || [];

  // Identify Best & Worst performing active holdings
  const sortedByPnL = [...holdings].sort(
    (a, b) => b.unrealizedPnLPercentage - a.unrealizedPnLPercentage
  );
  const bestPerformer = sortedByPnL.length > 0 ? sortedByPnL[0] : null;
  const worstPerformer = sortedByPnL.length > 1 ? sortedByPnL[sortedByPnL.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <PieChart className="w-6 h-6 text-brand-400" />
          Portfolio Analytics & Insights
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Deep-dive analysis of your risk exposure, top performers, and return metrics.
        </p>
      </div>

      {/* Top Cards: Best Performer, Worst Performer, Total Return */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Return */}
        <Card hover>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            All-Time Net Return
          </span>
          <h3
            className={`text-2xl font-black font-mono mt-1 ${
              (summary?.totalReturnPercentage || 0) >= 0 ? 'text-profit' : 'text-loss'
            }`}
          >
            {formatPercent(summary?.totalReturnPercentage || 0)}
          </h3>
          <p className="text-xs text-slate-500 mt-2 font-mono">
            {formatCurrency(summary?.totalUnrealizedPnL || 0)} unrealized gain
          </p>
        </Card>

        {/* Best Performer */}
        <Card hover>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Top Asset
            </span>
            <Award className="w-4 h-4 text-profit" />
          </div>
          {bestPerformer ? (
            <div className="mt-1">
              <h4 className="text-xl font-bold text-slate-100 font-sans">
                {bestPerformer.symbol}
              </h4>
              <p className="text-xs font-mono font-bold text-profit mt-1">
                +{formatCurrency(bestPerformer.unrealizedPnL)} (
                {formatPercent(bestPerformer.unrealizedPnLPercentage)})
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-2">No positions yet</p>
          )}
        </Card>

        {/* Worst Performer */}
        <Card hover>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Underperforming Asset
            </span>
            <AlertTriangle className="w-4 h-4 text-loss" />
          </div>
          {worstPerformer ? (
            <div className="mt-1">
              <h4 className="text-xl font-bold text-slate-100 font-sans">
                {worstPerformer.symbol}
              </h4>
              <p
                className={`text-xs font-mono font-bold mt-1 ${
                  worstPerformer.unrealizedPnL >= 0 ? 'text-profit' : 'text-loss'
                }`}
              >
                {formatCurrency(worstPerformer.unrealizedPnL)} (
                {formatPercent(worstPerformer.unrealizedPnLPercentage)})
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-2">Single or no active positions</p>
          )}
        </Card>
      </div>

      {/* Historical Performance Area Chart */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Net Worth Growth Curve</h3>
            <p className="text-xs text-slate-400">Simulated portfolio equity vs cash reserve</p>
          </div>
          <div className="flex gap-1">
            {['1W', '1M', '1Y'].map((r) => (
              <button
                key={r}
                onClick={() => setChartRange(r)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  chartRange === r
                    ? 'bg-slate-800 text-brand-400 border border-slate-700'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <PerformanceChart data={performanceData} height={300} />
      </Card>

      {/* Asset Allocation & Holdings Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-100">Holdings Risk Distribution</h3>
          <div className="space-y-3">
            {holdings.map((h) => {
              const weight =
                summary?.totalPortfolioValue > 0
                  ? (h.positionValue / summary.totalPortfolioValue) * 100
                  : 0;
              return (
                <div key={h.symbol} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-200">{h.symbol} ({h.companyName})</span>
                    <span className="font-mono text-slate-300">
                      {formatCurrency(h.positionValue)} ({weight.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(2, weight))}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Capital Ratio</h3>
            <p className="text-xs text-slate-400">Equity vs Cash Liquidity</p>
          </div>

          <AllocationDonut
            holdings={holdings}
            cash={summary?.cashBalance || 100000}
            height={240}
          />
        </Card>
      </div>
    </div>
  );
};
