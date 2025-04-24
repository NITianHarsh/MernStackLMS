import axiosInstance from "@/axiosInstance";
import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });
  const navigate = useNavigate();

  async function handleRegisterUser(e) {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/auth/register", {
        ...signUpFormData,
        role: "user",
      });

      console.log("data is ---> ", data);

      if (!data.success) {
        alert("User registration failed!");
        console.log("error data is ", data);
      } else {
        alert("Registration successful!");
      }

      setSignUpFormData(initialSignUpFormData);
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration. Please try again.");
      setSignUpFormData(initialSignUpFormData);
    }
  }

  async function handleLoginUser(e) {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/auth/login", signInFormData);
      console.log("Login data is ---> ", data);

      if (data?.success) {
        setAuth({ isAuthenticated: true, user: data.data.user });

        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data?.accessToken || "")
        );

        // Optional: Show toast or alert
        alert("User logged in successfully!");
      } else {
        setAuth({ isAuthenticated: false, user: null });
        alert("User login failed!");
        console.log("Login failure data:", data);
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuth({ isAuthenticated: false, user: null });
      alert("An error occurred during login. Please try again.");
    }
  }

  async function checkAuthUser() {
    try {
      const { data } = await axiosInstance.get("/auth/check-auth");
      if (data.success) {
        setAuth({
          isAuthenticated: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          isAuthenticated: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        setAuth({
          isAuthenticated: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }
  function resetCredentials() {
    setAuth({
      isAuthenticated: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  // passing down the state and setState functions to the context
  return (
    <AuthContext.Provider
      value={{
        auth,
        signInFormData,
        signUpFormData,
        setSignInFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
