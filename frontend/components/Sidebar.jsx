import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, User, PlusCircle, LogOut, X, LogIn, MessageSquare, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = [
    { label: 'Feed', path: '/', Icon: LayoutDashboard },
    { label: 'Groups', path: '/groups', Icon: Users },
    { label: 'Messages', path: '/messages', Icon: MessageSquare },
    { label: 'Create', path: '/create', Icon: PlusCircle },
    { label: 'Profile', path: '/profile', Icon: User },
  ];

  const sidebarWidth = isCollapsed ? 'w-24' : 'w-72';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
            width: isCollapsed ? 96 : 288
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed top-0 right-0 h-full bg-surface border-l border-primary/10 z-[120] shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar Header with Toggle */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-primary/5 mb-6">
          {!isCollapsed && (
            <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-black text-primary tracking-tighter"
            >
                Navigation
            </motion.span>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="p-2.5 rounded-xl text-primary/60 hover:text-primary hover:bg-primary/5 transition-all ml-auto hidden md:block"
          >
            {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </button>
          <button onClick={onToggle} className="md:hidden p-2 rounded-xl text-primary/60 hover:text-primary hover:bg-primary/5 transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map(({ label, path, Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => onToggle()}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                ${isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                  : 'text-primary/70 hover:bg-primary/5 hover:text-primary'
                }
                ${isCollapsed ? 'justify-center px-0' : ''}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex-shrink-0">
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  {!isCollapsed && (
                    <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-bold text-sm tracking-tight"
                    >
                        {label}
                    </motion.span>
                  )}
                  
                  {/* Tooltip for Collapsed State */}
                  {isCollapsed && (
                    <div className="absolute right-full mr-4 px-3 py-1.5 bg-ink text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                        {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User / Auth Section */}
        <div className="p-4 border-t border-primary/5 bg-background/50">
          {isAuthenticated ? (
            <div className="space-y-2">
              <button
                onClick={() => { logout(); onToggle(); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-primary/60 hover:bg-red-50 hover:text-red-500 transition-all duration-300 font-bold text-sm ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <LogOut size={22} />
                {!isCollapsed && <span>Logout</span>}
              </button>

              {!isCollapsed && user && (
                <div className="mt-4 p-4 rounded-2xl bg-white border border-primary/10 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0 border-2 border-primary/5">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-primary text-xs truncate uppercase tracking-widest">{user.name}</p>
                    <p className="text-[10px] font-bold text-primary/40 truncate italic">{user.role}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              onClick={() => onToggle()}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all duration-300 font-black text-xs uppercase tracking-widest ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <LogIn size={22} />
              {!isCollapsed && <span>Sign In</span>}
            </NavLink>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
