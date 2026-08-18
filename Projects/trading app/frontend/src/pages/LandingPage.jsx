import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { TickerMarquee } from '../components/market/TickerMarquee';
import { marketService } from '../services/marketService';

export const LandingPage = () => {
  const [marketOverview, setMarketOverview] = useState(null);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const data = await marketService.getOverview();
        setMarketOverview(data);
      } catch (err) {
        console.error('Failed to load landing market overview:', err);
      }
    };
    fetchMarket();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Ticker Marquee */}
      {marketOverview && <TickerMarquee stocks={marketOverview.allStocks} />}

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Zero-Risk Simulated Stock Trading Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Master the Markets with{' '}
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            $100,000 Virtual Capital
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Trade real-time US equities, test investment strategies, track detailed portfolio analytics, and build trading confidence without risking real money.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto gap-2 px-8">
              Claim $100,000 Virtual Cash <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-6">
              Sign In to Portfolio
            </Button>
          </Link>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-profit-bg border border-profit/20 flex items-center justify-center text-profit">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Live Market Simulation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience responsive order execution matching live market prices with instant weighted average cost calculation and execution ledgers.
            </p>
          </Card>

          <Card hover className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Portfolio Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track net worth progression, active holdings, asset allocation donut charts, and realized vs. unrealized profit and loss metrics.
            </p>
          </Card>

          <Card hover className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">100% Risk-Free Practice</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strictly educational simulation platform. No credit cards, payment gateways, or real money required ever.
            </p>
          </Card>
        </div>
      </section>

      {/* Demo Credentials Helper Card */}
      <section className="max-w-xl mx-auto px-4">
        <div className="glass-card rounded-2xl p-6 border border-brand-500/30 text-center space-y-3 shadow-xl">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            ⚡ Instant Demo Access
          </h4>
          <p className="text-xs text-slate-400">
            You can create a new account or instantly log in using pre-seeded test credentials:
          </p>
          <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-slate-300 space-y-1 text-left border border-slate-800">
            <div><strong className="text-brand-400">Demo Trader:</strong> trader@papertrade.com / TraderPassword123!</div>
            <div><strong className="text-purple-400">Admin Account:</strong> admin@papertrade.com / AdminPassword123!</div>
          </div>
        </div>
      </section>
    </div>
  );
};
