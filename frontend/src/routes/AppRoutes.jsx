import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import Project from "../pages/Project.jsx";
import UserAuth from "../auth/UserAuth.jsx";
import { store } from "../redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "../redux/store.js";
import Profile from "../pages/Profile.jsx";

function AppRoutes() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<UserAuth />}>
              <Route path="/" element={<Home />} />
              <Route path="/project" element={<Project />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default AppRoutes;
