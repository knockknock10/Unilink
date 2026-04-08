import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const MainLayout = ({ children }) => (
        <div className="flex">
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex-1 min-h-screen md:pl-64 transition-all duration-300">
                <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="pt-20 pb-10">
                    {children}
                </main>
            </div>
        </div>
    );

    return (
        <Router>
            <AuthProvider>
                <PostProvider>
                    <div className="min-h-screen bg-background transition-colors duration-500">
                        <Routes>
                            {/* Public Routes with Feed */}
                            <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
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
                                <MainLayout><Profile /></MainLayout>
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
            </AuthProvider>
        </Router>
    );
};

export default App;
