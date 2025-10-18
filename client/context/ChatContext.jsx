import { createContext,useContext,useState } from "react";
import { AuthContext } from "./AuthContext";
import { set } from "mongoose";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({children}) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {socket, axios} = useContext(AuthtContext);
    
    //function to get all users for sidebar

    const getUsers =async () => {
        try{
            const {data} = await axios.get("/api/messagers/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    //function to get messages for selected user

    const getMessages = async (userId) => {
        try{
            const {data} = await axios.get(`/api/messagers/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        }catch(error){
            toast.error(error.message);
        } 
        
    }

    //function to send message to selected user
    
    const value ={
       
    }

    return (
    <ChatContext.Provider value={{value}}>
        {children}
    </ChatContext.Provider>)
}