import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';

// Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { MarketsPage } from '../pages/MarketsPage';
import { StockDetailsPage } from '../pages/StockDetailsPage';
import { PortfolioPage } from '../pages/PortfolioPage';
import { WatchlistPage } from '../pages/WatchlistPage';
import { OrdersPage } from '../pages/OrdersPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Marketing Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Guest / Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authenticated Trader Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/stock/:symbol" element={<StockDetailsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin Role Only Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Fallback Route */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
