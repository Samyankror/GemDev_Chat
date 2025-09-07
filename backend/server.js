import http from 'http';
import app from './app.js';
import dotenv from 'dotenv'; 
import connect  from  './db/db.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import userModel from './models/user.model.js';



dotenv.config();

connect();

const server = http.createServer(app);
const io = new Server(server,{
    cors : {
        origin: '*'
    }
})

io.use(async(socket,next)=>{
    try{
      const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
       const projectId = socket.handshake.query.projectId;

       if(!mongoose.Types.ObjectId.isValid(projectId)){
             return next(new Error('Invalid projectId'));
       }

         socket.project = await projectModel.findById(projectId);

      if(!token){
        return next(new Error('Authentication error'));
      }
       
      

      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    }catch(error){
        next(error);
    }
})

io.on('connection',(socket)=>{
    console.log('a user connected');
    socket.roomId  = socket.project._id.toString()
    socket.join(socket.roomId);
    socket.on('project-message',async(data)=>{
        const user = await userModel.findById(data.sender)
        console.log(user);
        socket.broadcast.to(socket.roomId).emit('project-message',{message:data.message,email:user.email});
    })
})
server.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})

 