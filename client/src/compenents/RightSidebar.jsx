import React, { useState, useEffect, useContext } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {

  const {selectedUser, messages} = useContext(ChatContext)
  const {logout, onlineUsers} = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([]);

  //get all images from the messages and set them to state
  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  },[messages])

  return selectedUser && (
    <div className="bg-[#8185B2]/10 text-white w-full h-full p-5 pt-4 relative overflow-y-auto pb-24 border-l border-gray-600/40 rounded-l-xl">

  <div className='pt-0 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
  <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" 
        className='w-20 h-20 rounded-full object-cover'/>
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {Array.isArray(onlineUsers) && onlineUsers.includes(String(selectedUser._id)) &&
           <p className='w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUser.fullName}
          </h1>
          <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>

      <hr className='border-[#ffffff30] my-4'/>
      <div className='px-5 text-xs'>
        <p className='uppercase tracking-wide text-gray-300'>Media</p>
        <div className='mt-2 max-h-[220px] overflow-y-auto grid grid-cols-2 gap-4 opacity-80'>
          {Array.isArray(msgImages) && msgImages.length > 0 ? msgImages.map((url,index)=>(
            <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt="" className='w-full h-24 object-cover rounded-md' />

            </div>
          )) : (
            <p className='text-gray-400'>No media yet</p>
          )}

        </div>
      </div>

      <button onClick={() => logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2
       bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none
        text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
        Logout
      </button>
    </div>
  )
}

export default RightSidebar