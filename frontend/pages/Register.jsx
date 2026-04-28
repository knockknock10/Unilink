import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, User, UserPlus, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
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
        toast.success(`Account created successfully! Please log in. 🎉`);
        navigate('/login');
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-4 py-12">

      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-button blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent blur-[120px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xl z-10"
      >
        <div className="glass-card overflow-hidden backdrop-blur-xl border-white/20">
          <div className="p-8 md:p-12 text-center relative overflow-hidden">

            <motion.div variants={itemVariants} className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-button rounded-3xl rotate-3 mb-6 shadow-xl shadow-button/30">
                <UserPlus size={40} className="text-ink -rotate-3" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight mb-3">
                Create Account
              </h1>
              <p className="text-ink/60 text-lg font-medium max-w-sm mx-auto">
                Join the largest student network and start connecting today.
              </p>
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 md:px-12 pb-10 space-y-6">
            <div className="space-y-5">

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-bold text-ink/80 flex items-center gap-2 ml-1">
                  <User size={16} className="text-accent" />
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="input-field py-4 px-5 text-base hover:border-accent/50 focus:border-accent transition-all duration-300"
                    required
                  />
                </div>
              </motion.div>


              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-bold text-ink/80 flex items-center gap-2 ml-1">
                  <Mail size={16} className="text-accent" />
                  University Email
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="input-field py-4 px-5 text-base hover:border-accent/50 focus:border-accent transition-all duration-300"
                    required
                  />
                </div>
              </motion.div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-bold text-ink/80 flex items-center gap-2 ml-1">
                    <Lock size={16} className="text-accent" />
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-field py-4 px-5 pr-12 text-base hover:border-accent/50 focus:border-accent transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-accent transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-bold text-ink/80 flex items-center gap-2 ml-1">
                    <ShieldCheck size={16} className="text-accent" />
                    Confirm
                  </label>
                  <div className="relative group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-field py-4 px-5 pr-12 text-base hover:border-accent/50 focus:border-accent transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-accent transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>


            <motion.div variants={itemVariants} className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 shadow-2xl shadow-button/40 hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-70 group"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <>
                    <span>Start Your Journey</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>


            <motion.p variants={itemVariants} className="text-center text-ink/60 font-medium pt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-ink font-extrabold hover:text-accent transition-colors underline underline-offset-4 decoration-accent/30 decoration-2">
                Log In
              </Link>
            </motion.p>
          </form>
        </div>


        <motion.div 
          variants={itemVariants}
          className="text-center mt-12 text-primary font-medium tracking-wide opacity-80"
        >
          Built by students, for students.
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
