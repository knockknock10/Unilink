import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { PostProvider } from './context/PostContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Navigation from './components/Navigation';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import PostDetail from './pages/PostDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminRoute from './components/AdminRoute';

const MainLayout = ({ children }) => (
    <div className="min-h-screen flex flex-col bg-background relative">
        <Navbar />
        <div className="flex-1 w-full max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-20 pt-28 pb-20 flex gap-10 lg:gap-16 xl:gap-24">
            {/* Left Navigation */}
            <div className="hidden sm:block w-[72px] lg:w-[240px] shrink-0">
                <div className="sticky top-28">
                    <Navigation />
                </div>
            </div>
            
            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    </div>
);

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <ChatProvider>
                    <PostProvider>
                        <div className="min-h-screen bg-background transition-colors duration-500">
                            <Routes>
                                {/* Protected Routes */}
                                <Route path="/" element={
                                    <ProtectedRoute>
                                        <MainLayout><Dashboard /></MainLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/feed" element={
                                    <ProtectedRoute>
                                        <MainLayout><Dashboard /></MainLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                {/* Protected Routes */}
                                <Route path="/create" element={
                                    <ProtectedRoute>
                                        <MainLayout><CreatePost /></MainLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <MainLayout><Profile /></MainLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/profile/:id" element={
                                    <ProtectedRoute>
                                        <MainLayout><Profile /></MainLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/post/:id" element={
                                    <ProtectedRoute>
                                        <MainLayout><PostDetail /></MainLayout>
                                    </ProtectedRoute>
                                } />

                                {/* Groups Routes */}
                                <Route path="/groups" element={
                                    <ProtectedRoute>
                                        <MainLayout><Groups /></MainLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/groups/:id" element={
                                    <ProtectedRoute>
                                        <MainLayout><GroupDetail /></MainLayout>
                                    </ProtectedRoute>
                                } />

                                {/* Chat Route */}
                                <Route path="/messages" element={
                                    <ProtectedRoute>
                                        <MainLayout><Chat /></MainLayout>
                                    </ProtectedRoute>
                                } />

                                {/* Admin Routes */}
                                <Route path="/admin/login" element={<AdminLogin />} />
                                <Route path="/admin" element={
                                    <AdminRoute>
                                        <MainLayout><AdminDashboard /></MainLayout>
                                    </AdminRoute>
                                } />
                                <Route path="/admin/dashboard" element={
                                    <AdminRoute>
                                        <MainLayout><AdminDashboard /></MainLayout>
                                    </AdminRoute>
                                } />

                                {/* Fallback */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>

                            <ToastContainer
                                position="bottom-right"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="light"
                                toastClassName={() =>
                                    "relative flex p-4 min-h-16 rounded-2xl justify-between overflow-hidden cursor-pointer glass-card !border-accent/20 mb-4 shadow-xl"
                                }
                            />
                        </div>
                    </PostProvider>
                </ChatProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
