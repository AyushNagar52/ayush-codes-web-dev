import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

export const PriceChart = ({
  data = [],
  activeRange = '1M',
  onRangeChange,
  isProfit = true,
  height = 320,
}) => {
  const ranges = ['1D', '1W', '1M', '1Y'];

  const strokeColor = isProfit ? '#10B981' : '#F43F5E';
  const fillColor = isProfit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';

  const minPrice = data.length > 0 ? Math.min(...data.map((d) => d.price)) * 0.995 : 0;
  const maxPrice = data.length > 0 ? Math.max(...data.map((d) => d.price)) * 1.005 : 100;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs">
          <p className="text-slate-400 font-mono mb-1">{point.date}</p>
          <p className="font-bold text-sm text-slate-100 font-mono">
            {formatCurrency(point.price)}
          </p>
          {point.volume && (
            <p className="text-[10px] text-slate-500 mt-1">
              Vol: {Number(point.volume).toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Timeframe Bar */}
      {onRangeChange && (
        <div className="flex items-center justify-end gap-1 mb-4">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => onRangeChange(r)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activeRange === r
                  ? 'bg-slate-800 text-brand-400 border border-slate-700'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Chart Canvas */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
