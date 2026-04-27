import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchPosts = useCallback(async (pageNumber = 1, tag = '') => {
        setLoading(true);
        try {
            const url = tag ? `/posts?pageNumber=${pageNumber}&tag=${encodeURIComponent(tag)}` : `/posts?pageNumber=${pageNumber}`;
            const { data } = await api.get(url);
            setPosts(data.posts);
            setPages(data.pages);
            setPage(data.page);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    }, []);

    const createPost = async (formData) => {
        setLoading(true);
        try {
            const { data } = await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setPosts(prev => [data, ...prev]);
            toast.success('Post shared successfully! ✨');
            return { success: true, post: data };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create post';
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const likePost = async (postId, currentUserId) => {
        if (!currentUserId) return;

        // Optimistic update
        let originalPost = null;
        setPosts(prev => prev.map(p => {
            if (p._id === postId) {
                originalPost = { ...p };
                const isLiked = p.likedBy?.some(id => (id._id || id) === currentUserId);
                const newLikedBy = isLiked 
                    ? p.likedBy.filter(id => (id._id || id) !== currentUserId)
                    : [...(p.likedBy || []), currentUserId];
                return { 
                    ...p, 
                    likes: isLiked ? Math.max(0, p.likes - 1) : (p.likes || 0) + 1,
                    likedBy: newLikedBy 
                };
            }
            return p;
        }));

        try {
            const { data } = await api.put(`/posts/${postId}/like`);
            // Sync with server response
            setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: data.likes, likedBy: data.likedBy } : p));
        } catch (error) {
            // Rollback on error
            if (originalPost) {
                setPosts(prev => prev.map(p => p._id === postId ? originalPost : p));
            }
            toast.error(error.response?.data?.message || 'Failed to like post');
        }
    };

    const addComment = async (postId, text, currentUser) => {
        if (!text.trim() || !currentUser) return;

        // Optimistic update
        let originalPost = null;
        const tempComment = {
            _id: Date.now().toString(),
            text,
            user: {
                _id: currentUser._id,
                name: currentUser.name,
                profilePic: currentUser.profilePic
            },
            createdAt: new Date().toISOString()
        };

        setPosts(prev => prev.map(p => {
            if (p._id === postId) {
                originalPost = { ...p };
                return {
                    ...p,
                    comments: [...(p.comments || []), tempComment]
                };
            }
            return p;
        }));

        try {
            const { data } = await api.post(`/posts/${postId}/comment`, { text });
            // Replace optimistic comment with real one from server
            setPosts(prev => prev.map(p => p._id === postId ? data : p));
            toast.success('Comment added');
        } catch (error) {
            // Rollback on error
            if (originalPost) {
                setPosts(prev => prev.map(p => p._id === postId ? originalPost : p));
            }
            toast.error(error.response?.data?.message || 'Failed to add comment');
        }
    };

    const deletePost = async (postId) => {
        try {
            await api.delete(`/posts/${postId}`);
            setPosts(prev => prev.filter(p => p._id !== postId));
            toast.success('Post deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete post');
        }
    };

    const editPost = async (postId, text) => {
        try {
            const { data } = await api.put(`/posts/${postId}`, { text });
            setPosts(prev => prev.map(p => p._id === postId ? { ...p, text: data.text } : p));
            toast.success('Post updated');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update post');
        }
    };

    return (
        <PostContext.Provider value={{ 
            posts, 
            loading, 
            page, 
            pages, 
            fetchPosts, 
            createPost, 
            likePost, 
            addComment,
            deletePost,
            editPost
        }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePosts = () => useContext(PostContext);
