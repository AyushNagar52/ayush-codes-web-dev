import React, { useState, useEffect } from 'react';
import { Receipt, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { formatCurrency, formatDate } from '../utils/formatters';
import { orderService } from '../services/orderService';

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const data = await orderService.getTransactions(page, 15);
      setTransactions(data.transactions || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Receipt className="w-6 h-6 text-brand-400" />
          Cash & Ledger Transactions
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Immutable double-entry financial ledger of all cash movements and realized returns.
        </p>
      </div>

      <Card className="space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pl-2">Type</th>
                  <th className="pb-3">Symbol</th>
                  <th className="pb-3 text-right">Shares</th>
                  <th className="pb-3 text-right">Price</th>
                  <th className="pb-3 text-right">Debit / Credit</th>
                  <th className="pb-3 text-right">Balance Before</th>
                  <th className="pb-3 text-right">Balance After</th>
                  <th className="pb-3 text-right pr-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {transactions.map((tx) => {
                  const isBuy = tx.type === 'BUY_STOCK';
                  return (
                    <tr key={tx._id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 pl-2 font-sans">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            isBuy
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-profit-bg text-profit border border-profit/20'
                          }`}
                        >
                          {isBuy ? 'DEBIT (BUY)' : 'CREDIT (SELL)'}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-slate-100 font-sans">{tx.symbol}</td>
                      <td className="py-3.5 text-right text-slate-300">{tx.quantity}</td>
                      <td className="py-3.5 text-right text-slate-400">
                        {formatCurrency(tx.pricePerShare)}
                      </td>
                      <td
                        className={`py-3.5 text-right font-bold ${
                          isBuy ? 'text-loss' : 'text-profit'
                        }`}
                      >
                        {isBuy ? '-' : '+'}
                        {formatCurrency(tx.totalAmount)}
                      </td>
                      <td className="py-3.5 text-right text-slate-400">
                        {formatCurrency(tx.cashBalanceBefore)}
                      </td>
                      <td className="py-3.5 text-right font-bold text-slate-100">
                        {formatCurrency(tx.cashBalanceAfter)}
                      </td>
                      <td className="py-3.5 text-right pr-2 text-slate-500 font-sans text-[11px]">
                        {formatDate(tx.createdAt, true)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400 font-sans">
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchTransactions(pagination.page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchTransactions(pagination.page + 1)}
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
