import { useContext, useState } from 'react';
import { UserContext } from '../context/User.Context.jsx';
import axios from '../config/axios.js';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Home(){
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [projectName,setProjectName] = useState('');
      const [projects,setProjects] = useState(null);
      const [error,setError] = useState(null);
       const navigate = useNavigate();

      
      const createProject = (e)=>{
           e.preventDefault();
           
           axios.post('/project/create',
            {name : projectName})
             .then((res)=>{
                  console.log(res);
                  setIsModalOpen(false);
             })
             .catch((error)=>{
                
             })
              setProjectName('');

      }
   useEffect(()=>{
         axios.get('/project/all')
              .then((res)=>{
                console.log(res.data.projects);
                setProjects(res.data.projects);
              })
              .catch((error)=>{
                   setError(error);
              })
      },[])
    return (
         <main className='p-4'>
          <div className='flex  gap-6'>
            <button 
            className='p-4 border-slate-300 text-xl border-2 rounded-md font-semibold cursor-pointer'
            onClick={()=>setIsModalOpen(true)}>
              New Project
            <i className="ri-link"></i>
            </button>

            {projects &&
              projects.map((project)=>(<div 
               key={project._id}
               className='min-w-52 p-4 text-xl border-slate-300 border-2 rounded-md font-semibold cursor-pointer hover:bg-slate-200'
               onClick={()=>navigate('project',{state : {project}})}
             >
              <h2>{project.name}   </h2>
               <div>
                  <p> <small> <i className="ri-user-line"></i> Collaborators</small> : {project.users.length}</p>
                </div>          
            </div>
            ))}

          </div>

          
              
              {isModalOpen && (
                <div className='fixed inset-0 flex justify-center items-center bg-slate-100'>
                  <div className='flex flex-col gap-5 bg-slate-200 p-7 rounded-2xl w-[350px]'>
                     <h1 className='text-3xl  font-bold'>Create new Project</h1>
                     <form onSubmit={createProject}>
                      <div className='flex flex-col gap-2 mb-5'> 
                    <label htmlFor="projectName" className='text-[20px] font-semibold text-slate-500'>Project Name</label>
                    <input 
                    className=" p-3 bg-white  rounded-lg  outline-blue-400 focus:outline-[2px] "
                    type="text"
                    id="projectName"
                    value={projectName}
                    placeholder='Enter project name...'
                    onChange={(e)=>setProjectName(e.target.value)}
                    />
                    </div>
                    <div className='flex gap-6 justify-center'>
                    <button 
                    type='button'
                    onClick={()=>{
                      setIsModalOpen(false);
                      setProjectName('');
                    }}
                    className='py-2 px-4 bg-slate-500 rounded-lg text-white font-semibold text-xl'
                    >
                      Cancel
                      </button>
                    <button type='submit' className='py-2 px-4 bg-blue-400 rounded-lg text-white font-semibold text-xl'>Create</button>
                    </div>
                     </form>
                  </div>
                </div>
              )}
             
         </main>
    )
}

export default Home;