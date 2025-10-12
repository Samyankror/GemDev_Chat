import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js' 
// import cors from 'cors'
import projectRoutes from './routes/project.routes.js'
import aiRoutes from './routes/ai.routes.js'


const app = express(); 
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
// app.use(cors({
//   origin: true,        
//   credentials: true    
// }));
app.use('/api/user',userRoutes);
app.use('/api/project',projectRoutes);
app.use('/ai',aiRoutes);


app.use((err, req, res,next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message
  });
});


export default app; 
