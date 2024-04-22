import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { containerStyles } from "../helpers/objects";
import {
  makeStyles,
  Text,
  Button,
  useThemeMode,
  useTheme,
  SearchBar,
  Icon,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ModeToogleComponent from "./ModeToogleComponent";
import { defaultFont } from "../fontConfig/defaultFont";

const ScreenHeaderComponent = ({
  title,
  hideModeToggle,
  iconButton,
  backAction,
}) => {
  const style = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();

  const handleOnPress = (state) => {
    setIsDark(state);
    // console.log(state);
    setMode(state ? "dark" : "light");
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <TouchableOpacity
        onPress={backAction ? backAction : () => navigation.goBack()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          // marginBottom: 20,
        }}
      >
        <Icon name="chevron-back-outline" type="ionicon" size={25} />
        <Text
          h4
          h4Style={{
            fontFamily: `${defaultFont}_600SemiBold`,
            fontWeight: "600",
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
      {!hideModeToggle && <ModeToogleComponent />}
      {iconButton && <>{iconButton}</>}
    </View>
  );
};

export default ScreenHeaderComponent;

const styles = StyleSheet.create({});
