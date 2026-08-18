import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

export const PublicLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TradeSim</span>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm" className="gap-2">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started ($100k Cash)</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 TradeSim — Simulated Equity Paper Trading Platform. Strictly for educational simulation.</p>
          <p className="mt-1 text-slate-600">No real money, brokerage accounts, or real trading involved.</p>
        </div>
      </footer>
    </div>
  );
};
