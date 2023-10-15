import { StyleSheet, View, Image } from "react-native";
import React, { useState } from "react";
import { containerStyles } from "../helpers/objects";
import { Text, Button, useThemeMode, useTheme, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";

const MyListings = () => {
  const style = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent title="My Listings" />
    </View>
  );
};

export default MyListings;

const styles = StyleSheet.create({});
