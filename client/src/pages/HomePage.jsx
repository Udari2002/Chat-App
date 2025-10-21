import React, { useState} from 'react'
import Sidebar from '../compenents/Sidebar'
import ChatContainer from '../compenents/ChatContainer'
import RightSidebar from '../compenents/RightSidebar'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext);

return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
      <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 ${selectedUser ? 'md:grid-cols-3' : 'md:grid-cols-2'} relative`}>
        <div className='md:col-span-1'>
          <Sidebar />
        </div>
        <div className='md:col-span-1 min-h-0'>
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