import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  Star,
  ListOrdered,
  Receipt,
  PieChart,
  User,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
  const { isAdmin } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Markets', path: '/markets', icon: TrendingUp },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Watchlist', path: '/watchlist', icon: Star },
    { name: 'Order History', path: '/orders', icon: ListOrdered },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-950/95 border-r border-slate-800/80 min-h-screen p-4 select-none">
      {/* Brand Header */}
      <Link to="/dashboard" className="flex items-center gap-3 px-3 py-3 mb-6 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            TradeSim
          </span>
          <span className="block text-[10px] text-brand-400 font-mono tracking-wider uppercase font-semibold">
            Paper Trading
          </span>
        </div>
      </Link>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        {/* Admin Navigation */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-800/60">
            <span className="px-3 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Management
            </span>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 mt-1 rounded-xl text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/15 text-purple-400 border border-purple-500/30 font-semibold'
                    : 'text-slate-400 hover:text-purple-300 hover:bg-slate-900 border border-transparent'
                }`
              }
            >
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Admin Center</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Live Market Simulation Badge */}
      <div className="mt-auto p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-slate-300">Simulation Status</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          Virtual trading environment active with $100k starting capital.
        </p>
      </div>
    </aside>
  );
};
