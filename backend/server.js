import http from 'http';
import app from './app.js';
import dotenv from 'dotenv'; 
import connect  from  './db/db.js';

dotenv.config();

connect();

const server = http.createServer(app);

server.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})

 