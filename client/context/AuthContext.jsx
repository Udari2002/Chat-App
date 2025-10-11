import axios from "axios";
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

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
          }
        }catch(error){
            toast.error(error.message);
        }
    }

    //

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
        token,
        setToken,
        authUser,
        setAuthUser,
        onlineUsers,
        setOnlineUsers,
        socket,
        setSocket,
        checkAuth
     }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}