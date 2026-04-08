import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, PlusCircle, LogOut, Menu, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Feed', path: '/', icon: LayoutDashboard },
    { label: 'Create', path: '/create', icon: PlusCircle },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-white/5 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <button
               onClick={onToggleSidebar}
               className="md:hidden p-3 rounded-2xl hover:bg-secondary/20 text-primary transition-all active:scale-95"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:rotate-[10deg] transition-transform duration-500">
                  <span className="text-primary text-2xl font-black italic">U</span>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hidden sm:block">
                UniLink
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-1 bg-secondary/10 p-1.5 rounded-2xl border border-white/5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-500 font-bold text-sm tracking-tight ${
                    location.pathname === link.path 
                      ? 'bg-accent text-primary shadow-lg shadow-accent/20 scale-105' 
                      : 'text-primary/40 hover:text-accent hover:bg-secondary/30'
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                 <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-primary transition-all duration-500 font-bold text-sm"
                 >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                 </button>
                 <Link to="/profile" className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-accent/20 hover:border-accent transition-all p-0.5">
                    <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} className="w-full h-full object-cover rounded-[14px]" />
                 </Link>
              </div>
            ) : (
                <div className="flex items-center gap-2 sm:gap-4">
                    <Link 
                        to="/login"
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl text-primary/60 font-bold hover:text-accent hover:bg-secondary/20 transition-all text-sm"
                    >
                        <LogIn size={18} />
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-accent text-primary hover:bg-accent/90 shadow-xl shadow-accent/20 transition-all font-black text-sm uppercase tracking-widest active:scale-95"
                    >
                        <UserPlus size={18} />
                        Join
                    </Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
