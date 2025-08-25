import { Link,useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import axios from '../config/axios';
import { UserContext } from '../context/User.Context.jsx';

function Register() {
     const navigate = useNavigate();
     const [formData,setFormData] = useState({});
      const {setUser} = useContext(UserContext);
     const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value})
     }
    const handleSubmit = async(e)=>{
         e.preventDefault();
         axios.post('/users/register',formData)
         .then((res)=>{
           console.log(res);
           localStorage.setItem('token',res.data.token);
           setUser(res.data.user);
           navigate('/');
         })
         .catch((error)=>{
            console.log(error.response.data);
        })
    }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-slate-800"
    >
<div className="w-[90%] max-w-md backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white">
        <h2 className="text-3xl font-semibold mb-6 text-center text-white">Register</h2>
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
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-semibold py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition duration-300 flex justify-center items-center gap-2"
          >
            Sign up
          </button>
        </form>

        
    
        <p className="text-white text-center mt-4 text-sm">
           Already have an account ?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login 
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;