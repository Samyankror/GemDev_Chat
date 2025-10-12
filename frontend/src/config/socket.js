import { io } from "socket.io-client";
import { store } from "../redux/store";
import { signOutSuccess } from "../redux/user/userSlice";

let socketInstance = null;

export const initializeSocket = async (projectId) => {
   if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      query: {
        projectId,
      },
    });
   }
  return socketInstance;
};
export const recieveMessage = (eventName, cb) => {
  socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
  socketInstance.emit(eventName, data);
};
