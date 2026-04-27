import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-primary/10 z-[100] transition-all duration-500">
      <div className="w-full max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Left — Logo */}
          <div className="flex items-center gap-4 min-w-[180px]">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
                <span className="text-white text-2xl font-black italic">U</span>
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tighter hidden sm:block">
                UniLink
              </h1>
            </Link>
          </div>

          {/* Center — Search Bar */}
          <div className="flex-1 flex justify-center px-4 md:px-8 mx-auto max-w-3xl">
            <div className="w-full">
              <SearchBar />
            </div>
          </div>

          {/* Right — Profile + Logout */}
          <div className="flex items-center justify-end gap-4 min-w-[180px]">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                  >
                    🛡️ Admin
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-3 group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-primary leading-tight">{user?.name}</p>
                    <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Profile</p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-all p-0.5 bg-background">
                    <img
                      src={user?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                      className="w-full h-full object-cover rounded-[12px]"
                      alt="Profile"
                    />
                  </div>
                </Link>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-100 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
                >
                  <LogOut size={18} strokeWidth={2.5} />
                </button>
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
