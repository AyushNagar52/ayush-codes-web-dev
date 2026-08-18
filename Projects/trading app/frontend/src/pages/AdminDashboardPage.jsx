import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  BarChart,
  DollarSign,
  TrendingUp,
  Activity,
  ListOrdered,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { formatCurrency, formatDate } from '../utils/formatters';
import { adminService } from '../services/adminService';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [usersData, setUsersData] = useState({ users: [], pagination: { page: 1, pages: 1 } });
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async (page = 1) => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(page, 10),
      ]);
      setStats(statsRes);
      setUsersData(usersRes);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData(1);
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-purple-400" />
          Administrative Control Center
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Platform-wide telemetry, aggregate trading volume, and user account auditing.
        </p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Traders
          </span>
          <h3 className="text-2xl font-black text-slate-100 font-mono mt-1">
            {stats?.totalUsers || 0}
          </h3>
          <p className="text-xs text-slate-500 mt-2">Registered platform users</p>
        </Card>

        <Card hover>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Simulated Volume
          </span>
          <h3 className="text-2xl font-black text-brand-400 font-mono mt-1">
            {formatCurrency(stats?.totalVolume || 0)}
          </h3>
          <p className="text-xs text-slate-500 mt-2">Cumulative gross turnover</p>
        </Card>

        <Card hover>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Executed Orders
          </span>
          <h3 className="text-2xl font-black text-slate-100 font-mono mt-1">
            {stats?.executedOrders || 0}
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            {stats?.buyOrders || 0} Buys / {stats?.sellOrders || 0} Sells
          </p>
        </Card>

        <Card hover>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            System Liquidity
          </span>
          <h3 className="text-2xl font-black text-profit font-mono mt-1">
            {formatCurrency((stats?.totalUsers || 0) * 100000)}
          </h3>
          <p className="text-xs text-slate-500 mt-2">Total provisioned virtual cash</p>
        </Card>
      </div>

      {/* Most Traded Equities Section */}
      <Card className="space-y-4">
        <h3 className="text-base font-bold text-slate-100">Most Traded Equities Platform-Wide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats?.topTradedStocks?.map((item) => (
            <div
              key={item.symbol}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-base text-brand-400 font-sans">{item.symbol}</span>
                <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {item.tradeCount} trades
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{item.companyName}</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-mono text-[11px]">
                <span className="text-slate-500">Volume:</span>
                <span className="text-slate-200 font-bold">{formatCurrency(item.totalValue)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* User Management Ledger */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100">Platform User Registry</h3>
          <span className="text-xs text-slate-500">
            {usersData.pagination?.total || 0} registered traders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-2">Name & Username</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3 text-right">Cash Balance</th>
                <th className="pb-3 text-right">Holdings</th>
                <th className="pb-3 text-right">Total Orders</th>
                <th className="pb-3 text-right pr-2">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {usersData.users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 pl-2 font-sans">
                    <div className="font-bold text-slate-100">{u.name}</div>
                    <div className="text-[11px] text-slate-500">@{u.username}</div>
                  </td>
                  <td className="py-3.5 text-slate-300 font-sans">{u.email}</td>
                  <td className="py-3.5 font-sans">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-bold text-slate-100">
                    {formatCurrency(u.cashBalance)}
                  </td>
                  <td className="py-3.5 text-right text-slate-300">{u.holdingsCount}</td>
                  <td className="py-3.5 text-right text-slate-300">{u.ordersCount}</td>
                  <td className="py-3.5 text-right pr-2 text-slate-500 font-sans text-[11px]">
                    {formatDate(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {usersData.pagination?.pages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400 font-sans">
            <span>
              Page {usersData.pagination.page} of {usersData.pagination.pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={usersData.pagination.page <= 1}
                onClick={() => fetchAdminData(usersData.pagination.page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={usersData.pagination.page >= usersData.pagination.pages}
                onClick={() => fetchAdminData(usersData.pagination.page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
