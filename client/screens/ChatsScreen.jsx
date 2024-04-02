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

  useEffect(() => {
    getChatRooms();
  }, []);

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent title="Chats" />

      <FlatList
        style={{ width: "100%" }}
        contentContainerStyle={{ padding: 2 }}
        data={chatRooms}
        keyExtractor={(item) => item?._id}
        renderItem={({ item }) => (
          <View key={item?._id} style={{ width: "100%", marginBottom: 15 }}>
            <ChatCard chats={item} />
          </View>
        )}
      />
    </View>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
