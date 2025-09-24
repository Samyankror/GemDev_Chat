import socket from 'socket.io-client'

let socketInstance = null;

export const initializeSocket  = (projectId)=>{
    if(!socketInstance){
    socketInstance = socket(import.meta.env.VITE_API_URL,{
          withCredentials: true, 
        query: {
        projectId
        }
    });
    return socketInstance;
}
}
export const recieveMessage = (eventName,cb)=>{
    socketInstance.on(eventName,cb);
} 

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data);
}

