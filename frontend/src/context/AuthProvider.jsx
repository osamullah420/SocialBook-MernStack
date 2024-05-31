import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
    loading: true,
  });

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parsedData = JSON.parse(data);
      setAuth({
        user: parsedData.user,
        token: parsedData.token,
        loading: false,
      });
      axios.defaults.headers.common["Authorization"] = parsedData.token;
    } else {
      setAuth({ user: null, token: "", loading: false });
    }
  }, []);

  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common["Authorization"] = auth.token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
