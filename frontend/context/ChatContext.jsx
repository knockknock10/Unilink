import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import api from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null); // The user we are chatting with

    useEffect(() => {
        if (user) {
            const newSocket = io(import.meta.env.VITE_API_URL || window.location.origin);
            setSocket(newSocket);

            newSocket.emit('join', user._id);

            newSocket.on('getMessage', (message) => {
                // If the message is from the user we are currently chatting with, add it to the messages
                if (activeChat && (message.sender === activeChat._id || message.receiver === activeChat._id)) {
                    setMessages((prev) => [...prev, message]);
                }
                // Refresh conversations list to show latest message/user
                fetchConversations();
            });

            return () => newSocket.close();
        }
    }, [user, activeChat]);

    const fetchMessages = useCallback(async (userId) => {
        try {
            const { data } = await api.get(`/chat/${userId}`);
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, []);

    const fetchConversations = useCallback(async () => {
        try {
            const { data } = await api.get('/chat/conversations');
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    }, []);

    const sendMessage = (receiverId, text) => {
        if (socket && user) {
            const messageData = {
                senderId: user._id,
                receiverId,
                text,
            };
            socket.emit('sendMessage', messageData);
            
            // Optimistically add to messages
            const optimisticMsg = {
                _id: Date.now().toString(),
                sender: user._id,
                receiver: receiverId,
                text,
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, optimisticMsg]);
            fetchConversations();
        }
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                conversations,
                activeChat,
                setActiveChat,
                fetchMessages,
                fetchConversations,
                sendMessage,
                socket,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
