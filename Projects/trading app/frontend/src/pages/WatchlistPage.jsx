import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, TrendingDown, Trash2, ArrowUpRight, Plus } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { watchlistService } from '../services/watchlistService';

export const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const data = await watchlistService.getWatchlist();
      setWatchlist(data);
    } catch (err) {
      console.error('Failed to load watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (symbol) => {
    try {
      await watchlistService.remove(symbol);
      setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    }
  };

  if (loading && watchlist.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            Watchlist
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time prices for your pinned equity assets.
          </p>
        </div>
        <Link to="/markets">
          <Button size="sm" variant="outline" className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Stocks to Watchlist
          </Button>
        </Link>
      </div>

      {watchlist.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Your Watchlist is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Pin your favorite stocks from the markets page or stock details view to track them here.
          </p>
          <Link to="/markets" className="inline-block pt-2">
            <Button size="sm">Browse Markets</Button>
          </Link>
        </Card>
      ) : (
        <Card className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pl-2">Symbol</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3 text-right">Price</th>
                  <th className="pb-3 text-right">Today Change</th>
                  <th className="pb-3 text-right">Day High</th>
                  <th className="pb-3 text-right">Day Low</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {watchlist.map((item) => {
                  const isUp = item.quote.change >= 0;
                  return (
                    <tr key={item._id || item.symbol} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 pl-2 font-bold text-brand-400 font-sans text-sm">
                        <Link to={`/stock/${item.symbol}`} className="hover:underline">
                          {item.symbol}
                        </Link>
                      </td>
                      <td className="py-3.5 font-sans font-medium text-slate-200">
                        {item.companyName}
                      </td>
                      <td className="py-3.5 text-right font-bold text-slate-100">
                        {formatCurrency(item.quote.price)}
                      </td>
                      <td className="py-3.5 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            isUp ? 'text-profit' : 'text-loss'
                          }`}
                        >
                          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {formatCurrency(item.quote.change)} ({formatPercent(item.quote.changePercent)})
                        </span>
                      </td>
                      <td className="py-3.5 text-right text-slate-400">
                        {formatCurrency(item.quote.high)}
                      </td>
                      <td className="py-3.5 text-right text-slate-400">
                        {formatCurrency(item.quote.low)}
                      </td>
                      <td className="py-3.5 text-right pr-2 font-sans">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/stock/${item.symbol}`}>
                            <Button size="sm" className="px-2.5 py-1 text-xs gap-1">
                              Trade <ArrowUpRight className="w-3 h-3" />
                            </Button>
                          </Link>
                          <button
                            onClick={() => handleRemove(item.symbol)}
                            title="Remove from watchlist"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-loss hover:bg-loss-bg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
