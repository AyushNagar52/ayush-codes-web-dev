import React, { useState } from 'react';
import { ShoppingCart, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { formatCurrency } from '../../utils/formatters';
import { orderService } from '../../services/orderService';
import { usePortfolio } from '../../hooks/usePortfolio';

export const TradePanel = ({ stock, onTradeSuccess }) => {
  const { summary, refreshPortfolio } = usePortfolio();
  const [side, setSide] = useState('BUY'); // 'BUY' or 'SELL'
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!stock) return null;

  const currentPrice = stock.c || stock.price || 100.00;
  const totalEstimated = quantity > 0 ? quantity * currentPrice : 0;
  const cashBalance = summary ? summary.cashBalance : 0;

  // Check if user currently holds this stock
  const currentHolding = summary?.holdings?.find(
    (h) => h.symbol.toUpperCase() === stock.symbol.toUpperCase()
  );
  const sharesOwned = currentHolding ? currentHolding.quantity : 0;

  const handleExecuteTrade = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const intQty = parseInt(quantity, 10);
    if (!intQty || intQty <= 0) {
      setError('Please enter a valid quantity of at least 1 share.');
      return;
    }

    if (side === 'BUY' && totalEstimated > cashBalance) {
      setError(`Insufficient cash balance ($${cashBalance.toFixed(2)}) for this order ($${totalEstimated.toFixed(2)}).`);
      return;
    }

    if (side === 'SELL' && intQty > sharesOwned) {
      setError(`Cannot sell ${intQty} shares. You currently own ${sharesOwned} shares.`);
      return;
    }

    try {
      setLoading(true);
      if (side === 'BUY') {
        const res = await orderService.buyStock(stock.symbol, intQty);
        setSuccessMsg(`Successfully bought ${intQty} shares of ${stock.symbol}!`);
      } else {
        const res = await orderService.sellStock(stock.symbol, intQty);
        setSuccessMsg(`Successfully sold ${intQty} shares of ${stock.symbol}!`);
      }

      await refreshPortfolio();
      if (onTradeSuccess) onTradeSuccess();
    } catch (err) {
      console.error('Trade error:', err);
      setError(err.response?.data?.message || 'Failed to execute trade.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-brand-400" />
          Trade {stock.symbol}
        </h4>
        <span className="text-xs text-slate-400 font-mono">
          Live: <strong className="text-slate-100">{formatCurrency(currentPrice)}</strong>
        </span>
      </div>

      {/* Side Selector (BUY vs SELL) */}
      <div className="grid grid-cols-2 gap-2 mb-4 p-1 bg-slate-900 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => {
            setSide('BUY');
            setError(null);
            setSuccessMsg(null);
          }}
          className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
            side === 'BUY'
              ? 'bg-profit text-slate-950 shadow-md shadow-profit/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          BUY
        </button>
        <button
          type="button"
          onClick={() => {
            setSide('SELL');
            setError(null);
            setSuccessMsg(null);
          }}
          className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
            side === 'SELL'
              ? 'bg-loss text-white shadow-md shadow-loss/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          SELL
        </button>
      </div>

      <form onSubmit={handleExecuteTrade} className="space-y-4">
        {/* Quantity Input */}
        <div>
          <Input
            label="Shares Quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="font-mono text-base"
          />
          <div className="flex justify-between text-[11px] text-slate-500 mt-1 px-1">
            <span>
              {side === 'BUY' ? 'Available Cash:' : 'Shares Owned:'}
            </span>
            <span className="font-mono font-medium text-slate-300">
              {side === 'BUY' ? formatCurrency(cashBalance) : `${sharesOwned} shares`}
            </span>
          </div>
        </div>

        {/* Quick Quantity Buttons */}
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 5, 10, 25].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuantity(q)}
              className="py-1 text-[11px] font-mono rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              +{q}
            </button>
          ))}
        </div>

        {/* Summary Box */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Execution Type</span>
            <span className="font-semibold text-slate-200">Market Order (Instant)</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Price Per Share</span>
            <span className="font-mono text-slate-200">{formatCurrency(currentPrice)}</span>
          </div>
          <div className="h-px bg-slate-800 my-1"></div>
          <div className="flex justify-between text-sm font-bold text-slate-100">
            <span>Estimated {side === 'BUY' ? 'Cost' : 'Proceeds'}</span>
            <span className={`font-mono ${side === 'BUY' ? 'text-brand-400' : 'text-profit'}`}>
              {formatCurrency(totalEstimated)}
            </span>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="p-3 rounded-xl bg-loss-bg border border-loss/20 text-loss text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-profit-bg border border-profit/20 text-profit text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant={side === 'BUY' ? 'profit' : 'loss'}
          fullWidth
          loading={loading}
        >
          {side === 'BUY' ? `Buy ${quantity} Share${quantity > 1 ? 's' : ''}` : `Sell ${quantity} Share${quantity > 1 ? 's' : ''}`}
        </Button>
      </form>
    </div>
  );
};
