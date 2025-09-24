import { Link,useNavigate } from 'react-router-dom';
import { useState,useContext } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInSuccess,signInStart } from '../redux/user/userSlice.js';
import { fetchWithAuth } from '../utils/fetchWithAuth.js';
function Login() {
     const navigate = useNavigate();
     const { loading } = useSelector((state) => state.user);
     const [formData,setFormData] = useState({});
     const dispatch = useDispatch();
     const [error,setError] = useState(null);
     const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value})
     }

     const handleSubmit = async(e)=>{
    e.preventDefault();
    
    try{
      dispatch(signInStart());
    const data = await fetchWithAuth('/api/user/login',{
           method:'POST',
            headers : {
           "Content-Type" : "application/json",
            },
            body:JSON.stringify(formData)
    })
    
    if(data.success){
      dispatch(signInSuccess(data.user));
      setError(null);
    }
    else{
    dispatch(signInFailure());
     setError(data.message);
    }
    navigate('/')
    
  }catch(error){
    setError(error.message);
  }
   }
    
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-slate-800"
    >
<div className="w-[90%] max-w-md backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white">
        <h2 className="text-3xl font-semibold mb-6 text-center text-white">Login</h2>
        <form onSubmit = {handleSubmit} className='flex flex-col gap-4'>
             
          <div className="">
            <label className="block  font-semibold mb-2 text-white" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
               onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your email"
            />
          </div>
          <div className="">
            <label className="block  font-semibold text-white mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
               onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your password"
              autoComplete='on'
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-indigo-600 text-white text-xl font-semibold py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition duration-300 flex justify-center items-center gap-2"
          >
           {loading?'Loading':'Login'}
          </button>
        </form>

        <p className="text-white text-center mt-4 text-sm">
            Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
           Create one
          </Link>
        </p>

        {error && <p className='text-red-700 mt-2'>{error}</p>}

      </div> 
    </div>
  );
}

export default Login;