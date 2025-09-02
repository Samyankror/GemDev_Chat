import { useLocation } from "react-router-dom";
import { useState } from "react";

function Project(){
   const location = useLocation();
   const [project, setProject] = useState(location.state?.project);
   const [isSidePanelOpen,setIsSidePanelOpen] = useState(false);
   

   return (
      <main className='w-screen h-screen flex'>
             <section className='relative flex flex-col min-w-80 h-screen bg-slate-300'>
                  <header className='flex justify-end p-3  bg-rose-200 '>
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
                      <header className='flex justify-end py-2 px-3 bg-slate-200'>
                               <button className='p-1 cursor-pointer'
                               onClick={()=>setIsSidePanelOpen(!isSidePanelOpen)}
                               >
                                <i className="ri-close-fill text-xl font-bold"></i>
                               </button>
                      </header>

                      <div className='flex p-2 gap-2'>
                        <div className='flex gap-2 cursor-pointer hover:bg-slate-200 items-center'>
                                <div className='bg-slate-700  aspect-square w-fit h-fit rounded-full p-4 flex justify-center items-center'>
                                 <i className='ri-user-fill text-white absolute'></i>
                                </div>

                                < h1 className='font-semibold text-lg'>username</h1>
                        </div>
                      </div>
                  </div>
             </section>
      </main>
   )
}

export default Project;