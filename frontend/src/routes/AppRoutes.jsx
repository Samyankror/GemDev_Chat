import { BrowserRouter, Routes,Route } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from '../pages/Home.jsx'
import { UserProvider } from "../context/User.Context.jsx";

function AppRoutes(){
     return (
      <UserProvider>
        <BrowserRouter>
             <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
             </Routes>
        </BrowserRouter>
        </UserProvider>
     )
}


export default AppRoutes;