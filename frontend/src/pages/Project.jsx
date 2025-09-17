import { useLocation } from "react-router-dom";
import { useState,useEffect, useContext, useRef } from "react";
import axios from "../config/axios.js";
import { initializeSocket, recieveMessage, sendMessage } from "../config/socket.js";
import { UserContext } from "../context/User.Context.jsx";
import Markdown from 'markdown-to-jsx'

function Project(){
   const location = useLocation();
    const messageBoxRef = useRef();
   const [project, setProject] = useState(location.state?.project);
   const [isSidePanelOpen,setIsSidePanelOpen] = useState(false);
   const [isModalOpen,setIsModalOpen] = useState(false);
  const  [selectedUserId, setSelectedUserId] = useState(new Set());
  const [users,setUsers] = useState([]);
  const [message,setMessage] = useState('');

  const [messages,setMessages] = useState([]);
  
   const [fileTree, setFileTree] = useState({});
  const { user } = useContext(UserContext);
  const [openFiles,setOpenFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);

  

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
  const addCollaborators = ()=>{
       
        axios.put('/project/add-user',{
          projectId: location.state.project._id,
          users: Array.from(selectedUserId),
        })
        .then((res)=>{
            setIsModalOpen(false)
        })
        .catch((error)=>{
        console.log(error);
      })
  }
  const send = ()=>{
      sendMessage('project-message',{
        message,
        sender: user._id
      })
      setMessages(prevMessages=>[...prevMessages,{email: user.email,message}])
      setMessage('');
  }
   function writeAiMessage(message){
    //const messageObject = message;
    //  console.log(message)
    return (
       <div
                className='overflow-auto bg-slate-950 text-white rounded-sm p-2 '
            >
                <Markdown
                    children={message}
                    // options={{
                    //     overrides: {
                    //         code: SyntaxHighlightedCode,
                    //     },
                    // }}
                />
            </div>
    )
   }

  

   
  useEffect(()=>{
     
    initializeSocket(project._id);
     recieveMessage('project-message',(data)=>{
      
        
        // if(data.fileTree){
          // console.log(data.fileTree);
          // console.log(typeof data.fileTree,"hello");
          // setFileTree(data.fileTree);
        //  setFileTree(data.fileTree );
          
        // }
        const Inmessage = JSON.parse(data.message);
        console.log(Inmessage);
        setMessages(prev => [...prev, data]);
       if(Inmessage.fileTree) setFileTree(Inmessage.fileTree);
      // appendIncomingMessage(data);
     })

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
 
 

 
  useEffect(()=>{
    messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
  },[messages]);
  
  
   return (
      <main className={`w-screen h-screen flex`}>
             <section className='left relative flex flex-col min-w-96 h-screen bg-slate-300'>
                  <header className='flex justify-between items-center p-3  bg-rose-200 flex-0.5 '>
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

                 
                           <div  ref={messageBoxRef} className='message-box flex mt-1 flex-col px-1 pt-1 pb-3 gap-2 overflow-auto  flex-10 '>
                            
                           {  messages.map((msg,index)=>(
                                
                                <div key={index} className={`flex flex-col gap-1 p-2 max-w-80 bg-slate-50 rounded-md  ${user.email===msg.email ? 'ml-auto' : 'mr-auto'}`}>
                                <small className='text-sm opacity-70'>{msg.email}</small>

                                   {msg.email === 'ai' ? (
      writeAiMessage(msg.message)  
    ) : (
      <p className="text-sm font-semibold">{msg.message}</p>
    )}
                                 </div>
                           ))}
                           </div>  
                  
                   <div className='flex    flex-0.5'>
                                <input 
                                type="text"
                                value={message}
                                onChange={(e)=>setMessage(e.target.value)}
                                placeholder='Enter Message'
                                className='p-3 px-4 bg-white outline-none  flex-grow'  />
                                <button 
                                onClick={()=>send()}
                                className='px-4 bg-slate-950 text-white cursor-pointer'>
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

             <section className='right  bg-red-50 flex-grow h-full flex'>
               <div className="explorer h-full max-w-64 min-w-52  bg-slate-200">
                   <div className='file-tree'>
                    {
                      Object.keys(fileTree).map((file,index)=>(
                      <div 
                      className='tree-element cursor-pointer p-2 bg-slate-300' 
                      onClick={()=>{
                        setCurrentFile(file)
                        setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                        }}>
                     <p className=' font-semibold text-lg'>{file}</p>
                     </div>
                    ))}
                   </div>
               </div>
                
               {openFiles && ( 
               <div className='code-editor flex flex-col flex-grow'>
                    <div className='top p-2 bg-red-200 flex gap-4'>
                    {openFiles.map((file,index)=>(
                         <button 
                          onClick={()=>setCurrentFile(file)}
                          className='text-lg font-semibold '>{file}</button>
                    ))}
                      </div>
                    <div className='bottom flex flex-grow bg-white'>
                    { fileTree[currentFile] && (
                      <textarea 
   value={fileTree[currentFile].file.contents}
   onChange={(e) => {
     setFileTree(prev => ({
       ...prev,
       [currentFile]: {
          file :{
         contents: e.target.value
          },
       }
     }));
   }}
   className='w-full h-full '
/>
                     )}
                    </div>
               </div>
               )}
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