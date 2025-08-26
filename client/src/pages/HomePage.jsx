import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../compenents/Sidebar';
import ChatContainer from '../compenents/ChatContainer';
import RightSidebar from '../compenents/RightSidebar';
import { usersAPI } from '../lib/api';
import socketService from '../lib/socket';
import { userDummyData } from '../assets/assets';

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);
  const navigate = useNavigate();

  // Mark online/offline helpers with robust error logging
  const setOnline = async (flag) => {
    try {
      await usersAPI.updateOnlineStatus(Boolean(flag));
    } catch (err) {
      // Surface the server's message if available
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update online status';
      console.error(`updateOnlineStatus(${flag}) →`, msg);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAllUsers();
      if (!mountedRef.current) return;

      if (response?.data && response.data.length > 0) {
        setUsers(response.data);
      } else {
        // Use dummy users when database is empty
        setUsers(userDummyData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to dummy data
      if (mountedRef.current) setUsers(userDummyData);

      // If unauthorized, force re‑login
      if (error?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login');
      return () => {
        mountedRef.current = false;
      };
    }

    const user = JSON.parse(userStr);
    setCurrentUser(user);

    // Connect socket first (so we're present in room before announcing online)
    socketService.connect(token);
    socketService.joinRoom(user._id);

    // Mark online after connect
    setOnline(true);

    // Load user list
    fetchUsers();

    // Cleanup: mark offline and disconnect
    return () => {
      mountedRef.current = false;

      // best-effort offline (no await; component is unmounting)
      setOnline(false);

      try {
        socketService.disconnect();
      } catch {
        /* ignore */
      }
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('./assets/bgImage.svg')] bg-contain">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('./assets/bgImage.svg')] bg-contain p-4">
      <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)] bg-[#8185B2]/10 backdrop-blur-xl rounded-2xl border border-gray-600 overflow-hidden">
        <div className="h-full flex">
          {/* Left Sidebar - User List */}
          <div className="w-1/4 bg-[#8185B2]/10 backdrop-blur-xl border-r border-gray-600">
            <Sidebar
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              users={users}
              currentUser={currentUser}
            />
          </div>

          {/* Center Chat Area */}
          <div className="flex-1 bg-[#8185B2]/10 backdrop-blur-xl">
            <ChatContainer
              selectedUser={selectedUser}
              currentUser={currentUser}
            />
          </div>

          {/* Right Sidebar - User Details */}
          {selectedUser && (
            <div className="w-1/4 bg-[#8185B2]/10 backdrop-blur-xl border-l border-gray-600">
              <RightSidebar
                selectedUser={selectedUser}
                currentUser={currentUser}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;