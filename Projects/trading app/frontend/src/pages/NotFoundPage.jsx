import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingDown, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-loss-bg border border-loss/20 flex items-center justify-center text-loss">
        <TrendingDown className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-white font-mono">404</h1>
      <h2 className="text-lg font-bold text-slate-200">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm">
        The requested financial route or ticker symbol page does not exist or has been relocated.
      </p>
      <Link to="/dashboard" className="pt-2">
        <Button size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
