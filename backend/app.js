import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js' 
import cors from 'cors'
import projectRoutes from './routes/project.routes.js'
import aiRoutes from './routes/ai.routes.js'


const app = express(); 
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(cors());
app.use('/users',userRoutes);
app.use('/project',projectRoutes);
app.use('/ai',aiRoutes);
app.get('/',(req,res)=>{
   res.send('Hello World');
})

export default app; 
