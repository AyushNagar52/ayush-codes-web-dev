import React from 'react';
import { User as UserIcon, Mail, Shield, Calendar, Wallet, TrendingUp, Key } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import { usePortfolio } from '../hooks/usePortfolio';

export const ProfilePage = () => {
  const { user, isAdmin } = useAuth();
  const { summary } = usePortfolio();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Trader Profile</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Account details, virtual capital status, and platform authorization.
        </p>
      </div>

      {/* User Information Card */}
      <Card className="space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-brand-500/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-100">{user?.name}</h2>
              <Badge variant={isAdmin ? 'brand' : 'default'}>
                {isAdmin ? 'Platform Admin' : 'Standard Trader'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">@{user?.username}</p>
          </div>
        </div>

        {/* Profile Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Mail className="w-3.5 h-3.5 text-slate-500" /> Email Address
            </span>
            <span className="font-semibold text-slate-200 block text-sm">{user?.email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Account Created
            </span>
            <span className="font-semibold text-slate-200 block text-sm">
              {formatDate(user?.createdAt)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Wallet className="w-3.5 h-3.5 text-slate-500" /> Starting Virtual Capital
            </span>
            <span className="font-semibold text-slate-200 font-mono block text-sm">
              {formatCurrency(summary?.initialCapital || 100000)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-slate-500" /> Current Net Worth
            </span>
            <span className="font-semibold text-brand-400 font-mono block text-sm">
              {formatCurrency(summary?.totalPortfolioValue || 100000)}
            </span>
          </div>
        </div>
      </Card>

      {/* Safety Notice */}
      <Card className="border border-slate-800 bg-slate-900/40 text-xs text-slate-400 space-y-2">
        <h4 className="font-bold text-slate-200 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" /> Simulation Account Safeguards
        </h4>
        <p className="leading-relaxed">
          Your account is configured with zero financial liability. All executed orders, cash balances, and holdings are strictly simulated with virtual money.
        </p>
      </Card>
    </div>
  );
};
