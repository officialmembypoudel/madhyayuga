import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeMode } from "@rneui/themed";
import { client } from "../configs/axios";
import { useNotification } from "./Notification";

export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  //   const { navigate } = useNavigation();
  const { setMode } = useThemeMode();
  const [user, setUser] = useState({});
  const { expoPushToken } = useNotification();
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authCheck, setAuthCheck] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState({});
  const [loadLogin, setLoadLogin] = useState(false);
  const [loginMessage, setLoginMessage] = useState(null);

  useEffect(() => {
    getUser();
  }, [authCheck]);
  const getUser = async () => {
    try {
      const response = await client.get("/profile");
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

  const login = async (email = "", password = "") => {
    try {
      setLoadLogin(true);
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
      if (response.data) {
        setIsSignedIn(true);
        setLoadLogin(false);
        setUser(response.data.user);
        // setLoginMessage("Login Successful");
        if (expoPushToken) {
          const { user } = await sendDevicePushTokenToServer(expoPushToken);
          if (user) {
            setUser(user);
          }
        }
      }
    } catch (error) {
      console.log(error.response.data);
      setIsSignedIn(false);
      setLoadLogin(false);
      setUser({});
      setLoginMessage(error?.response?.data?.message);
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
      console.log(response.data);
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

  const sendDevicePushTokenToServer = async () => {
    const response = await client.patch(
      "/users/me/add-push-token",
      {
        token: expoPushToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { user, error } = response.data;

    return { user, error };
  };

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
          loadLogin,
          loginMessage,
          setLoginMessage,
          getUser,
          sendDevicePushTokenToServer,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
