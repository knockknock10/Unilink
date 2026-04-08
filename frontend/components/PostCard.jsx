import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, FileText, Download, Send, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { toast } from 'react-toastify';

const PostCard = ({ post }) => {
  const { isAuthenticated, user: currentUser } = useAuth();
  const { likePost, addComment, deletePost } = usePosts();
  const navigate = useNavigate();
  
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = post.likedBy?.includes(currentUser?._id);
  const FILE_BASE_URL = 'http://localhost:5000';

  const handleLike = async () => {
    if (!isAuthenticated) {
        toast.info('Please login to like posts! ❤️');
        navigate('/login');
        return;
    }
    setIsLiking(true);
    await likePost(post._id);
    setIsLiking(false);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    await addComment(post._id, commentText);
    setCommentText('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6 sm:p-8 mb-8 bg-secondary/5 backdrop-blur-xl border border-white/10 hover:border-accent/20 transition-all duration-500 rounded-[32px] group relative shadow-xl"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <Link to={`/profile/${post.user?._id}`} className="relative group/avatar cursor-pointer">
            <img
                src={post.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.name || 'User'}`}
                alt={post.user?.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-accent/20 bg-secondary p-0.5 object-cover group-hover/avatar:scale-105 transition-transform"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full sm:w-5 sm:h-5" />
          </Link>
          <Link to={`/profile/${post.user?._id}`} className="cursor-pointer group/name">
            <h4 className="font-black text-primary text-lg sm:text-xl group-hover/name:text-accent transition-colors">{post.user?.name}</h4>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{formatDate(post.createdAt)}</p>
          </Link>
        </div>
        <div className="flex gap-2">
            {currentUser?._id === post.user?._id && (
                <button 
                  onClick={() => deletePost(post._id)}
                  className="text-zinc-300 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-500/5"
                >
                  <MoreHorizontal size={20} />
                </button>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 mb-8">
        {post.text && (
            <p className="text-primary leading-relaxed text-lg font-medium tracking-tight">
              {post.text}
            </p>
        )}

        {post.image && (
            <div className="rounded-[24px] overflow-hidden border border-white/5 bg-secondary/20 mt-4 max-h-[500px] shadow-lg">
                <img 
                    src={post.image.startsWith('http') ? post.image : `${FILE_BASE_URL}${post.image}`} 
                    alt="Post content" 
                    className="w-full h-full object-cover"
                />
            </div>
        )}

        {post.document && (
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-white/5 mt-4 hover:border-accent/30 transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent/10 rounded-xl text-accent">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-primary truncate max-w-[150px] sm:max-w-[300px]">
                            {post.document.split('/').pop()}
                        </p>
                        <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Shared Document</p>
                    </div>
                </div>
                <a 
                    href={`${FILE_BASE_URL}${post.document}`} 
                    download 
                    className="p-3 bg-accent text-primary rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
                >
                    <Download size={18} />
                </a>
            </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
        <div className="flex items-center gap-6 sm:gap-8">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-2.5 transition-all py-2 px-3 rounded-xl
              ${isLiked ? 'text-accent bg-accent/5' : 'text-zinc-400 hover:text-accent hover:bg-accent/5'}
            `}
          >
            <Heart size={22} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} className={isLiking ? 'animate-ping' : ''}/>
            <span className="font-bold text-sm">{post.likes || 0}</span>
          </button>

          <button 
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center gap-2.5 transition-all py-2 px-3 rounded-xl
                    ${showComments ? 'text-accent bg-accent/5' : 'text-zinc-400 hover:text-accent hover:bg-accent/5'}
                `}
          >
            <MessageCircle size={22} />
            <span className="font-bold text-sm">{post.comments?.length || 0}</span>
          </button>
        </div>

        <button className="text-zinc-300 hover:text-accent p-2 rounded-xl transition-all">
          <Share2 size={22} />
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
            >
                <div className="pt-8 mt-6 border-t border-white/5">
                    <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                        {post.comments?.map((comment, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-lg bg-secondary border border-white/5 flex items-center justify-center text-primary/40 flex-shrink-0 overflow-hidden">
                                    {comment.user?.avatar ? (
                                        <img src={comment.user.avatar} className="w-full h-full object-cover" alt={comment.user.name} />
                                    ) : (
                                        <User size={16} />
                                    )}
                                </div>
                                <div className="flex-1 bg-secondary/40 rounded-2xl rounded-tl-none p-3 border border-white/5">
                                    <p className="text-[11px] font-black text-accent uppercase tracking-tighter mb-1">
                                        {comment.user?.name || 'User'}
                                    </p>
                                    <p className="text-sm text-primary/80 font-medium">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                        {(!post.comments || post.comments.length === 0) && (
                            <p className="text-center text-zinc-400 text-sm font-medium py-4">No comments yet. Be the first! 💬</p>
                        )}
                    </div>

                    {isAuthenticated && (
                        <form onSubmit={handleCommentSubmit} className="relative flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="w-full h-12 bg-secondary/40 border border-white/5 focus:border-accent/50 focus:bg-secondary/60 rounded-2xl px-5 pr-14 outline-none transition-all text-sm font-semibold"
                            />
                            <button 
                                type="submit"
                                className="absolute right-2 p-2 text-accent hover:bg-accent/10 rounded-xl transition-all"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
