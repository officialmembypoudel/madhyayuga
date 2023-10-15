import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useThemeMode } from "@rneui/themed";
import React, { createContext, useEffect, useState } from "react";
import { account } from "../configs/appwrite";
import { client } from "../configs/axios";
import axios from "axios";

export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  //   const { navigate } = useNavigation();
  const { setMode } = useThemeMode();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authCheck, setAuthCheck] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await client.get("/profile");
        console.log(response.data.user);
        setUser(response.data.user);
        if (response.data.user) {
          setLoading(false);
          setIsSignedIn(true);
        }
      } catch (error) {
        console.log(error.response.data);
        setUser({});
        setLoading(false);
        setIsSignedIn(false);
      }
    };
    getUser();
  }, [authCheck]);

  const login = async (email = "", password = "") => {
    try {
      const response = await client.post(
        "/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.user) {
        setIsSignedIn(true);
        setUser(response.data.user);
      }
    } catch (error) {
      console.log(error.response.data);
      setIsSignedIn(false);
      setUser({});
    }
  };

  const logOut = async () => {
    try {
      const response = await client.get("/logout");
      console.log(response.data);
      if (response.data) {
        setUser({});
        setLoading(false);
        setIsSignedIn(false);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    const checkIfMOdeExist = async () => {
      try {
        const value = await AsyncStorage.getItem("@mode");
        if (value) {
          console.log(value, "mode from auth context, checking");
          setMode(value);
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkIfMOdeExist();
  }, []);

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          loading,
          setUser,
          login,
          logOut,
          isSignedIn,
          setIsSignedIn,
          setAuthCheck,
          refreshing,
          setRefreshing,
          error,
          setError,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
