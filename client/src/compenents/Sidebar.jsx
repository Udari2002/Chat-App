import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

const Sidebar = ({ selectedUser, setSelectedUser, users = [], currentUser }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-600">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0">
              <img 
                src={assets.logo_icon} 
                alt="logo" 
                className="w-full h-full object-contain"
                style={{ 
                  filter: 'drop-shadow(0 0 2px rgba(147, 110, 255, 0.3))',
                  imageRendering: 'crisp-edges'
                }}
              />
            </div>
            <span className="text-xl font-semibold">QuickChat</span>
          </div>
          <div className="relative group">
            <img src={assets.menu_icon} alt="Menu" className="w-5 h-5 cursor-pointer" />
            <div className="absolute top-full right-0 z-20 w-32 p-3 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p onClick={() => navigate('/profile')} className="cursor-pointer text-sm hover:text-violet-400">
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={handleLogout} className="cursor-pointer text-sm hover:text-violet-400">Logout</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="bg-[#282142] rounded-full flex items-center gap-3 px-4 py-3">
            <img src={assets.search_icon} alt="Search" className="w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-sm placeholder-gray-400 flex-1"
              placeholder="Search User..."
            />
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {filteredUsers.map((user) => (
            <div
              onClick={() => setSelectedUser(user)}
              key={user._id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#282142]/50 ${
                selectedUser?._id === user._id ? 'bg-[#282142]' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#282142]"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{user.fullName}</p>
                <p className={`text-sm ${user.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                  {user.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
