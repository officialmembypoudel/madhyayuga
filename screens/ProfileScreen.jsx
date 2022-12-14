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
  Card,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import ProfileMiniCard from "../components/ProfileMiniCard";
import ProfileItemsCards from "../components/ProfileItemsCards";

const ProfileScreen = () => {
  const style = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();

  const onSettingsPress = () => {
    console.log("pressed and worked");
  };

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor:
          mode === "light" ? "#ffff" : style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent
        title="Profile"
        hideModeToggle={false}
        iconButton={
          <Icon
            name="settings"
            type="anddesign"
            onPress={onSettingsPress}
            iconStyle={{
              backgroundColor: style.theme.colors.grey5,
              borderRadius: 14,
              padding: 1,
              // elevation: 100,
            }}
            // raised
          />
        }
      />
      <View style={{ width: "100%", marginBottom: 30 }}>
        <ProfileMiniCard rating={4} />
      </View>
      <ProfileItemsCards
        iconBackgroundColor={style.theme.colors.primary}
        iconColor={style.theme.colors.disabled}
        icon="account-details"
        iconType="material-community"
        title="My Account details"
      />
      <ProfileItemsCards
        iconBackgroundColor={style.theme.colors.success}
        iconColor={style.theme.colors.disabled}
        icon="format-list-bulleted-square"
        iconType="material-community"
        title="My Listings"
      />
      <ProfileItemsCards
        iconBackgroundColor={style.theme.colors.warning}
        iconColor={style.theme.colors.disabled}
        title="Saved Listings"
        icon="bookmark-box-multiple"
        iconType="material-community"
      />
      <ProfileItemsCards
        iconBackgroundColor={style.theme.colors.error}
        iconColor={style.theme.colors.disabled}
        icon="privacy-tip"
        iconType="material"
        title="Terms and Conditions"
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
