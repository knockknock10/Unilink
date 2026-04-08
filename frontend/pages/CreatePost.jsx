import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Film, FileText, Sparkles, X, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { usePosts } from '../context/PostContext';

const CreatePost = () => {
    const { fetchPosts } = usePosts();
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [docFile, setDocFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFileClear = (type) => {
        if (type === 'image') { setImageFile(null); setImagePreview(null); }
        if (type === 'video') setVideoFile(null);
        if (type === 'doc') setDocFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !imageFile && !videoFile && !docFile) {
            toast.warn('Post cannot be empty');
            return;
        }

        const formData = new FormData();
        formData.append('text', content);
        if (imageFile) formData.append('image', imageFile);
        if (videoFile) formData.append('video', videoFile);
        if (docFile) formData.append('document', docFile);

        setIsSubmitting(true);
        try {
            await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Post shared successfully! ✨');
            await fetchPosts();
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to share post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary rounded-[40px] shadow-2xl shadow-accent/5 p-8 sm:p-12 border border-zinc-100 relative overflow-hidden"
            >
                {/* Decorative Background Element */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

                <div className="mb-12 text-center md:text-left relative z-10">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-accent/20">
                            <Plus size={24} strokeWidth={3} />
                        </div>
                        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Create Post</h1>
                    </div>
                    <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs px-1">Share knowledge, moments, or resources with UniLink community</p>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                    <div className="relative group">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's happening on campus?..."
                            className="w-full p-8 bg-secondary/40 border border-white/5 focus:border-accent/50 focus:bg-secondary/60 rounded-[32px] outline-none transition-all text-xl font-medium placeholder:text-zinc-500 resize-none min-h-[220px] shadow-inner text-primary"
                        />
                        
                        {/* Word count or something similar could go here */}
                        <div className="absolute bottom-6 right-8 text-primary/40 font-black text-xs uppercase tracking-widest">
                            {content.length} characters
                        </div>
                    </div>

                    <AnimatePresence>
                        {(imagePreview || videoFile || docFile) && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4"
                            >
                                {imagePreview && (
                                    <div className="relative group/preview rounded-[24px] overflow-hidden border-2 border-zinc-100 shadow-lg aspect-video max-h-64 mx-auto">
                                        <img src={imagePreview} className="w-full h-full object-cover transition-transform group-hover/preview:scale-105 duration-700" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                type="button"
                                                onClick={() => handleFileClear('image')} 
                                                className="p-4 bg-secondary text-red-500 rounded-full shadow-2xl hover:bg-red-500 hover:text-primary transition-all transform hover:scale-110 active:scale-95"
                                            >
                                                <X size={24} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3">
                                    {videoFile && (
                                        <div className="flex items-center gap-3 bg-zinc-900 text-primary px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl">
                                            <Film size={18} className="text-accent" />
                                            <span className="truncate max-w-[150px]">{videoFile.name}</span>
                                            <button type="button" onClick={() => handleFileClear('video')} className="hover:text-red-400 p-1">
                                                <X size={16} strokeWidth={3} />
                                            </button>
                                        </div>
                                    )}
                                    {docFile && (
                                        <div className="flex items-center gap-3 bg-secondary/80 border border-white/5 px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg text-primary/80">
                                            <FileText size={18} className="text-accent" />
                                            <span className="truncate max-w-[150px]">{docFile.name}</span>
                                            <button type="button" onClick={() => handleFileClear('doc')} className="hover:text-red-500 p-1">
                                                <X size={16} strokeWidth={3} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-white/5">
                        <div className="flex items-center gap-3 bg-secondary/80 p-2 rounded-3xl border border-white/5">
                            {[
                                { icon: ImageIcon, type: 'image', accept: 'image/*', color: 'text-blue-500 bg-blue-500/10' },
                                { icon: Film, type: 'video', accept: 'video/*', color: 'text-purple-500 bg-purple-500/10' },
                                { icon: FileText, type: 'doc', accept: '.pdf,.doc,.docx', color: 'text-green-500 bg-green-500/10' }
                            ].map((btn) => (
                                <label key={btn.type} className={`cursor-pointer p-4 rounded-2xl ${btn.color} hover:scale-110 active:scale-95 transition-all shadow-sm border border-white`}>
                                    <btn.icon size={24} strokeWidth={2.5} />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept={btn.accept} 
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (btn.type === 'image') handleImageChange(e);
                                            else if (btn.type === 'video') setVideoFile(file);
                                            else setDocFile(file);
                                        }} 
                                    />
                                </label>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || (!content.trim() && !imageFile && !videoFile && !docFile)}
                            className="w-full sm:w-auto min-w-[240px] h-16 bg-accent text-primary px-10 rounded-2xl font-black uppercase tracking-[0.1em] shadow-2xl shadow-accent/20 hover:bg-accent/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center gap-4"
                        >
                            {isSubmitting ? (
                                <RefreshCw size={22} className="animate-spin" />
                            ) : (
                                <>
                                    <Send size={22} strokeWidth={2.5} />
                                    Post to Feed
                                </>
                            )}
                        </button>
                    </div>

                    {/* Pro Tips / Info */}
                    <div className="flex items-center gap-3 text-primary/60 bg-secondary/30 p-4 rounded-2xl border border-dashed border-white/10">
                        <AlertCircle size={18} />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Only academic or helpful campus content is encouraged.</p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreatePost;
