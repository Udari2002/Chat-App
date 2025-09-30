import React from 'react'
import assets from '../assets/assets'

const LoginPage = () => {

 const [currState, setCurrtState] = React.useState('Sign Up') // login, signup
 const [fullName, setFullName] = React.useState('')
 const [email, setEmail] = React.useState('')
 const [password, setPassword] = React.useState('')
 const [bio, setBio] = React.useState('')
 const [isDataSubmitted, setIsDataSubmitted] = React.useState(false);


 const onSubmitHandler = (event) =>{
   event.preventDefault();

   if(currState === 'Sign Up' && !isDataSubmitted){
     setIsDataSubmitted(true)
     return;
   } else {
     // Handle Login
     console.log({ email, password });
   }

   setIsDataSubmitted(true);
 }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8
    sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/*-------------LEFT SIDE---------------- */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />

      {/*-------------RIGHT SIDE---------------- */}

      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col
       gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} 
          src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/> }
          
          </h2>

          {currState === 'Sign Up' && !isDataSubmitted && (
          <input onChange={(e)=> setFullName(e.target.value)} value={fullName}
           type="text" className='p-3 bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400'
          placeholder="Full Name" required/>
          )}

          {!isDataSubmitted && (
            <>
            <input onChange={(e)=> setEmail(e.target.value)} value={email}
             type="email" placeholder='Email Address' required 
            className='p-3 bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400'/>

            <input onChange={(e)=> setPassword(e.target.value)} value={password}
             type="password" placeholder='Password' required 
            className='p-3 bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400'/>
            </>
          )}

          {currState === 'Sign Up' && isDataSubmitted && (
              <textarea onChange={(e)=> setBio(e.target.value)} value={bio}
               rows={4} className='p-3 bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400'
              placeholder='provide a short bio...' required></textarea>
            )
            }

            <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md
            cursor-pointer'>
              {currState === 'Sign Up' ? "Create Account" : "Login Now"}
            </button>

            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <input type="checkbox" />
              <p>I agree to the Terms and Conditions</p>
            </div>

            <div className='lex flex-col gap-2'>
              {currState === 'Sign Up' ? (
                <p className='text-sm text-gray-600'>Already have an account?
                 <span className='text-violet-500 cursor-pointer font-medium'
                  onClick={() => { setCurrtState('Login'); setIsDataSubmitted(false); }}>Login here</span></p>
              ) : (
                <p className='text-sm text-gray-600'>Don't have an account?  
                 <span className= 'text-violet-500 cursor-pointer font-medium' 
                 onClick={() => { setCurrtState('Sign Up'); setIsDataSubmitted(false); }}> Click here</span></p>
              )}
            </div>

      </form>
    </div>
  )
}

export default LoginPage