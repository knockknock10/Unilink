import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPost = useCallback(async () => {
        try {
            const { data } = await api.get(`/posts/${id}`);
            setPost(data);
        } catch (error) {
            toast.error('Post not found or deleted');
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    if (loading) return <Loader fullPage />;
    if (!post) return null;

    return (
        <div className="container mx-auto px-4 max-w-3xl py-8">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-ink/60 hover:text-primary transition-colors font-bold mb-8 group"
            >
                <div className="p-2 bg-surface rounded-xl group-hover:bg-primary/10 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                Back to Feed
            </button>
            
            <PostCard post={post} />
        </div>
    );
};

export default PostDetail;
