import http from 'http';
import app from './app.js';
import dotenv from 'dotenv'; 
import connect  from  './db/db.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'


dotenv.config();

connect();

const server = http.createServer(app);
const io = new Server(server,{
    cors : {
        origin: '*'
    }
})

io.use((socket,next)=>{
    try{
      const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
      if(!token){
        next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    }catch(error){
        next(error);
    }
})

io.on('connection',socket=>{
    console.log('a user connected');
})
server.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})

 