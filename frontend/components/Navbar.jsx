import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, PlusCircle, LogOut, Menu, LogIn, UserPlus, MessageSquare } from 'lucide-react';
import SearchBar from './SearchBar';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Feed', path: '/', icon: LayoutDashboard },
    { label: 'Create', path: '/create', icon: PlusCircle },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-primary/10 z-[100] transition-all duration-500">
      <div className="w-full px-6 md:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-4 min-w-[200px]">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
                  <span className="text-white text-2xl font-black italic">U</span>
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tighter hidden sm:block">
                UniLink
              </h1>
            </Link>
          </div>

          {/* Centered Search Bar */}
          <div className="flex-1 flex justify-center w-full max-w-2xl px-4 md:px-8 mx-auto">
            <div className="w-full max-w-xl">
                <SearchBar />
            </div>
          </div>

          {/* Profile/Auth Section */}
          <div className="flex items-center justify-end gap-6 min-w-[200px]">
            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                 {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                      🛡️ Admin Panel
                    </Link>
                 )}
                 <Link to="/profile" className="flex items-center gap-3 group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-primary leading-tight">{user?.name}</p>
                        <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">View Profile</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-all p-0.5 bg-background">
                        <img 
                            src={user?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
                            className="w-full h-full object-cover rounded-[14px]" 
                            alt="Profile"
                        />
                    </div>
                 </Link>
              </div>
            ) : (
                <div className="flex items-center gap-4">
                    <Link 
                        to="/login"
                        className="text-sm font-black text-primary/80 hover:text-primary px-4 py-2"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-8 py-3 rounded-2xl bg-primary text-white hover:brightness-110 shadow-xl shadow-primary/20 transition-all font-black text-xs uppercase tracking-widest"
                    >
                        Join Now
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
