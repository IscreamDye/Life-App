import axios from 'axios';
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({})

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        console.log("Fetched user:", data);
        setUser(data);
      });
    }

    // ✅ DEBUG TOKEN CHECK
    fetch("https://life-app-o6wa.onrender.com/debug-token", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("DEBUG RESPONSE:", data);
      })
      .catch((err) => {
        console.error("DEBUG ERROR:", err);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
