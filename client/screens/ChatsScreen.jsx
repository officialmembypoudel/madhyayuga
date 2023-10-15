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
import ModeToogleComponent from "../components/ModeToogleComponent";
import ChatCard from "../components/ChatCard";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
const chats = [
  {
    id: 1,
    sender: "Memby Poudel",
    message: "Hi I was interested in your product!",
  },
  {
    id: 2,
    sender: "Saral Dahal",
    message: "I have a great mattress to exchange with your sari",
  },
  {
    id: 3,
    sender: "Saroj Raut",
    message: "मलाई सार्है मन् पर्यो लयाप्टप। साटाै!",
  },
];
const ChatsScreen = () => {
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
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent title="Chats" />
      {chats.map((chat) => (
        <View key={chat.id} style={{ width: "100%", marginBottom: 15 }}>
          <ChatCard chats={chat} />
        </View>
      ))}
    </View>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
