import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await register(name, username, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-profit/10 border border-profit/20 text-profit text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Includes $100,000 Virtual Capital
        </div>
        <h2 className="text-xl font-bold text-slate-100">Create Free Account</h2>
        <p className="text-xs text-slate-400 mt-1">Start simulated trading in under 30 seconds</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-loss-bg border border-loss/20 text-loss text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Name"
          type="text"
          icon={User}
          placeholder="Ayush Nagar"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Username"
          type="text"
          placeholder="ayush_trader"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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
          label="Password (min 6 characters)"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" fullWidth loading={loading} className="mt-2">
          Start Trading with $100,000
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
};
