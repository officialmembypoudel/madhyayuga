"use client";
import client from "@/config";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const Authentication = createContext();

const AuthContext = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (email, password, redirectUrl) => {
    try {
      setAuthLoading(true);
      const res = await client.post("/login", { email, password });
      setUser(res.data?.user);
      res.data && setAuthLoading(false);
      res.data && router.push(redirectUrl || "/");
      console.warn(res.data);
      setCookie("token", res.data?.token);
      setCookie("user", res.data?.user);
    } catch (error) {
      setAuthError(error?.response?.data?.message);
      setAuthLoading(false);
      router.push("/auth");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        setAuthLoading(true);
        const res = await client.get("/profile");
        setUser(res.data?.user);
        res.data && setAuthLoading(false);
      } catch (error) {
        setAuthError(error?.response?.data?.message);
        setAuthLoading(false);
      }
    };
    getUser();
  }, []);

  const logout = async () => {
    try {
      setAuthLoading(true);
      const res = await client.get("/logout");
      res.data && setUser(null);
      res.data && setAuthLoading(false);
      res.data && router.push("/auth");
      res.data && setCookie("token", "");
      res.data && setCookie("user", "");
    } catch (error) {
      setAuthError(error?.response?.data?.message);
      setAuthLoading(false);
    }
  };

  return (
    <Authentication.Provider
      value={{ authLoading, authError, user, login, logout }}
    >
      {children}
    </Authentication.Provider>
  );
};

export default AuthContext;

export const useAuth = () => {
  const { authLoading, authError, user, login, logout } =
    useContext(Authentication);

  return { authLoading, authError, user, login, logout };
};
