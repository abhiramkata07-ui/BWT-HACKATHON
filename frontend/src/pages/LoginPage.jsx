import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Lock, Mail, Eye, EyeOff, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();

  // Pre-configured with the requested credentials for zero friction!
  const [email, setEmail] = useState('abhiram');
  const [password, setPassword] = useState('ABHI@143');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!email.trim() || !password) {
      setError('Please provide your username or email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email.trim(), password);
      toast.success(`Login successful! Welcome back, ${email}.`);
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your login details.');
      toast.error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Instant 1-Click Demo Login
  const handleQuickDemoLogin = async (demoUser = 'abhiram', demoPass = 'ABHI@143') => {
    setEmail(demoUser);
    setPassword(demoPass);
    setLoading(true);
    setError('');
    try {
      await login(demoUser, demoPass);
      toast.success('Instant Demo Access Granted! Welcome, Abhiram.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Quick login failed.');
      toast.error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-brand selection:text-navy-950">
      {/* Background ambient neon glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-11 h-11 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand shadow-glow group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 text-brand" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Fit<span className="text-brand">Track</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Welcome back to FitTrack
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to view your workouts, metrics, and fitness progress
        </p>
      </div>

      {/* Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-navy-900/90 border border-slate-800/80 py-8 px-6 sm:px-10 rounded-2xl shadow-2xl backdrop-blur-md">
          {/* Quick Demo Access Pill */}
          <div className="mb-6 p-3.5 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-between gap-3 shadow-glow">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-brand animate-bounce" />
              <div className="text-left">
                <span className="text-xs font-bold text-white block">Preloaded Demo Credentials</span>
                <span className="text-[11px] text-brand font-medium">User: abhiram | Pass: ABHI@143</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('abhiram', 'ABHI@143')}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-brand text-navy-950 hover:bg-brand-400 transition-all shadow-sm flex items-center gap-1 flex-shrink-0"
            >
              1-Click Login
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Username or email (e.g. abhiram)"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-brand/80 font-semibold cursor-pointer hover:underline" onClick={() => setPassword('ABHI@143')}>
                  Reset to ABHI@143
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-brand focus:ring-brand focus:ring-offset-navy-950 bg-slate-950"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-xs text-slate-400">
                  Remember my session
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2 text-center">
              Or Select Demo Role
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('abhiram', 'ABHI@143')}
                className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-brand/40 text-slate-300 hover:text-brand transition-all font-medium text-center"
              >
                Abhiram (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('sarah@fittrack.com', 'Demo@123')}
                className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all font-medium text-center"
              >
                Sarah (Athlete)
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-slate-400 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
