import { createContext,useContext,useEffect,useState,useMemo } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({children}) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const authContext = useContext(AuthContext);
    const socket = authContext?.socket;
    const axios = authContext?.axios;
    
    //function to get all users for sidebar
    const getUsers =async () => {
        try{
            if (!axios) {
                console.log('Axios not available yet');
                return;
            }
            console.log('Calling getUsers API...');
            const {data} = await axios.get("/api/message/users");
            console.log('API response:', data);
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
                console.log('Users set:', data.users);
            } else {
                console.error('API returned success:false', data.message);
            }
        }catch(error){
            console.error('getUsers error:', error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //function to get messages for selected user
    const getMessages = async (userId) => {
        try{
            const {data} = await axios.get(`/api/message/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        }catch(error){
            toast.error(error.response?.data?.message || error.message);
        } 
    }

    //function to send message to selected user
    const sendMessage = async (messageData) => {
        try{
            const {data} = await axios.post(`/api/message/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            }else{
                toast.error(data.message);
            }
        }catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //function to subscribe to message for selected user
    const subscribeToMessages = () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/message/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }));
            }
        });
    }

    //function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if(socket) socket.off("newMessage");
    }

    //function to mark message as seen  
    const markMessagesAsSeen = async (userId) => {
        try{
            const {data} = await axios.put(`/api/message/seen/${userId}`);
            if(data.success){
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [userId]: 0
                }));
            }
        }catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket,selectedUser]);

    const value = useMemo(() => ({
       messages,
       users,
       selectedUser,
       unseenMessages,
       getUsers,
       getMessages,
       sendMessage,
       setSelectedUser,
       setUnseenMessages,
       markMessagesAsSeen
    }), [messages, users, selectedUser, unseenMessages]);

    return (
    <ChatContext.Provider value={{value}}>
        {children}
    </ChatContext.Provider>)
}