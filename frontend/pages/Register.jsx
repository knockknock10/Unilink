import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
    }

    setIsSubmitting(true);
    try {
      const result = await register(name, email, password);
      if (result.success) {
        toast.success('Welcome to the UniLink family! 🎉');
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card shadow-2xl overflow-hidden">
          <div className="p-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 text-accent">
                <UserPlus size={32} />
            </div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Join UniLink</h1>
            <p className="text-primary/70 mt-2 font-medium">Create your university student networking profile</p>
          </div>

          <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-accent transition-colors" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 bg-secondary/40 border border-white/5 rounded-2xl transition-all focus:bg-secondary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">University Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-accent transition-colors" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@university.edu"
                    className="w-full pl-12 pr-4 py-4 bg-secondary/40 border border-white/5 rounded-2xl transition-all focus:bg-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-accent transition-colors" size={20} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-secondary/40 border border-white/5 rounded-2xl transition-all focus:bg-secondary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Confirm</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-accent transition-colors" size={20} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-secondary/40 border border-white/5 rounded-2xl transition-all focus:bg-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:bg-accent/90 hover:scale-[1.02] transition-all"
            >
              <UserPlus size={20} />
              {isSubmitting ? 'Registering...' : 'Create Account'}
            </button>

            <p className="text-center text-primary/70 text-sm font-medium">
              Already a member?{' '}
              <Link to="/login" className="text-accent hover:underline font-bold transition-all">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
