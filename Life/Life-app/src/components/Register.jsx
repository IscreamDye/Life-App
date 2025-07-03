import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); {/*  --------------------  prevents page from refreshing */}
    const { username, email, password } = formData;

    try {
      const { data } = await axios.post('/register', { username, email, password });
      {/* --------------------  runs code and only returns error that can occure inside registeruser on server */}
      if (data.error) {
        toast.error(data.error);
      } else {
        setFormData({ username: '', email: '', password: '' });
        toast.success("Registered successfully!");
        navigate('/login');
      }
    } catch (error) {
      {/* --------------------  this runs if something is wrong with server, is server even on? do you have internet? */}
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
