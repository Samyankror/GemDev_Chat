import { useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "../config/axios";

function Project(){
   const location = useLocation();

   const [project, setProject] = useState(location.state?.project);
   const [isSidePanelOpen,setIsSidePanelOpen] = useState(false);
   const [isModalOpen,setIsModalOpen] = useState(false);
  const  [selectedUserId, setSelectedUserId] = useState(new Set());
  const [users,setUsers] = useState([]);
  

  const addCollaborators = ()=>{
        setIsModalOpen(false)
        axios.put('/project/add-user',{
          projectId: location.state.project._id,
          users: Array.from(selectedUserId),
        })
        .then((res)=>{
              console.log(res);
        })
        .catch((error)=>{
        console.log(error);
      })
  }

  const handleUserClick = (id)=>{
     setSelectedUserId((prev)=>{
      const newSet = new Set(prev);
       if(newSet.has(id)){
       newSet.delete(id);
     }
     else{
      newSet.add(id);
     }
     return newSet;
     })
  }

  useEffect(()=>{

    axios.get(`/project/get-project/${location.state.project._id}`)
      .then((res)=>{
          setProject(res.data.project);
      })
      .catch((error)=>{
        console.log(error);
      })
    
    axios.get('/users/all')
      .then((res)=>{
        const allUsers = res.data.allUsers;

         const projectUserIds = new Set(project?.users.map((user)=>user._id));

         const availableUsers = allUsers.filter((user)=>!projectUserIds.has(user._id));
         setUsers(availableUsers);
      })
      .catch((error)=>{
        console.log(error);
      })
  },[])

  
  
  
   return (
      <main className={`w-screen h-screen flex`}>
             <section className='relative flex flex-col min-w-80 h-screen bg-slate-300'>
                  <header className='flex justify-between items-center p-3  bg-rose-200 '>
                    <button 
                    className='flex font-semibold cursor-pointer'
                      onClick={()=>setIsModalOpen(true)}
                      >
                              <i className='ri-add-fill mr-1'></i>
                              <p>Add Collaborator</p>
                            </button>
                     <button className='text-xl cursor-pointer'
                     onClick={()=>setIsSidePanelOpen(!isSidePanelOpen)}>
                          <i className="ri-group-fill"></i>
                        </button>
                  </header>

                  <div className='flex flex-col'>
                           <div className='flex flex-col p-1 gap-1'>
                            
                                 <div className="message flex flex-col gap-1 p-2 max-w-64 bg-slate-50 rounded-md ">
                                     <small className='text-sm'>
                                       example@gmail.com
                                     </small>
                                     <p className='text-sm w-full'>Lorem, ipsum dolor sit amet consectetur </p>
                                 </div>
                                 <div className="message flex flex-col gap-1 p-2 max-w-64 bg-slate-50 rounded-md ">
                                     <small className='text-sm'>
                                       example@gmail.com
                                     </small>
                                     <p className='text-sm'>Lorem, ipsum dolor sit amet consectetur </p>
                                 </div>
                           </div>  
                  </div>
                   <div className='flex w-full   absolute bottom-0'>
                                <input 
                                type="text"
                                placeholder='Enter Message'
                                className='p-3 px-4 bg-white outline-none flex-grow'  />
                                <button className='px-4 bg-slate-950 text-white'>
                                 <i className="ri-send-plane-fill text-2xl"></i>
                                </button> 
                  </div>

                  <div className={`w-full h-full absolute bg-slate-100 transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
                      <header className='flex justify-between py-2 px-3 bg-slate-200'>
                                 <h1 className='font-semibold text-lg'>Collaborators</h1>
                               <button className='p-1 cursor-pointer'
                               onClick={()=>setIsSidePanelOpen(!isSidePanelOpen)}
                               >
                                <i className="ri-close-fill text-xl font-bold"></i>
                               </button>
                      </header>

                      <div className='flex flex-col p-2 gap-4'>
                        
                            {project.users && project.users.map((user)=>(
                              <div  key={user._id} className='flex gap-2 cursor-pointer hover:bg-slate-200 items-center'>
                                <div className='bg-slate-700  relative aspect-square w-fit h-fit rounded-full p-4 flex justify-center items-center'>
                                 <i className='ri-user-fill text-white absolute'></i>
                                </div>
                                < h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>
                            ))}
                      </div>
                  </div>
             </section>

             {isModalOpen && (
              <div className='fixed inset-0 flex justify-center items-center bg-black/40 z-50'>
                     <div className='flex flex-col gap-4  p-7 rounded-2xl w-[350px] bg-white '>
                         <div className='flex justify-between'>
                          <h2 className='font-semibold text-lg '>Select User</h2>
                          <button className='p-1 cursor-pointer'
                               onClick={()=>setIsModalOpen(!isModalOpen)}
                               >
                                <i className="ri-close-fill text-xl font-bold"></i>
                               </button>
                               </div>
                          <ul className='max-h-96 overflow-auto flex flex-col gap-1' >
                            {users.map((user) => (
                            <li
                            onClick={()=>handleUserClick(user._id)}
                              key={user._id}
                              className={`flex gap-3 p-1 rounded-md cursor-pointer ${
                             selectedUserId.has(user._id) ? "bg-slate-300" : ""
                              }`}
                              >
                        <div className="bg-slate-700 relative aspect-square w-fit h-fit rounded-full p-4 flex justify-center items-center">
                       <i className="ri-user-fill text-white absolute"></i>
                       </div>
                        <p className="font-semibold text-lg">{user.email}</p>
                      </li>
                     ))}
                          </ul>
                          <button 
                          className='font-semibold text-lg cursor-poiter bg-blue-400 p-1 text-white cursor-pointer rounded-md mx-auto py-2 px-3'
                          onClick={()=>addCollaborators()}>
                            Add Collaborators
                            </button>
                     </div>
                  </div>)}
      </main>
   )
}

export default Project;