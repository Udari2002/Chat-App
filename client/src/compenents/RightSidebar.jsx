import React from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

const RightSidebar = ({ selectedUser, currentUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!selectedUser) {
    return null;
  }

  return (
    <div className="h-full flex flex-col text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-600">
        <h3 className="text-lg font-semibold">User Details</h3>
      </div>

      {/* User Profile */}
      <div className="p-6 text-center">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt={selectedUser.fullName}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-violet-500/30 object-cover"
        />
        <h2 className="text-xl font-semibold mb-2">{selectedUser.fullName}</h2>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <span className="text-sm text-gray-300">
            {selectedUser.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <p className="text-gray-300 text-sm">
          {selectedUser.bio || 'Hi Everyone, I am Using QuickChat'}
        </p>
      </div>

      {/* Media Section */}
      <div className="flex-1 p-6">
        <h3 className="text-lg font-semibold mb-4">Media</h3>
        <div className="grid grid-cols-3 gap-2">
          {/* Placeholder media items */}
          <div className="aspect-square bg-violet-500/20 rounded-lg flex items-center justify-center">
            <img src={assets.gallery_icon} alt="Media" className="w-6 h-6 opacity-50" />
          </div>
          <div className="aspect-square bg-violet-500/20 rounded-lg flex items-center justify-center">
            <img src={assets.gallery_icon} alt="Media" className="w-6 h-6 opacity-50" />
          </div>
          <div className="aspect-square bg-violet-500/20 rounded-lg flex items-center justify-center">
            <img src={assets.gallery_icon} alt="Media" className="w-6 h-6 opacity-50" />
          </div>
          <div className="aspect-square bg-violet-500/20 rounded-lg flex items-center justify-center">
            <img src={assets.gallery_icon} alt="Media" className="w-6 h-6 opacity-50" />
          </div>
          <div className="aspect-square bg-violet-500/20 rounded-lg flex items-center justify-center">
            <img src={assets.gallery_icon} alt="Media" className="w-6 h-6 opacity-50" />
          </div>
          <div className="aspect-square bg-violet-500/20 rounded-lg flex items-center justify-center">
            <img src={assets.gallery_icon} alt="Media" className="w-6 h-6 opacity-50" />
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-6 border-t border-gray-600">
        <button
          onClick={handleLogout}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;