import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Users, Plus, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '' });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const { data } = await api.get('/groups');
            setGroups(data);
        } catch (error) {
            toast.error('Failed to load groups');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await api.post('/groups', newGroup);
            toast.success('Group created successfully! 🎉');
            setIsCreateModalOpen(false);
            setNewGroup({ name: '', description: '' });
            fetchGroups();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create group');
        } finally {
            setCreating(false);
        }
    };

    const filteredGroups = groups.filter(g => 
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader fullPage />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-ink tracking-tight mb-2">Campus Communities</h1>
                    <p className="text-ink/60 font-medium">Join groups, share interests, and grow together.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-primary flex items-center gap-2 px-6 py-3 shadow-lg shadow-button/20"
                >
                    <Plus size={20} />
                    Create New Group
                </button>
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={20} />
                <input
                    type="text"
                    placeholder="Search for groups by name or topic..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface border border-accent/20 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-button/20 outline-none transition-all shadow-sm font-medium"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                        <motion.div
                            key={group._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            className="glass-card overflow-hidden group border border-accent/10 hover:border-button/30 transition-all duration-300"
                        >
                            <div className="h-24 bg-gradient-to-r from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500" />
                            <div className="p-6 -mt-12">
                                <div className="w-16 h-16 rounded-2xl bg-button shadow-xl flex items-center justify-center text-ink mb-4 border-4 border-surface">
                                    <Users size={30} />
                                </div>
                                <h3 className="text-xl font-black text-ink mb-2 group-hover:text-primary transition-colors">{group.name}</h3>
                                <p className="text-ink/60 text-sm line-clamp-2 mb-4 h-10">
                                    {group.description}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-ink/40 uppercase tracking-widest">
                                        <Users size={14} />
                                        {group.members?.length || 0} Members
                                    </div>
                                    <Link 
                                        to={`/groups/${group._id}`}
                                        className="flex items-center gap-1 text-sm font-black text-primary hover:text-primary-hover transition-colors"
                                    >
                                        View Group
                                        <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center glass-card">
                        <Users size={60} className="mx-auto mb-4 text-ink/20" />
                        <h3 className="text-2xl font-bold text-ink/40">No groups found</h3>
                        <p className="text-ink/30 mt-2">Try a different search term or create a new group!</p>
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-surface rounded-[2rem] overflow-hidden shadow-2xl border border-accent/20"
                        >
                            <form onSubmit={handleCreateGroup} className="p-8">
                                <h2 className="text-2xl font-black text-ink mb-6">Create Community</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black text-ink/60 uppercase tracking-widest mb-2 px-1">Group Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={newGroup.name}
                                            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                            placeholder="e.g. Competitive Coding, Music Society"
                                            className="input-field h-14 px-6 font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-ink/60 uppercase tracking-widest mb-2 px-1">Description</label>
                                        <textarea
                                            required
                                            rows="4"
                                            value={newGroup.description}
                                            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                                            placeholder="What is this group about?"
                                            className="input-field px-6 py-4 font-semibold resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 px-6 py-4 rounded-2xl font-bold text-ink/60 hover:bg-accent/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="flex-[2] btn-primary py-4 font-black uppercase tracking-widest shadow-xl shadow-button/20 disabled:opacity-50"
                                    >
                                        {creating ? 'Creating...' : 'Create Group'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Groups;
