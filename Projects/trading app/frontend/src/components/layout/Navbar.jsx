import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, User as UserIcon, Shield, TrendingUp, Wallet } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePortfolio } from '../../hooks/usePortfolio';
import { formatCurrency } from '../../utils/formatters';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { summary } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stock/${searchQuery.trim().toUpperCase()}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      {/* Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search stock symbol (e.g. AAPL, NVDA)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </form>
      </div>

      {/* Right Balance Pills & User Info */}
      <div className="flex items-center gap-3 md:gap-5">
        {summary && (
          <div className="hidden sm:flex items-center gap-4 bg-slate-900/90 border border-slate-800/80 px-3.5 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Wallet className="w-3.5 h-3.5 text-slate-500" />
              <span>Cash:</span>
              <span className="font-semibold text-slate-100 font-mono">
                {formatCurrency(summary.cashBalance)}
              </span>
            </div>
            <div className="h-3.5 w-px bg-slate-800"></div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
              <span>Net Worth:</span>
              <span className="font-semibold text-brand-400 font-mono">
                {formatCurrency(summary.totalPortfolioValue)}
              </span>
            </div>
          </div>
        )}

        {/* User Pill / Profile */}
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors text-xs font-medium text-slate-200"
          >
            <div className="w-6 h-6 rounded-full bg-brand-600/30 border border-brand-500/50 flex items-center justify-center text-brand-400 font-bold text-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="hidden md:inline">{user?.name}</span>
            {isAdmin && (
              <span className="bg-brand-500/20 text-brand-300 text-[10px] px-1.5 py-0.5 rounded border border-brand-500/30">
                Admin
              </span>
            )}
          </Link>

          <button
            onClick={logout}
            title="Log Out"
            className="p-2 rounded-xl text-slate-400 hover:text-loss hover:bg-loss-bg transition-colors border border-transparent hover:border-loss/20"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
