import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchPosts = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/posts?pageNumber=${pageNumber}`);
            setPosts(data.posts);
            setPages(data.pages);
            setPage(data.page);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    }, []);

    const createPost = async (text) => {
        setLoading(true);
        try {
            const { data } = await api.post('/posts', { text });
            setPosts([data, ...posts]);
            toast.success('Post created successfully!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create post');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const likePost = async (postId) => {
        try {
            const { data } = await api.put(`/posts/${postId}/like`);
            setPosts(posts.map(p => p._id === postId ? { ...p, likes: data.likes, likedBy: data.likedBy } : p));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to like post');
        }
    };

    const addComment = async (postId, text) => {
        try {
            const { data } = await api.post(`/posts/${postId}/comment`, { text });
            setPosts(posts.map(p => p._id === postId ? data : p));
            toast.success('Comment added');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add comment');
        }
    };

    const deletePost = async (postId) => {
        try {
            await api.delete(`/posts/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
            toast.success('Post deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete post');
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
            deletePost
        }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePosts = () => useContext(PostContext);
