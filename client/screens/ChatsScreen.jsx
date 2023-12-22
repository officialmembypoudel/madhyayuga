import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import { ChatContext } from "../context/chatContext";

const ChatsScreen = () => {
  const style = useTheme();
  const { chatRooms, getChatRooms, onlineUsers } = useContext(ChatContext);
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();

  useEffect(() => {
    getChatRooms();
  }, [onlineUsers]);

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent title="Chats" />
      {chatRooms?.length > 0 ? (
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={{ padding: 2 }}
          data={chatRooms}
          keyExtractor={(item) => Date.now()}
          renderItem={({ item }) => (
            <View key={item?._id} style={{ width: "100%", marginBottom: 15 }}>
              <ChatCard chats={item} />
            </View>
          )}
        />
      ) : null}
    </View>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
