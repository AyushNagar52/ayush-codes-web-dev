import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">TradeSim</span>
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
