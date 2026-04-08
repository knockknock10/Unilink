import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, User, PlusCircle, LogOut, X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, logout, isAuthenticated } = useAuth();

  const menuItems = [
    { label: 'Feed', path: '/', icon: LayoutDashboard },
    { label: 'Create Post', path: '/create', icon: PlusCircle },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed top-0 left-0 h-full w-64 bg-background border-r border-white/5 z-50 p-6 shadow-2xl md:translate-x-0"
      >
        <div className="flex justify-between items-center mb-10 md:mb-12">
          <span className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            UniLink
          </span>
          <button onClick={onToggle} className="md:hidden p-1 text-zinc-400 hover:text-accent transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col h-[calc(100%-80px)]">
          <div className="space-y-2 mb-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onToggle()}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium
                  ${isActive 
                    ? 'bg-accent text-primary shadow-lg shadow-accent/20 scale-105' 
                    : 'text-primary/70 hover:bg-secondary/30 hover:text-accent'
                  }
                `}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-auto space-y-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { logout(); onToggle(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50/10 transition-all duration-300 font-medium"
                >
                  <LogOut size={20} />
                  Logout
                </button>

                {user && (
                  <div className="p-4 rounded-2xl bg-secondary/20 flex items-center gap-3 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-primary text-sm truncate">{user.name}</p>
                      <p className="text-xs text-primary/60 truncate">{user.email}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={() => onToggle()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-accent text-primary shadow-lg shadow-accent/20 hover:scale-[1.02] transition-all duration-300 font-bold"
              >
                <LogIn size={20} />
                Sign In
              </NavLink>
            )}
          </div>
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;
