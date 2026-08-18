import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export const TickerMarquee = ({ stocks = [] }) => {
  if (!stocks || stocks.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-slate-950/60 border-y border-slate-900 py-2.5">
      <div className="flex items-center gap-6 animate-none overflow-x-auto no-scrollbar px-4">
        {stocks.map((stock) => {
          const isUp = stock.d >= 0;
          return (
            <Link
              key={stock.symbol}
              to={`/stock/${stock.symbol}`}
              className="flex items-center gap-2.5 px-3 py-1 rounded-lg bg-slate-900/50 hover:bg-slate-850 border border-slate-800/80 transition-colors shrink-0 text-xs"
            >
              <span className="font-bold text-slate-100">{stock.symbol}</span>
              <span className="font-mono text-slate-300">{formatCurrency(stock.c)}</span>
              <span
                className={`flex items-center gap-0.5 font-mono font-semibold text-[11px] ${
                  isUp ? 'text-profit' : 'text-loss'
                }`}
              >
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatPercent(stock.dp)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
