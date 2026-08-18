import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { Button } from '../common/Button';

export const HoldingsTable = ({ holdings = [], onTradeClick }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs">
        <p className="text-sm font-semibold text-slate-400 mb-1">No Active Stock Positions</p>
        <p className="mb-4">Explore the markets and buy stocks using your virtual cash.</p>
        <Link to="/markets">
          <Button size="sm" variant="outline">
            Browse Markets <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="pb-3 pl-2">Asset</th>
            <th className="pb-3 text-right">Shares</th>
            <th className="pb-3 text-right">Avg Cost</th>
            <th className="pb-3 text-right">Market Price</th>
            <th className="pb-3 text-right">Total Value</th>
            <th className="pb-3 text-right">Unrealized P&L</th>
            <th className="pb-3 text-right pr-2">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {holdings.map((h) => {
            const isProfit = h.unrealizedPnL >= 0;
            return (
              <tr key={h._id || h.symbol} className="hover:bg-slate-900/50 transition-colors">
                {/* Symbol & Company */}
                <td className="py-3.5 pl-2 font-sans">
                  <Link to={`/stock/${h.symbol}`} className="hover:text-brand-400 transition-colors">
                    <div className="font-bold text-slate-100">{h.symbol}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{h.companyName}</div>
                  </Link>
                </td>

                {/* Shares Quantity */}
                <td className="py-3.5 text-right font-medium text-slate-200">
                  {h.quantity.toLocaleString()}
                </td>

                {/* Average Buy Price */}
                <td className="py-3.5 text-right text-slate-400">
                  {formatCurrency(h.averageBuyPrice)}
                </td>

                {/* Live Market Price */}
                <td className="py-3.5 text-right font-semibold text-slate-100">
                  {formatCurrency(h.currentPrice)}
                </td>

                {/* Position Market Value */}
                <td className="py-3.5 text-right font-bold text-slate-100">
                  {formatCurrency(h.positionValue)}
                </td>

                {/* Unrealized P&L */}
                <td className="py-3.5 text-right">
                  <div
                    className={`inline-flex items-center gap-1 font-bold ${
                      isProfit ? 'text-profit' : 'text-loss'
                    }`}
                  >
                    {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{formatCurrency(h.unrealizedPnL)}</span>
                    <span className="text-[10px]">({formatPercent(h.unrealizedPnLPercentage)})</span>
                  </div>
                </td>

                {/* Trade Button */}
                <td className="py-3.5 text-right pr-2 font-sans">
                  <Link to={`/stock/${h.symbol}`}>
                    <Button size="sm" variant="secondary" className="text-xs px-2.5 py-1">
                      Trade
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
