import { toast } from "react-toastify";
import axiosInstance from "@/axiosInstance";
import { Skeleton } from "@/components/ui/skeleton";
import { createContext, useEffect, useState } from "react";
import { initialSignInFormData, initialSignUpFormData } from "@/config";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });
  async function handleRegisterUser(e) {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/auth/register", {
        ...signUpFormData,
      });
      if (!data.success) {
        toast.error("User Registration failed!");
        console.log("error data is ", data);
      } else {
        toast.success("User Registered and Welcome email sent successfully!");
      }

      setSignUpFormData(initialSignUpFormData);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration. Please try again.");
      setSignUpFormData(initialSignUpFormData);
    }
  }

  async function handleLoginUser(e) {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/auth/login", signInFormData);
      if (data?.success) {
        setAuth({ isAuthenticated: true, user: data.data.user });

        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data?.accessToken || "")
        );

        // Optional: Show toast or alert
        toast.success("User logged in successfully!");
      } else {
        setAuth({ isAuthenticated: false, user: null });
        toast.error("User login failed!");
        console.log("Login failure data:", data);
      }
      setSignInFormData(initialSignInFormData);
    } catch (error) {
      console.error("Login error:", error);
      setAuth({ isAuthenticated: false, user: null });
      toast.error("An error occurred during login. Please try again.");
      setSignInFormData(initialSignInFormData);
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
        setAuth,

        signInFormData,
        setSignInFormData,

        signUpFormData,
        setSignUpFormData,

        handleLoginUser,
        handleRegisterUser,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
