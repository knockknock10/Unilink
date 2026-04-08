import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, MapPin, Calendar, Link as LinkIcon, Grid, Bookmark, MessageSquare, X, Save, UserPlus, UserMinus, Users } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateProfile, toggleFollow, isAuthenticated } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const isOwnProfile = !id || (currentUser && id === currentUser._id);
  const user = isOwnProfile ? currentUser : profileUser;
  
  const isFollowing = currentUser?.following?.includes(user?._id);

  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    department: '',
    year: '',
    skills: '',
    interests: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (isOwnProfile && currentUser) {
          const { data } = await api.get('/posts/my/all');
          setPosts(data);
          setFormData({
            name: currentUser.name || '',
            bio: currentUser.bio || '',
            avatar: currentUser.avatar || '',
            department: currentUser.department || '',
            year: currentUser.year || '',
            skills: currentUser.skills ? currentUser.skills.join(', ') : '',
            interests: currentUser.interests ? currentUser.interests.join(', ') : ''
          });
        } else if (id) {
          const [{ data: fetchedUser }, { data: userPosts }] = await Promise.all([
            api.get(`/users/${id}`),
            api.get(`/posts`) // in a real app, there would be a specific endpoint for user posts
          ]);
          setProfileUser(fetchedUser);
          setPosts(userPosts.posts?.filter(p => p.user?._id === id || p.user === id) || []);
        }
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, currentUser, isOwnProfile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      interests: formData.interests ? formData.interests.split(',').map(i => i.trim()) : []
    };
    const result = await updateProfile(updatedData);
    if (result.success) {
      toast.success('Profile updated successfully!');
      setIsEditModalOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
        return toast.info('Please login to follow users');
    }
    const result = await toggleFollow(user._id);
    if (result.success) {
        toast.success(isFollowing ? 'Unfollowed user' : 'Followed user');
        // Update local state for profileUser followers count
        if (profileUser) {
            setProfileUser(prev => ({
                ...prev,
                followers: isFollowing 
                    ? prev.followers.filter(vid => vid !== currentUser._id)
                    : [...(prev.followers || []), currentUser._id]
            }));
        }
    }
  };

  if (loading && !user) return <Loader fullPage />;
  if (!user) return <div className="p-20 text-center"><h2 className="text-2xl font-bold">User Not Found</h2></div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card overflow-hidden shadow-2xl relative mb-10 border border-white/5 bg-secondary/5 backdrop-blur-xl"
      >
        <div className="h-48 bg-gradient-to-r from-accent to-secondary relative overflow-hidden">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-20 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
            />
        </div>

        <div className="px-10 pb-12 relative -mt-16 flex flex-col items-center md:items-start">
          <div className="flex flex-col md:flex-row items-end gap-6 w-full justify-between">
            <div className="relative group">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                alt={user?.name}
                className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500 bg-secondary"
              />
              {isOwnProfile && (
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute -bottom-2 -right-2 p-3 bg-accent text-primary rounded-2xl shadow-lg ring-4 ring-white hover:scale-110 active:scale-95 transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
              )}
            </div>

            <div className="flex gap-4 pb-2">
                {isOwnProfile ? (
                    <button 
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-8 py-3 rounded-2xl bg-accent text-primary font-bold shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all flex items-center gap-2"
                    >
                        <Edit3 size={18} />
                        Edit Profile
                    </button>
                ) : (
                    <button 
                      onClick={handleFollow}
                      className={`px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-opacity-90 transition-all flex items-center gap-2 ${
                        isFollowing ? 'bg-zinc-100 text-primary/80 shadow-none' : 'bg-accent text-primary shadow-accent/20'
                      }`}
                    >
                        {isFollowing ? (
                           <><UserMinus size={18} /> Unfollow</>
                        ) : (
                           <><UserPlus size={18} /> Follow</>
                        )}
                    </button>
                )}
            </div>
          </div>

          <div className="mt-8 text-center md:text-left w-full">
            <h1 className="text-4xl font-black text-primary tracking-tight">{user?.name}</h1>
            <p className="text-primary/70 font-medium mt-1 text-lg">{user?.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 mt-6">
                {[
                    { icon: Users, text: `${user?.followers?.length || 0} Followers` },
                    { icon: MapPin, text: 'Mumbai, India' },
                    { icon: Calendar, text: 'Joined Mar 2026' }
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-zinc-400 font-semibold text-sm">
                        <item.icon size={16} />
                        {item.text}
                    </div>
                ))}
            </div>

            <p className="mt-8 text-primary/80 max-w-2xl leading-relaxed text-lg italic opacity-80">
                {user?.bio || "“Building the future of student networking, one connection at a time. Always open to collaborate on projects! 🚀💻”"}
            </p>
          </div>
        </div>

        <div className="px-10 border-t border-zinc-100 flex justify-center md:justify-start">
            {[
                { id: 'posts', icon: Grid, label: 'Posts' },
                { id: 'bookmark', icon: Bookmark, label: 'Saved' },
                { id: 'replies', icon: MessageSquare, label: 'Replies' }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-8 py-6 font-bold text-sm tracking-widest uppercase transition-all flex items-center gap-2 overflow-hidden
                        ${activeTab === tab.id ? 'text-accent' : 'text-zinc-400 hover:text-accent/60'}
                    `}
                >
                    <tab.icon size={18} className={activeTab === tab.id ? 'animate-bounce' : ''} />
                    {tab.label}
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-1.5 bg-accent rounded-t-full shadow-lg shadow-accent/40"
                        />
                    )}
                </button>
            ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
         <AnimatePresence mode="wait">
             {activeTab === 'posts' ? (
                <motion.div
                    key="posts"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                >
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    ) : (
                        <div className="glass-card p-20 text-center bg-secondary/5 backdrop-blur-xl border border-zinc-100">
                             <p className="text-zinc-400 font-bold text-xl uppercase tracking-widest">No posts yet! ✨</p>
                        </div>
                    )}
                </motion.div>
             ) : (
                <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-20 text-center bg-secondary/5 backdrop-blur-xl border border-zinc-100"
                >
                    <p className="text-zinc-400 font-bold text-xl uppercase tracking-widest">Nothing here yet! ✨</p>
                </motion.div>
             )}
         </AnimatePresence>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-secondary rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-primary">Edit Profile</h2>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-primary/70 uppercase tracking-widest mb-2 px-1">Name</label>
                    <input
                      type="text"
                      className="w-full h-14 bg-secondary/40 border border-white/5 focus:border-accent/50 focus:bg-secondary/60 rounded-2xl px-6 outline-none transition-all font-semibold"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-primary/70 uppercase tracking-widest mb-2 px-1">Department</label>
                      <input
                        type="text"
                        className="w-full h-14 bg-secondary/40 border border-white/5 focus:border-accent/50 focus:bg-secondary/60 rounded-2xl px-6 outline-none transition-all font-semibold"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary/70 uppercase tracking-widest mb-2 px-1">Year</label>
                      <input
                        type="text"
                        className="w-full h-14 bg-secondary/40 border border-white/5 focus:border-accent/50 focus:bg-secondary/60 rounded-2xl px-6 outline-none transition-all font-semibold"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary/70 uppercase tracking-widest mb-2 px-1">Bio</label>
                    <textarea
                      rows="3"
                      className="w-full bg-secondary/40 border border-white/5 focus:border-accent/50 focus:bg-secondary/60 rounded-2xl px-6 py-4 outline-none transition-all font-semibold resize-none"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-primary/70 uppercase tracking-widest mb-2 px-1">Skills (comma-separated)</label>
                    <input
                      type="text"
                      className="w-full h-14 bg-secondary/40 border border-white/5 focus:border-accent/50 focus:bg-secondary/60 rounded-2xl px-6 outline-none transition-all font-semibold"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary/70 uppercase tracking-widest mb-2 px-1">Interests (comma-separated)</label>
                    <input
                      type="text"
                      className="w-full h-14 bg-secondary/40 border border-white/5 focus:border-accent/50 focus:bg-secondary/60 rounded-2xl px-6 outline-none transition-all font-semibold"
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary/70 uppercase tracking-widest mb-2 px-1">Avatar URL</label>
                    <input
                      type="text"
                      className="w-full h-14 bg-secondary/40 border border-white/5 focus:border-accent/50 focus:bg-secondary/60 rounded-2xl px-6 outline-none transition-all font-semibold text-sm"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    />
                    <p className="text-[10px] text-zinc-400 mt-2 px-1">Tip: Use DiceBear or Gravatar URLs for best results.</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-16 bg-accent text-primary rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:bg-accent/90 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Save size={20} />
                    Save Changes
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
