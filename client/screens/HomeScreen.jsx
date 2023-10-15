import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import HomeComponent from "../components/HomeComponent";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabs from "../navigator/BottomTabs";
import { AuthContext } from "../context/authContext";
import UnAuthStack from "../navigator/StackNavigator";

const HomeScreen = () => {
  const { isSignedIn } = useContext(AuthContext);

  return <>{isSignedIn ? <BottomTabs /> : <UnAuthStack />}</>;
};

export default HomeScreen;

const styles = StyleSheet.create({});
