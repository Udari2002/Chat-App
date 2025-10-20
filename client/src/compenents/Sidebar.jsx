import React,{useContext, useEffect, useState} from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {

  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);
  
  // Add defensive checks for context values
  if (!chatContext || !authContext) {
    return <div className='text-white p-4'>Loading...</div>;
  }

  const {getUsers, users = [], selectedUser, setSelectedUser, unseenMessages = {}, setUnseenMessages} = chatContext;
  const {logout, onlineUsers = []} = authContext;

  const [input,setInput]=useState("");
   
   const navigate = useNavigate();

   const filteredUsers = input && users && Array.isArray(users) ? 
     users.filter((user) => user.fullName && user.fullName.toLowerCase().includes(input.toLowerCase())) : 
     users || [];

   useEffect(() => {
     if (getUsers && typeof getUsers === 'function') {
       getUsers();
     }
   },[getUsers, onlineUsers])

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white
     ${selectedUser ?"max-md:hidden":''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt='logo' className='max-w-40'/>
          <div className='relative py-2 group'>
            <img src={assets.menu_icon} alt='Menu' className='max-h-5 cursor-pointer'/>
            <div className='absolute top-full right-0 z-0 w-32 p-5 rounded-md bg-[#282142]
            border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>

              <hr className='my-2 border-t border-gray-500' />

              <p onClick={() => logout()} className='cursor-pointer text-sm'>Logout</p>
            </div>
          </div>
        </div>
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt='Search' className='w-3'/>
          <input onChange={(e) => setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white
          text-sm placeholder-[#c8c8c8] flex-1' placeholder='SearchUser...'/>
        </div>
      </div>

      <div className='flex flex-col'>
        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? filteredUsers.map((user,index)=>(
          <div onClick={() => {setSelectedUser && setSelectedUser(user)}}
            key={user._id || index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm
            ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
              
            <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1]
            rounded-full' />

            <div className='flex flex-col leading-5'>
              <p>{user.fullName || 'Unknown User'}</p>
              {
                Array.isArray(onlineUsers) && onlineUsers.includes(String(user._id))
                ? <span className='text-green-400 text-xs'>Online</span>
                : <span className='text-neutral-400 text-xs'>Offline</span>
              }

            </div>
            {unseenMessages && unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center
            items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}
          </div>
        )) : (
          <div className='text-center text-gray-400 p-4'>
            {users && users.length === 0 ? 'No users found' : 'Loading users...'}
          </div>
        )}

      </div>
    </div>
  )
}

export default Sidebar