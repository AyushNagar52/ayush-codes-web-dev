import React from 'react';
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

export const PerformanceChart = ({ data = [], height = 280 }) => {
  const minVal = data.length > 0 ? Math.min(...data.map((d) => d.portfolioValue)) * 0.98 : 90000;
  const maxVal = data.length > 0 ? Math.max(...data.map((d) => d.portfolioValue)) * 1.02 : 110000;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs">
          <p className="text-slate-400 font-mono mb-1">{point.date}</p>
          <div className="space-y-1">
            <p className="font-bold text-sm text-brand-400 font-mono">
              Net Worth: {formatCurrency(point.portfolioValue)}
            </p>
            <p className="text-[11px] text-slate-400">
              Cash: {formatCurrency(point.cashBalance)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="performanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis
            domain={[minVal, maxVal]}
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="portfolioValue"
            stroke="#6366F1"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#performanceGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
