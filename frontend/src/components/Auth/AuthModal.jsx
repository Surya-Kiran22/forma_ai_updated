import React, { useState } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { api } from '../../services/api';

export function AuthModal({ isOpen, onClose }) {
  const { setUser } = useFormStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('user@forma.ai');
  const [password, setPassword] = useState('Password123!');
  const [name, setName] = useState('Demo Policyholder');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { email, password, name } : { email, password };
      const res = await api.post(endpoint, payload);

      const { user, tokens } = res.data.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      setUser(user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in">
      <div className="panel bg-ink-800 w-full max-w-md p-7 shadow-glow relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream-400 hover:text-emerald-300 font-bold text-xs transition-colors"
        >
          [ Close ]
        </button>

        <h2 className="font-serif text-2xl font-bold text-cream-50 border-b border-ink-500/60 pb-3 mb-5">
          {isRegister ? 'Register Forma AI User' : 'Sign In to Forma AI'}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-500/60 bg-red-500/10 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-cream-200 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-dark text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-cream-200 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-dark text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-cream-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-dark text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-xs py-2.5"
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-ink-500/50 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline font-bold"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
