import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Compass } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
        navigate('/');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="glass-card overflow-hidden">
          <div className="bg-gradient-to-br from-accent to-secondary/80 p-12 flex flex-col items-center justify-center text-primary relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
            />
            <Compass size={48} className="mb-4 drop-shadow-xl text-accent" />
            <h1 className="text-4xl font-black subpixel-antialiased drop-shadow-sm text-primary">UniLink</h1>
            <p className="text-primary/70 font-medium text-sm mt-1">Connect. Network. Excel.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-accent transition-colors" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-12 pr-4 py-4 bg-secondary/40 text-primary border border-white/5 rounded-2xl transition-all focus:bg-secondary/60"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-accent transition-colors" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-secondary/40 text-primary border border-white/5 rounded-2xl transition-all focus:bg-secondary/60"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:bg-accent/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              <LogIn size={20} />
              {isSubmitting ? 'Verifying...' : 'Login Now'}
            </button>

            <div className="text-center pt-2">
              <p className="text-primary/50 text-sm font-medium">
                New to UniLink?{' '}
                <Link to="/register" className="text-accent hover:underline font-bold transition-all">
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
