import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../lib/api';
import assets from '../assets/assets';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    profilePic: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Load user data on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      setFormData({
        fullName: userObj.fullName || '',
        bio: userObj.bio || '',
        profilePic: userObj.profilePic || ''
      });
      setImagePreview(userObj.profilePic || '');
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setFormData(prev => ({ ...prev, profilePic: base64 }));
      setImagePreview(base64);
      setError('');
      setSuccess('Profile picture updated! Click Save Changes to apply.');
    };
    reader.onerror = () => {
      setError('Error reading image file. Please try again.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (formData.fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters long');
      return;
    }

    if (formData.bio && formData.bio.length > 200) {
      setError('Bio must be less than 200 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await usersAPI.updateProfile(formData);
      const updatedUser = response.data;
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      profilePic: user?.profilePic || ''
    });
    setImagePreview(user?.profilePic || '');
    setError('');
    setSuccess('');
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('./assets/bgImage.svg')] bg-contain">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('./assets/bgImage.svg')] bg-contain p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-300">Manage your account and profile information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-gray-600 p-8">
          {/* Profile Picture Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img
                src={imagePreview || assets.avatar_icon}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto border-4 border-violet-500/30 object-cover"
              />
              <button
                onClick={triggerImageUpload}
                className="absolute bottom-2 right-2 bg-violet-600 hover:bg-violet-700 rounded-full p-3 cursor-pointer transition-colors shadow-lg"
                title="Change Profile Picture"
              >
                <img src={assets.gallery_icon} alt="Upload" className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImagePick}
              />
            </div>
            <p className="text-gray-300 text-sm mt-3">
              Click the camera icon to upload a new profile picture
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Supported: JPEG, PNG, GIF (max 5MB)
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-200 p-4 rounded-lg mb-6 text-sm">
              {success}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg text-white placeholder-gray-300 transition-colors ${
                  isEditing 
                    ? 'bg-white/10 border border-gray-600 focus:border-violet-500 focus:outline-none' 
                    : 'bg-gray-700/50 border border-gray-600 text-gray-300'
                }`}
                placeholder="Enter your full name"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                disabled={!isEditing}
                maxLength={200}
                className={`w-full px-4 py-3 rounded-lg text-white placeholder-gray-300 resize-none transition-colors ${
                  isEditing 
                    ? 'bg-white/10 border border-gray-600 focus:border-violet-500 focus:outline-none' 
                    : 'bg-gray-700/50 border border-gray-600 text-gray-300'
                }`}
                placeholder="Tell us about yourself..."
              />
              <div className="text-right mt-1">
                <span className={`text-xs ${formData.bio.length > 180 ? 'text-red-400' : 'text-gray-400'}`}>
                  {formData.bio.length}/200
                </span>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email || 'No email provided'}
                disabled
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
              />
              <p className="text-gray-400 text-xs mt-1">
                Email cannot be changed for security reasons
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {!isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Back to Chat
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Logout Section */}
          <div className="mt-8 pt-6 border-t border-gray-600">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            💡 <strong>Tip:</strong> Your profile picture and information will be visible to other users in the chat
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;