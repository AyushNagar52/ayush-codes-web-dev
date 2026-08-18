import React, { useState, useEffect } from 'react';
import { ListOrdered, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { formatCurrency, formatDate } from '../utils/formatters';
import { orderService } from '../services/orderService';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [sideFilter, setSideFilter] = useState('');
  const [symbolFilter, setSymbolFilter] = useState('');

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const data = await orderService.getOrders(page, 15, symbolFilter, sideFilter);
      setOrders(data.orders || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [sideFilter, symbolFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ListOrdered className="w-6 h-6 text-brand-400" />
            Order Execution History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete audit trail of all placed market orders.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Side Filter */}
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Sides</option>
            <option value="BUY">BUY Only</option>
            <option value="SELL">SELL Only</option>
          </select>

          {/* Symbol Search */}
          <input
            type="text"
            placeholder="Filter by symbol..."
            value={symbolFilter}
            onChange={(e) => setSymbolFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 w-36"
          />
        </div>
      </div>

      {/* Orders Table */}
      <Card className="space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pl-2">Side</th>
                  <th className="pb-3">Symbol</th>
                  <th className="pb-3 text-right">Shares</th>
                  <th className="pb-3 text-right">Exec Price</th>
                  <th className="pb-3 text-right">Total Amount</th>
                  <th className="pb-3 text-right">Type</th>
                  <th className="pb-3 text-right">Status</th>
                  <th className="pb-3 text-right pr-2">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 pl-2 font-sans">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.side === 'BUY'
                            ? 'bg-profit-bg text-profit border border-profit/20'
                            : 'bg-loss-bg text-loss border border-loss/20'
                        }`}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-slate-100 font-sans">
                      {order.symbol}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {order.companyName}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-medium text-slate-200">
                      {order.quantity.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right text-slate-300">
                      {formatCurrency(order.executionPrice)}
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-100">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3.5 text-right text-slate-400 font-sans text-[11px]">
                      {order.type}
                    </td>
                    <td className="py-3.5 text-right font-sans">
                      <span className="text-emerald-400 text-[10px] font-semibold uppercase">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-2 text-slate-500 font-sans text-[11px]">
                      {formatDate(order.createdAt, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400 font-sans">
            <span>
              Showing page {pagination.page} of {pagination.pages} ({pagination.total} total orders)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchOrders(pagination.page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchOrders(pagination.page + 1)}
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
