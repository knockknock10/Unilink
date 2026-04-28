import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import Loader from '../components/Loader';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, RefreshCw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
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
  const [trending, setTrending] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tag = searchParams.get('tag') || '';
  const MotionDiv = motion.div;

  useEffect(() => {
    fetchPosts();
    const fetchPeers = async () => {
      try {
        const { data } = await api.get('/users');
        if (Array.isArray(data)) {
          setPeers(data.filter(u => u._id !== user?._id).slice(0, 4));
        } else {
          setPeers([]);
        }
      } catch (error) {
        console.error('Failed to fetch peers', error);
      } finally {
        setLoadingPeers(false);
      }
    };
    const fetchTrending = async () => {
      try {
        const { data } = await api.get('/posts/trending');
        setTrending((data || []).slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch trending', error);
      }
    };
    const fetchGroups = async () => {
      try {
        const { data } = await api.get('/groups');
        setGroups((data || []).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch groups', error);
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchPeers();
    fetchTrending();
    fetchGroups();
  }, [user]);

  useEffect(() => {
    fetchPosts(1, tag);
  }, [fetchPosts, tag]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPosts(1, tag);
    setIsRefreshing(false);
  };

  if (loading && posts.length === 0) return <Loader fullPage />;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">


        <div className="flex-1 min-w-0 max-w-[850px] mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl font-black text-primary flex items-center gap-3 tracking-tight">
                <Sparkles className="text-primary fill-primary/10" size={32} />
                {tag ? `#${tag}` : 'Campus Feed'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-primary/60 font-bold text-xs uppercase tracking-widest px-1">
                  {tag ? `Showing posts tagged with #${tag}` : 'Stay updated with your campus network'}
                </p>
                {tag && (
                  <Link to="/feed" className="text-[10px] bg-red-500/10 text-red-500 px-2 py-1 rounded-lg font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Clear Filter
                  </Link>
                )}
              </div>
            </MotionDiv>

            <button
              onClick={handleRefresh}
              className={`p-3 rounded-2xl bg-white border border-primary/10 shadow-sm text-primary hover:text-white hover:bg-primary transition-all active:scale-95 ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {Array.isArray(posts) && posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </AnimatePresence>

            {(!posts || posts.length === 0) && !loading && (
              <MotionDiv
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-20 text-center rounded-[32px] border border-primary/10"
              >
                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
                  <Users size={40} />
                </div>
                <h3 className="text-2xl font-black text-primary mb-2">No posts yet!</h3>
                <p className="text-primary/60 font-medium max-w-sm mx-auto">Be the first one to share something with your fellow students. Start the conversation!</p>
              </MotionDiv>
            )}
          </div>
        </div>


        <div className="hidden lg:block w-[340px] xl:w-[380px] shrink-0 sticky top-28 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pb-4 pr-1">


          <div className="glass-card p-6 xl:p-8 rounded-[32px] shadow-xl border border-primary/5 bg-white/50 backdrop-blur-sm">
            <h3 className="font-black text-primary flex items-center gap-2 mb-5 text-sm tracking-tight">
              <TrendingUp size={18} />
              Trending Now
            </h3>
            <div className="space-y-3">
              {trending.map(item => (
                <Link to={`/feed?tag=${item.tag.replace('#', '')}`} key={item.tag} className="group cursor-pointer flex justify-between items-center">
                  <span className="text-primary/80 group-hover:text-primary font-bold transition-colors text-sm">{item.tag}</span>
                  <span className="text-[10px] bg-primary/5 border border-primary/10 text-primary px-2 py-1 rounded-lg font-black">{item.count}</span>
                </Link>
              ))}
              {trending.length === 0 && (
                <p className="text-primary/30 text-xs italic">No trending tags yet</p>
              )}
            </div>
          </div>


          <div className="glass-card p-6 xl:p-8 rounded-[32px] shadow-xl border border-primary/5 bg-white/50 backdrop-blur-sm">
            <h3 className="font-black text-primary flex items-center gap-2 mb-5 text-sm tracking-tight">
              <Users size={18} />
              Discover Peers
            </h3>
            <div className="space-y-4">
              {loadingPeers ? (
                <p className="text-primary/40 text-xs italic">Finding peers...</p>
              ) : peers.map(peer => {
                const isFollowing = (user?.following || []).some(id => {
                  const followId = id?._id ? String(id._id) : String(id);
                  return followId === String(peer._id);
                });
                return (
                  <div key={peer._id} className="flex items-center gap-3">
                    <Link to={`/profile/${peer._id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
                      <img
                        src={peer.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${peer.name}`}
                        alt={peer.name}
                        className="w-10 h-10 rounded-xl object-cover bg-surface border border-primary/10 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-primary truncate group-hover:text-primary transition-colors">{peer.name}</p>
                        <p className="text-[10px] text-primary/40 font-black uppercase tracking-tighter truncate">{peer.bio?.substring(0, 25) || 'UniLink Student'}</p>
                      </div>
                    </Link>
                    {isAuthenticated && (
                      <button
                        onClick={() => toggleFollow(peer._id)}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${isFollowing
                          ? 'bg-primary/5 text-primary/60 border border-primary/10'
                          : 'bg-primary text-white shadow-lg shadow-primary/10'
                          }`}
                      >
                        {isFollowing ? 'Linked' : 'Link'}
                      </button>
                    )}
                  </div>
                )
              })}
              {!loadingPeers && peers.length === 0 && (
                <p className="text-primary/30 text-xs italic">No peers to discover yet</p>
              )}
            </div>
          </div>


          <div className="glass-card p-6 xl:p-8 rounded-[32px] shadow-xl border border-primary/5 bg-white/50 backdrop-blur-sm">
            <h3 className="font-black text-primary flex items-center gap-2 mb-5 text-sm tracking-tight">
              🏘️ Communities
            </h3>
            
            <div className="space-y-4">
              {loadingGroups ? (
                <p className="text-primary/40 text-xs text-center py-4 italic">Finding groups...</p>
              ) : groups.length > 0 ? (
                groups.map(group => (
                  <Link 
                    to={`/groups/${group._id}`} 
                    key={group._id} 
                    className="flex items-center gap-3 group hover:bg-primary/5 p-2 rounded-2xl transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                      {group.image ? (
                        <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary truncate group-hover:text-primary transition-colors">{group.name}</p>
                      <p className="text-[10px] text-primary/40 font-black uppercase tracking-widest">{group.members?.length || 0} Members</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-primary/40 text-xs text-center py-4">No groups found</p>
              )}
            </div>

            <Link 
              to="/groups" 
              className="block w-full mt-6 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all text-center"
            >
              Discover More
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
