import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PortfolioProvider>
          <AppRoutes />
        </PortfolioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
