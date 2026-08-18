import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
    try {
      setLoading(true);
      await login(demoEmail, demoPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-100">Welcome Back</h2>
        <p className="text-xs text-slate-400 mt-1">Sign in to your paper-trading portfolio</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-loss-bg border border-loss/20 text-loss text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="name@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" fullWidth loading={loading}>
          Sign In
        </Button>
      </form>

      {/* Quick Demo Credentials Buttons */}
      <div className="pt-4 border-t border-slate-800 space-y-2">
        <span className="block text-[11px] text-center text-slate-500 font-semibold uppercase tracking-wider">
          Quick Demo Logins
        </span>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('trader@papertrade.com', 'TraderPassword123!')}
          >
            Demo Trader
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('admin@papertrade.com', 'AdminPassword123!')}
          >
            Admin Portal
          </Button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
          Create Account ($100k Cash)
        </Link>
      </div>
    </div>
  );
};
