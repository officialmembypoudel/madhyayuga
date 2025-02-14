import {
  makeStyles,
  Text,
  Button,
  useThemeMode,
  useTheme,
  SearchBar,
  //   Icon,
  Card,
  Avatar,
  Icon,
} from "@rneui/themed";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { flexDirection } from "../helpers/objects";
import { setImageQuality, textTrimmer } from "../helpers/functions";
import { defaultFont } from "../fontConfig/defaultFont";
import { AuthContext } from "../context/authContext";
import { client } from "../configs/axios";
import { useNavigation } from "@react-navigation/native";
import { ChatContext } from "../context/chatContext";

const ChatCard = ({ chats }) => {
  const style = useTheme();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { onlineUsers } = useContext(ChatContext);
  const { mode } = useThemeMode();
  const [sender, setSender] = useState("");
  const [isReceiverOnline, setIsReceiverOnline] = useState(false);

  useEffect(() => {
    setSender(chats?.members.filter((member) => member._id !== user?._id)[0]);
  }, [chats]);

  useEffect(() => {
    const otherUser = chats?.members.filter(
      (member) => member._id !== user._id
    )[0];

    const isUserOnline = onlineUsers?.some((u) => u.user === otherUser?._id);

    setIsReceiverOnline(isUserOnline);
  }, [chats, onlineUsers?.length]);

  return (
    <TouchableOpacity
      style={{
        width: "100%",
        elevation: 3,
        backgroundColor:
          mode === "dark"
            ? style.theme.colors.grey4
            : style.theme.colors.background,
        borderRadius: 10,
      }}
      onPress={() =>
        navigation.navigate("Messages", { chat: { ...chats, sender } })
      }
    >
      <Card
        containerStyle={{
          margin: 0,
          //   marginBottom: 10,
          padding: 10,
          backgroundColor:
            mode === "dark"
              ? style.theme.colors.grey4
              : style.theme.colors.background,
          borderWidth: 0,
          borderRadius: 10,
          width: "100%",
          elevation: 0,
        }}
        wrapperStyle={{
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View style={{ ...flexDirection, gap: 10 }}>
          {chats?.listing?.images ? (
            <Avatar
              size={"large"}
              rounded
              source={{ uri: setImageQuality(chats.listing.images[0].url, 30) }}
              containerStyle={{
                elevation: 0,
                shadowOpacity: 0,
                shadowOffset: 0,
                borderWidth: 1.7,
                borderColor: style.theme.colors.primary,
              }}
            >
              {isReceiverOnline ? (
                <Avatar.Accessory
                  style={{
                    elevation: 0,
                    shadowOpacity: 0,
                    shadowOffset: 0,
                    width: 15,
                    height: 15,
                    borderRadius: 30,
                    backgroundColor: "transparent",
                    marginRight: 5.5,
                  }}
                  iconStyle={{
                    color: "limegreen",
                  }}
                  iconProps={{ name: "lens", size: 15 }}
                />
              ) : null}
            </Avatar>
          ) : null}
          <View>
            <Text
              style={{
                width: 300,
                fontFamily: `${defaultFont}_600SemiBold`,
                paddingVertical: 2,
              }}
            >
              {sender?.name}
            </Text>
            <Text
              style={{
                textAlign: "left",
                fontFamily: `${defaultFont}_500Medium`,
                fontWeight: "500",
                paddingVertical: 3,
              }}
            >
              {chats?.listing?.name}
            </Text>

            <Text
              style={{ width: 300, fontFamily: `${defaultFont}_400Regular` }}
            >
              {chats?.lastMessage}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default ChatCard;

const styles = StyleSheet.create({});
