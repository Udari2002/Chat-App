import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../lib/api';
import assets from '../assets/assets';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submittingRef = useRef(false);
  const navigate = useNavigate();

  // If already logged in, go home
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/', { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const toUserSlug = (name) => {
    const base = (name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 24);
    return base || `user${Date.now()}`;
  };

  const validate = () => {
    if (!isLogin && !formData.fullName.trim()) {
      throw new Error('Full name is required for sign up.');
    }
    
    if (isLogin && !formData.email.trim()) {
      throw new Error('Email is required for sign in.');
    }
    
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error('Please enter a valid email address.');
      }
    }
    
    if (!formData.password || formData.password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    
    setLoading(true);
    setError('');
    submittingRef.current = true;

    try {
      validate();

      let response;
      if (isLogin) {
        const payload = {
          email: formData.email.trim(),
          password: formData.password,
        };
        response = await authAPI.login(payload);
      } else {
        const email = formData.email.trim() || `${toUserSlug(formData.fullName)}@quickchat.com`;
        const payload = {
          fullName: formData.fullName.trim(),
          email,
          password: formData.password,
        };
        response = await authAPI.register(payload);
      }

      const { token, user } = response?.data || {};
      if (!token || !user) {
        throw new Error('Invalid server response. Please try again.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.message || 'Authentication failed. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: '', email: '', password: '' });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('./assets/bgImage.svg')] bg-contain p-4">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-gray-600 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 flex-shrink-0">
            <img 
              src={assets.logo_icon} 
              alt="Logo" 
              className="w-full h-full object-contain"
              style={{ 
                filter: 'drop-shadow(0 0 4px rgba(147, 110, 255, 0.5))',
                imageRendering: 'crisp-edges'
              }}
            />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome to QuickChat' : 'Join QuickChat'}
          </h2>
          <p className="text-gray-300 mt-2">
            {isLogin ? 'Sign in to start chatting' : 'Create your account in seconds'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              {isLogin ? 'Email *' : 'Email (Optional)'}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required={isLogin}
              className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-violet-500 transition-colors"
              placeholder={isLogin ? "Enter your email" : "Enter email (or leave blank)"}
            />
            {!isLogin && (
              <p className="text-xs text-gray-400 mt-1">
                Leave blank to auto-generate: username@quickchat.com
              </p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-white">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={switchMode}
              className="text-violet-400 hover:text-violet-300 font-medium underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-200 text-xs text-center">
            💡 <strong>Demo:</strong> Create an account to start chatting. 
            The app will show dummy users for testing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
