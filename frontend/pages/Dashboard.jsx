import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Users, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import CreatePost from './CreatePost';
import api from '../services/api';
const Dashboard = () => {
  const { posts, loading, fetchPosts } = usePosts();
  const { user, isAuthenticated, toggleFollow } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [peers, setPeers] = useState([]);
  const [loadingPeers, setLoadingPeers] = useState(true);

  useEffect(() => {
    fetchPosts();
    const fetchPeers = async () => {
        try {
            const { data } = await api.get('/users');
            if (Array.isArray(data)) {
                setPeers(data.filter(u => u._id !== user?._id).slice(0, 5));
            } else {
                setPeers([]);
            }
        } catch (error) {
            console.error('Failed to fetch peers', error);
        } finally {
            setLoadingPeers(false);
        }
    };
    fetchPeers();
  }, [fetchPosts, user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPosts();
    setIsRefreshing(false);
  };

  if (loading && posts.length === 0) return <Loader fullPage />;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content */}
        <div className="lg:col-span-8 w-full">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl font-black text-primary flex items-center gap-3 tracking-tight">
                <Sparkles className="text-accent fill-accent/20" size={32} />
                Student Feed
              </h1>
              <p className="text-zinc-400 font-bold mt-1 text-sm uppercase tracking-widest opacity-80 px-1">Stay updated with your campus network</p>
            </motion.div>

            <button 
              onClick={handleRefresh}
              className={`p-3 rounded-2xl bg-secondary border border-zinc-100 shadow-sm text-zinc-400 hover:text-accent hover:border-accent/20 transition-all active:scale-95 ${isRefreshing ? 'animate-spin text-accent' : ''}`}
            >
              <RefreshCw size={20} />
            </button>
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </AnimatePresence>

            {posts.length === 0 && !loading && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-20 text-center bg-secondary/5 border border-zinc-100 rounded-[32px] backdrop-blur-xl"
                >
                    <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-accent mx-auto mb-6">
                        <Users size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-primary mb-2">No posts yet!</h3>
                    <p className="text-zinc-400 font-medium max-w-sm mx-auto">Be the first one to share something with your fellow students. Start the conversation! ✨</p>
                </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-8">
            <div className="glass-card p-8 bg-secondary/5 border border-white/10 rounded-[32px] backdrop-blur-3xl shadow-xl">
                <div>
                   <h3 className="font-black text-primary flex items-center gap-2 mb-6 uppercase tracking-widest text-sm">
                      <TrendingUp size={18} className="text-accent" />
                      Campus Trending
                   </h3>
                   <div className="space-y-4">
                      {[
                        { tag: '#DBMSNotes', count: '1.2k' },
                        { tag: '#HostelLife', count: '850' },
                        { tag: '#Hackathon2026', count: '720' },
                        { tag: '#Graduation', count: '540' },
                      ].map(item => (
                          <div key={item.tag} className="group cursor-pointer flex justify-between items-center">
                              <span className="text-primary/80 group-hover:text-accent font-bold transition-colors">{item.tag}</span>
                              <span className="text-[10px] bg-secondary border border-white/5 text-primary/40 px-2 py-1 rounded-lg font-black">{item.count}</span>
                          </div>
                      ))}
                   </div>
                </div>

                <div className="pt-8 mt-8 border-t border-zinc-100">
                   <h3 className="font-black text-primary flex items-center gap-2 mb-6 uppercase tracking-widest text-sm">
                      <Users size={18} className="text-accent" />
                      New Peers
                   </h3>
                    <div className="space-y-5">
                       {loadingPeers ? (
                            <p className="text-zinc-400 text-sm">Loading peers...</p>
                       ) : peers.map(peer => {
                           const isFollowing = user?.following?.includes(peer._id);
                           return (
                           <div key={peer._id} className="flex items-center gap-3">
                               <Link to={`/profile/${peer._id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
                                   <img 
                                      src={peer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${peer.name}`} 
                                      alt={peer.name} 
                                      className="w-10 h-10 rounded-xl object-cover bg-zinc-100 border border-zinc-200 group-hover:scale-105 transition-transform"
                                   />
                                   <div className="flex-1 min-w-0">
                                       <p className="text-sm font-bold text-primary truncate group-hover:text-accent transition-colors">{peer.name}</p>
                                       <p className="text-[10px] text-zinc-400 font-black uppercase tracking-tighter truncate">{peer.bio?.substring(0,20) || 'Student'}</p>
                                   </div>
                               </Link>
                               {isAuthenticated && (
                                   <button 
                                      onClick={() => toggleFollow(peer._id)}
                                       className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${
                                          isFollowing 
                                           ? 'bg-secondary/50 text-white/50 hover:bg-red-500/10 hover:text-red-500' 
                                           : 'text-accent hover:bg-accent/10 border border-accent/20'
                                      }`}
                                   >
                                       {isFollowing ? 'Unfollow' : 'Link'}
                                   </button>
                               )}
                           </div>
                       )})}
                    </div>
                </div>
            </div>

            <div className="p-8 bg-accent rounded-[32px] shadow-2xl shadow-accent/20 relative overflow-hidden group">
                <div className="relative z-10">
                    <h3 className="text-primary font-black text-xl mb-2">Join more groups!</h3>
                    <p className="text-primary/80 text-sm font-medium mb-6">Connect with people sharing the same academic interests.</p>
                    <button className="w-full py-4 bg-secondary text-accent rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">
                        Explore Groups
                    </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
