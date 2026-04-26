import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search
  const searchUsers = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get(`/users/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setResults(data);
      if (data.length > 0) {
        setIsOpen(true);
        // Dispatch event to close other menus (like PostCard menus)
        window.dispatchEvent(new CustomEvent("closeOtherMenus", { detail: "search-bar" }));
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      searchUsers(value);
    }, 300);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleSelect = (userId) => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    navigate(`/profile/${userId}`);
  };

  // Close dropdown on outside click or other menu events
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setFocused(false);
      }
    };

    const handleCloseOtherMenus = (event) => {
      if (event.detail !== "search-bar") {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener("closeOtherMenus", handleCloseOtherMenus);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener("closeOtherMenus", handleCloseOtherMenus);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative" id="search-bar-wrapper">
      {/* Search Input */}
      <motion.div
        animate={{ 
            backgroundColor: focused ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.6)'
        }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-300 ${
          focused ? 'border-primary/30 shadow-xl shadow-primary/5' : 'border-primary/15 backdrop-blur-md'
        }`}
      >
        <Search
          size={18}
          className={`shrink-0 transition-colors duration-300 ${
            focused ? 'text-primary' : 'text-muted'
          }`}
        />
        <input
          ref={inputRef}
          id="user-search-input"
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            setFocused(true);
            if (query.trim().length > 0 && results.length > 0) {
                setIsOpen(true);
                window.dispatchEvent(new CustomEvent("closeOtherMenus", { detail: "search-bar" }));
            }
          }}
          placeholder="Search for peers..."
          autoComplete="off"
          className="flex-1 bg-transparent outline-none text-sm font-bold text-ink placeholder:text-muted min-w-0"
        />
        {loading && (
          <Loader2 size={18} className="shrink-0 text-primary animate-spin" />
        )}
        {query && !loading && (
          <button
            onClick={handleClear}
            className="shrink-0 p-1 rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition-all"
          >
            <X size={16} />
          </button>
        )}
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute top-full left-0 right-0 mt-3 bg-surface rounded-[24px] border border-primary/10 shadow-2xl z-50 overflow-hidden"
            style={{ minWidth: '280px' }}
          >
            {results.length > 0 ? (
              <ul className="py-2 max-h-80 overflow-y-auto scrollbar-hide" id="search-results-list">
                {results.map((user, idx) => (
                  <motion.li 
                    key={user._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <button
                      onClick={() => handleSelect(user._id)}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-primary/5 transition-all duration-200 group text-left"
                    >
                      <div className="w-12 h-12 rounded-[16px] overflow-hidden border border-primary/10 group-hover:border-primary/30 transition-colors shrink-0 shadow-sm bg-background">
                        <img
                          src={
                            user.profilePic ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'User'}`
                          }
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-black text-ink truncate group-hover:text-primary transition-colors">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-muted font-bold uppercase tracking-widest truncate mt-0.5">
                            {user.department || 'Student'} {user.year ? `· ${user.year}` : ''}
                        </p>
                      </div>
                      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Search size={16} className="text-primary" />
                      </div>
                    </button>
                    {idx < results.length - 1 && (
                      <div className="mx-4 border-b border-primary/5" />
                    )}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-primary/40" />
                </div>
                <p className="text-sm text-ink font-black uppercase tracking-widest">No users found</p>
                <p className="text-xs text-muted mt-2 font-medium">Check the spelling or try another name</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
