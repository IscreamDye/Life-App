import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./userContext";
import axios from "axios";
import './NavBar.css';

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="navbar">
      {!user && (
        <div className="right-section">
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      )}

      {user && (
        <div className="right-section">
          <span className="userName">Hi, {user.username}</span>
         
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
