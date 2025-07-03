import { Routes, Route } from "react-router-dom";
import Login from './components/Login.jsx'; 
import Navbar from "./components/Navbar.jsx";
import Register from "./components/Register.jsx";
import axios from "axios";
import { Toaster } from 'react-hot-toast';
import { UserContextProvider, UserContext } from "./components/userContext.jsx";
import Dashboard from "./components/Dashboard.jsx";
import HomePage from "./HomePage.js"; // your actual homepage
import { useContext } from "react";

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

// Component that uses context to conditionally show Navbar + HomePage
function ProtectedLayout() {
  const { user } = useContext(UserContext);

  return (
    <>
      {!!user && <Navbar />}
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        {!!user && <Route path="/" element={<HomePage />} />}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {!!user && <Route path="/dashboard" element={<Dashboard />} />}
        {/*  redirect to login if not authenticated */}
        {!user && <Route path="*" element={<Login />} />}
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserContextProvider>
      <ProtectedLayout />
    </UserContextProvider>
  );
}

export default App;
