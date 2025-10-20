import React, { useState} from 'react'
import Sidebar from '../compenents/Sidebar'
import ChatContainer from '../compenents/ChatContainer'
import RightSidebar from '../compenents/RightSidebar'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext);

return (
    <div className='w-full h-screen px-4 py-6 md:py-10'>
      <div className={`max-w-[1200px] mx-auto border border-gray-700/50 bg-black/30 rounded-2xl overflow-hidden h-full grid grid-cols-1 shadow-2xl ${
        selectedUser ? 'md:grid-cols-[280px_1fr_320px]' : 'md:grid-cols-[280px_1fr]'
      }`}>
        <div className='md:col-span-1'>
          <Sidebar />
        </div>
        <div className={selectedUser ? 'md:col-span-1' : 'md:col-span-1'}>
          <ChatContainer />
        </div>
        {selectedUser && (
          <div className='md:col-span-1'>
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage