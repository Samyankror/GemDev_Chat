import { useLocation } from "react-router-dom";
import { useState,useEffect, useContext, useRef } from "react";
import axios from "../config/axios.js";
import { initializeSocket, recieveMessage, sendMessage } from "../config/socket.js";
import { UserContext } from "../context/User.Context.jsx";
import Markdown from 'markdown-to-jsx'
import { useSelector} from 'react-redux';
// import { getWebContainer } from "../config/webContainer.js";

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
   const {currUser} = useSelector(state => state.user)
  const [openFiles,setOpenFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  // const [webContainer, setWebContainer] = useState(null);
  // const [iframeUrl,setIframeUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);

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
       
        axios.put('/api/project/add-user',{
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
  console.log(currUser);
  const send = ()=>{

      sendMessage('project-message',{
        message,
        sender_id: currUser._id
      })
      setMessages(prevMessages=>[...prevMessages,{username:currUser.username,email: currUser.email,message}])
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

  
   const saveFileTree = (ft)=>{
    axios.put('/api/project/update-file-tree',{
       projectId: project._id,
       fileTree: ft
    })
    .then((res)=>{
      console.log(res);
    })
    .catch((error)=>{
         console.log(error);
    })
    
   }
   
  useEffect(()=>{
     console.log(project._id)
    initializeSocket(project._id);
  //    if(!webContainer){
  //   getWebContainer().then((container) => {
  //       setWebContainer(container);
  //       console.log('WebContainer Started');
  //   });
  // }

     recieveMessage('project-message',(data)=>{
      
       
        
        
        // webContainer?.mount(Inmessage.fileTree);
    
         if(data.email=='ai'){
           const Inmessage = JSON.parse(data.message);
            if(Inmessage.fileTree) setFileTree(Inmessage.fileTree);

           setMessages(prev => [...prev, {message:Inmessage.text,username:'ai',email:'ai'}]);
         }
         else{
        setMessages(prev => [...prev, data]);
         }
      
      // appendIncomingMessage(data);
     })

    axios.get(`/api/project/get-project/${location.state.project._id}`)
      .then((res)=>{
          setProject(res.data.project);
          setFileTree(res.data.project.fileTree)
      })
      .catch((error)=>{
        console.log(error);
      })
    
    axios.get('/api/users/all')
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
  
  console.log(project.users);
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
                                
                                <div key={index} className={`flex flex-col gap-1 p-2 max-w-80 bg-slate-50 rounded-md  ${currUser.email===msg.email ? 'ml-auto' : 'mr-auto'}`}>
                                <small className='text-sm opacity-70'>{msg.username}</small>

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
                                < h1 className='font-semibold text-lg'>{user.username}</h1>
                                </div>
                            ))}
                      </div>
                  </div>
             </section>

             <section className='right   flex-grow h-full flex'>
               <div className="explorer h-full max-w-64 min-w-52  bg-slate-200">
                   <div className='file-tree'>
                    {fileTree &&
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
                    
                     
                      <div className='flex'>
                    {openFiles.map((file,index)=>(
                         <button 
                          onClick={()=>setCurrentFile(file)}
                          className={`text-lg ${file==currentFile?'bg-slate-400':'bg-slate-200'} p-2 px-4 padding font-semibold `}>{file}</button>
                    ))}
                      </div>
                      


                      {/* <div className='bg-black p-2 px-4'>
                           <button
                           className='text-white font-semibold'
                           onClick={async()=>{
                             await webContainer?.mount(fileTree);

                             const installProcess = await webContainer.spawn("npm",["install"]);
                             installProcess.output.pipeTo(new WritableStream({
                                  write(chunk){
                                    console.log(chunk);
                                  }
                             }))

                             if(runProcess){
                              runProcess.kill();
                             }
                              const tempRunProcess = await webContainer.spawn("npm",["start"]);
                            
                             tempRunProcess.output.pipeTo(new WritableStream({
                              write(chunk){
                                console.log(chunk);
                              }
                             }))

                             setRunProcess(tempRunProcess);
                              webContainer.on('server-ready', (port, url) => {
                                        console.log(port, url)
                                        setIframeUrl(url)
                                        
                                    })


                           }}
                           >run</button>
                      </div> */}
                      

                    <div className='bottom flex flex-grow bg-white'>
                    { fileTree && fileTree[currentFile] && (
                      <textarea 
                       value={fileTree[currentFile].file.contents}
                      className='w-full h-full'
                      onChange={(e)=>{
                        const updatedContent = e.target.value;
                        const ft = {...fileTree,
                            [currentFile]:{
                              file: {
                                contents: updatedContent
                              }
                            }
                        } 
                        setFileTree(ft);
                        saveFileTree(ft);
                      }}
                      
                      />
                     )}
                    </div>
               </div>
               )}

                {/* {iframeUrl && webContainer &&
                    (<div className="flex min-w-96 flex-col h-full">
                        <div className="address-bar">
                            <input type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl} className="w-full p-2 px-4 bg-slate-200" />
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full"></iframe>
                    </div>)
                } */}
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
                        <p className="font-semibold text-lg">{user.username}</p>
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