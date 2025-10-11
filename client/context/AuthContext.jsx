import axios from "axios";
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('token'));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    //Check if user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        try{
          const {data} = await axios.get("/api/auth/check");
          if(data.success){
            setAuthUser(data.user);
            connectSocket(data.user);
          }
        }catch(error){
            toast.error(error.message);
        }
    }
//Login function to handle user authentication and socket connection
    const login = async (state, credentials) => {
        try{
           const {data} = await axios.post(`/api/auth/${state}`, credentials);
           if(data.success){
            setAuthUser(data.userData);
            connectSocket(data.userData);
            axios.defaults.headers.common['token'] = data.token;
            setToken(data.token);
            localStorage.setItem('token', data.token);
            toast.success(data.message);
           }else{
            toast.error(data.message);
           }
        }catch(error){
            toast.error(error.message);
        }
    }
    //Logout function to handle user logout and socket disconnection
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common['token'] = null;
        toast.success("Logged out successfully");
        socket.disconnect();
    }

    //Update profile function to handle user profile updates
    const updateProfile = async (body) => {
        try{
            console.log('Calling update profile API with:', body);
            const {data} = await axios.put("/api/auth/updateProfile", body);
            console.log('Update profile response:', data);
            
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        }catch(error){
            console.error('Update profile error:', error);
            
            if (error.response) {
                // Server responded with error status
                const message = error.response.data?.message || `Server error: ${error.response.status}`;
                toast.error(message);
            } else if (error.request) {
                // Network error
                toast.error("Network error: Could not connect to server");
            } else {
                // Other error
                toast.error(error.message || "An unexpected error occurred");
            }
            throw error; // Re-throw so ProfilePage can handle it
        }
    }
    //Connect socket function to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        const newSocket = io(backendURL, {
            query:{
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on('getOnlineUsers', (userIds) => {
            setOnlineUsers(userIds);
        });
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['token'] = token;
        }
        checkAuth();
    },[])

    // Check authentication on component mount
    useEffect(() => {
        if (token) {
            checkAuth();
        }
    }, [token]);

    const value ={
        axios,
        authUser,
        onlineUsers,
        login,
        logout,
        updateProfile
     }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}