import { StyleSheet, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { containerStyles } from "../helpers/objects";
import { Text, Button, useThemeMode, useTheme, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import ProfileMiniCard from "../components/ProfileMiniCard";
import { client } from "../configs/axios";
import UserDetailsTab from "../components/UserDetailsTab";

const UserDetailsScreen = ({ route }) => {
  const style = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const { user, backScreen, item } = route.params;
  const [loading, setLoading] = useState(false);

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent
        title={user?.name}
        hideModeToggle={true}
        backAction={() => navigation.navigate(backScreen, { item })}
      />
      <View style={{ width: "100%" }}>
        <ProfileMiniCard user={user} hideAccessory hideCredit />
      </View>
      <UserDetailsTab user={user} />
    </View>
  );
};

export default UserDetailsScreen;

const styles = StyleSheet.create({});
