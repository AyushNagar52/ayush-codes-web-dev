import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/formatters';

export const AllocationDonut = ({ holdings = [], cash = 0, height = 260 }) => {
  const COLORS = ['#6366F1', '#10B981', '#38BDF8', '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6'];

  const data = [
    ...holdings.map((h, i) => ({
      name: h.symbol,
      value: h.positionValue,
      color: COLORS[i % COLORS.length],
    })),
    {
      name: 'Cash Reserve',
      value: cash,
      color: '#334155',
    },
  ].filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-2 rounded-xl text-xs shadow-xl">
          <p className="font-semibold text-slate-100">{item.name}</p>
          <p className="font-mono text-brand-400 font-bold">{formatCurrency(item.value)}</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-slate-500">
        No active assets to display
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B0F19" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend list */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 max-h-24 overflow-y-auto px-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="font-medium text-slate-200">{entry.name}</span>
            <span className="font-mono text-slate-400">({formatCurrency(entry.value, false)})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
