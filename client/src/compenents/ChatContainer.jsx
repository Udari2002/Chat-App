import React, { useEffect } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'

const ChatContainer = ({selectedUser,setSelectedUser}) => {

  const scrollEnd = React.useRef();

  useEffect(() => {
    if(scrollEnd.current){
      scrollEnd.current.scrollIntoView({behavior:"smooth"})
    }
  },[])

  return selectedUser ? (
    <div className='h-full flex flex-col backdrop-blur-lg'>

      {/*----------- Chat Header------------- */}
      <div className='flex items-center gap-3 py-3 px-4 border-b border-stone-500 flex-shrink-0'>
        <img src={selectedUser?.profilePic || assets.profile_martin} alt="" className='w-8 rounded-full'/>
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser?.fullName || 'Martin Johnson'} 
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
        </p>
        <button 
          onClick={() => setSelectedUser(null)} 
          className='md:hidden bg-transparent border-none p-1'
        >
          <img src={assets.arrow_icon} alt="Go back" className='max-w-7'/>
        </button>
        <img src={assets.help_icon} alt="Help" className='max-md:hidden max-w-5'/>
      </div>

      {/*----------- Chat Area------------- */}
      <div className='flex-1 overflow-y-auto p-3 pb-6'>
        <div className='flex flex-col gap-4'>
          {messagesDummyData.map((msg,index)=>{
            const isCurrentUser = msg.senderId === '680f50e4f10f3cd28382ecf9';
            const senderName = msg.senderName || (isCurrentUser ? 'You' : (selectedUser?.fullName || 'Martin Johnson'));
            
            return (
              <div key={msg._id || index} className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                {/* Avatar - Show on left for others, right for current user */}
                {!isCurrentUser && (
                  <img 
                    src={selectedUser?.profilePic || assets.profile_martin} 
                    alt={senderName} 
                    className='w-8 h-8 rounded-full flex-shrink-0'
                  />
                )}
                
                {/* Message Content */}
                <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name */}
                  <p className={`text-xs text-gray-400 mb-1 px-2 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                    {senderName}
                  </p>
                  
                  {/* Message Bubble */}
                  {msg.image ? (
                    <img 
                      src={msg.image || assets.pic1} 
                      alt="Shared content" 
                      className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-90' 
                    />
                  ) : (
                    <div className={`p-3 rounded-lg break-words ${
                      isCurrentUser 
                        ? 'bg-violet-500 text-white rounded-br-none' 
                        : 'bg-gray-700 text-white rounded-bl-none'
                    }`}>
                      <p className='text-sm'>{msg.text}</p>
                    </div>
                  )}
                  
                  {/* Timestamp and Read Status */}
                  <div className={`flex items-center gap-2 mt-1 px-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <p className='text-xs text-gray-500'>
                      {formatMessageTime(msg.createdAt)}
                    </p>
                    {isCurrentUser && (
                      <span className={`text-xs ${msg.seen ? 'text-blue-400' : 'text-gray-500'}`}>
                        {msg.seen ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Avatar for current user */}
                {isCurrentUser && (
                  <img 
                    src={assets.avatar_icon} 
                    alt="You" 
                    className='w-8 h-8 rounded-full flex-shrink-0'
                  />
                )}
              </div>
            );
          })}
          <div ref={scrollEnd}></div>
        </div>
      </div>

      {/*----------- Chat Input Area ------------- */}
      <div className='flex items-center gap-3 py-3 px-4 border-t border-stone-500 bg-gray-900/30 flex-shrink-0'>
        <input 
          type="text" 
          placeholder={`Message ${selectedUser?.fullName || 'Martin Johnson'}...`}
          className='flex-1 bg-gray-800/50 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500'
        />
        <input type="file" id="imageUpload" accept='image/png, image/jpeg' hidden />
        <label htmlFor="imageUpload" className='cursor-pointer'>
          <img src={assets.gallery_icon} alt="Attach file" className='w-6 h-6 opacity-70 hover:opacity-100'/>
        </label>
        <button className='cursor-pointer'>
          <img src={assets.send_button} alt="Send message" className='w-6 h-6 opacity-70 hover:opacity-100'/>
        </button>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="" className='max-w-16'/>
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer