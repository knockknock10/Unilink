import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Send, Search, User as UserIcon, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
    const { 
        messages, 
        conversations, 
        activeChat, 
        setActiveChat, 
        fetchMessages, 
        fetchConversations, 
        sendMessage 
    } = useChat();
    const { user: currentUser } = useAuth();
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat._id);
        }
    }, [activeChat, fetchMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputText.trim() && activeChat) {
            sendMessage(activeChat._id, inputText.trim());
            setInputText('');
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="container mx-auto px-4 h-[calc(100vh-120px)]">
            <div className="glass-card h-full flex overflow-hidden rounded-3xl border border-accent/10">
                
                {/* Conversations Sidebar */}
                <div className="w-full md:w-80 border-r border-accent/10 flex flex-col bg-white/50">
                    <div className="p-4 border-b border-accent/10">
                        <h2 className="text-xl font-bold mb-4 text-button flex items-center gap-2">
                            <MessageSquare size={20} className="text-button" />
                            Messages
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                className="w-full bg-surface border border-accent/20 rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-button/40 outline-none transition-all text-ink placeholder:text-ink/40"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {conversations.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <p className="text-ink/60 text-sm">No conversations yet. Start a chat from someone's profile!</p>
                            </div>
                        ) : (
                            conversations.map((chatUser) => (
                                <button
                                    key={chatUser._id}
                                    onClick={() => setActiveChat(chatUser)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                                        activeChat?._id === chatUser._id
                                            ? 'bg-button text-white shadow-lg shadow-button/20'
                                            : 'hover:bg-accent/10 text-ink'
                                    }`}
                                >
                                    <div className="relative">
                                        {chatUser.profilePic ? (
                                            <img src={chatUser.profilePic} alt={chatUser.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border-2 border-white/20">
                                                <UserIcon size={24} />
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-semibold text-sm text-ink truncate">{chatUser.name}</h3>
                                        <p className={`text-xs truncate ${activeChat?._id === chatUser._id ? 'text-white/80' : 'text-ink/60'}`}>
                                            Click to view message
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Window */}
                <div className="flex-1 flex flex-col bg-background/30 backdrop-blur-sm">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-accent/10 flex items-center gap-3 bg-white/40">
                                {activeChat.profilePic ? (
                                    <img src={activeChat.profilePic} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                                        <UserIcon size={20} />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-ink">{activeChat.name}</h3>
                                    <span className="text-[10px] text-green-500 font-medium">Online</span>
                                </div>
                            </div>

                            {/* Messages area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg._id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
                                                    msg.sender === currentUser._id
                                                        ? 'bg-button text-white rounded-tr-none'
                                                        : 'bg-white text-ink border border-accent/10 rounded-tl-none'
                                                }`}
                                            >
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                                <p className={`text-[10px] mt-1 ${msg.sender === currentUser._id ? 'text-white/70' : 'text-ink/50'}`}>
                                                    {formatTime(msg.createdAt)}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input area */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-accent/10 bg-white/40">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-surface border border-accent/20 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-button/40 outline-none transition-all shadow-inner text-ink placeholder:text-ink/40"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputText.trim()}
                                        className="bg-button hover:bg-button/90 text-white rounded-2xl px-6 py-3 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-button/20"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-center flex-col items-center justify-center opacity-40">
                            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                                <MessageSquare size={40} className="text-button" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-ink">Select a Conversation</h3>
                            <p className="text-sm text-ink/60">Choose a user from the left to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
