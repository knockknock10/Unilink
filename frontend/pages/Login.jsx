import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, Compass, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const MotionDiv = motion.div;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success(`Welcome back ${result.name || ''}! ✨`);
        navigate('/feed');
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="glass-card overflow-hidden">
          <div className="bg-gradient-to-br from-secondary to-background p-12 flex flex-col items-center justify-center text-primary relative overflow-hidden">
            <MotionDiv
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-button/20 rounded-full blur-3xl"
            />
            <Compass size={48} className="mb-4 drop-shadow-xl text-button" />
            <h1 className="text-4xl font-black subpixel-antialiased drop-shadow-sm text-primary">UniLink</h1>
            <p className="text-primary/90 font-medium text-sm mt-1">Connect. Network. Excel.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink/70 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent group-focus-within:text-accent transition-colors" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="input-field pl-12 pr-4 py-4"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-ink/70 uppercase tracking-widest px-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent group-focus-within:text-accent transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-12 pr-12 py-4"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-accent transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-lg shadow-button/20 hover:scale-[1.02] disabled:opacity-50"
            >
              <LogIn size={20} />
              {isSubmitting ? 'Verifying...' : 'Login Now'}
            </button>

            <div className="text-center pt-2">
              <p className="text-ink/70 text-sm font-medium">
                New to UniLink?{' '}
                <Link to="/register" className="text-accent hover:underline font-bold transition-all">
                  Create an account
                </Link>
              </p>
              <p className="text-ink/40 text-xs font-medium mt-3">
                Are you an admin?{' '}
                <Link to="/admin/login" className="text-button hover:underline font-bold transition-all">
                  Admin Login →
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
