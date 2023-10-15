import { Alert, StyleSheet, Text, ToastAndroid, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import ToggleButton from "react-native-toggle-element";
import { Icon } from "@rneui/base";
import { useTheme, useThemeMode } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Toast = ({ visible, message }) => {
  if (visible) {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
    return null;
  }
  return null;
};

const ModeToogleComponent = () => {
  // const styles = useStyles();

  const theme = useTheme();
  const { setMode, mode } = useThemeMode();
  const [isDark, setIsDark] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    visible: false,
    message: "",
  });

  useEffect(() => {
    async function fetchMode() {
      try {
        const modeJson = await AsyncStorage.getItem("@uiMode");
        const value = JSON.parse(modeJson);
        setMode(value.mode);
        setIsDark(value.mode === "dark" ? true : false);
        setToastMessage({
          visible: false,
        });
      } catch (e) {
        // console.log(e);
        console.log(e);
        setToastMessage({
          visible: mode === "dark" ? true : false,
          message: `Can't get previously used theme`,
        });
      }
    }
    fetchMode();
  }, [mode, isDark]);

  const handleOnPress = async (state) => {
    setIsDark(state);
    setMode(state ? "dark" : "light");

    try {
      await AsyncStorage.setItem(
        "@uiMode",
        JSON.stringify({ mode: state ? "dark" : "light" })
      );
    } catch (e) {
      console.log(e);
      setToastMessage({
        visible: true,
        message: e.message,
      });
    }
  };
  return (
    <View>
      <ToggleButton
        value={isDark}
        onPress={(newState) => {
          handleOnPress(newState);
          setIsDark(newState);
        }}
        thumbActiveComponent={
          <Icon
            name="moon"
            type="ionicon"
            size={15}
            color={theme.theme.colors.grey5}
          />
        }
        thumbInActiveComponent={
          <Icon
            name="sunny"
            type="ionicon"
            size={15}
            color={theme.theme.colors.white}
          />
        }
        thumbButton={{
          activeBackgroundColor: theme.theme.colors.grey0,
          radius: 30,
          inActiveBackgroundColor: theme.theme.colors.grey0,
          width: 25,
          height: 25,
        }}
        trackBar={{
          activeBackgroundColor: theme.theme.colors.grey3,
          inActiveBackgroundColor: theme.theme.colors.white,
          borderActiveColor: theme.theme.colors.grey4,
          borderInActiveColor: theme.theme.colors.grey4,
          borderWidth: 1,
          width: 35,
          height: 30,
        }}
      />
      <Toast visible={toastMessage.visible} message={toastMessage.message} />
    </View>
  );
};

export default ModeToogleComponent;

const styles = StyleSheet.create({});
