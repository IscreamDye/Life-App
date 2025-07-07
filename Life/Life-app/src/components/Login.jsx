import React, { useState, useContext } from 'react';
import './Login.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from './userContext'; // ✅ import context

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // ✅ access context
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const { data } = await axios.post('/login', { email, password });
{/* --------------------  runs code and only returns error that can occure inside login on server */}
      if (data.error) {
        toast.error(data.error);
      } else {
        setFormData({ email: '', password: '' });

        // ✅ set user context directly so navbar + homepage update
        setUser(data);

        // ✅ redirect to homepage or dashboard
        setTimeout(() => {
        navigate('/');
      }, 500);
      }{/* --------------------  this runs if something is wrong with server, is server even on? do you have internet? */}
    } catch (error) {
      console.log(error);
      toast.error('Login failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Login</button>
        <p>Don't have account yet? <Link to="/register">Register</Link></p> 
        
      </form>
    </div>
  );
};

export default Login;
