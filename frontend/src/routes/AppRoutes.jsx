import { BrowserRouter, Routes,Route } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from '../pages/Home.jsx'
import Project from "../pages/Project.jsx";
import { UserProvider } from "../context/User.Context.jsx";
import UserAuth from "../auth/UserAuth.jsx";

function AppRoutes(){
     return (
      <UserProvider>
        <BrowserRouter>
             <Routes>
                <Route path='/' element={<UserAuth><Home /></UserAuth>} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/project' element={<UserAuth><Project /></UserAuth>} />
             </Routes>
        </BrowserRouter>
        </UserProvider>
     )
}


export default AppRoutes;