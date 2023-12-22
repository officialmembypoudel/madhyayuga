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
  const [receiver, setReceiver] = useState("");

  useEffect(() => {
    setSender(chats.members.filter((member) => member._id !== user._id)[0]);
  }, [chats]);
  console.log("chats", onlineUsers);
  useEffect(() => {
    const otherUser = chats?.members.filter(
      (member) => member._id !== user._id
    )[0];

    let isUserOnline = onlineUsers?.some((u) => u.user === otherUser?._id);

    setIsReceiverOnline(isUserOnline);
    setReceiver(otherUser);
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
        <View style={{ ...flexDirection }}>
          {chats?.listing?.images ? (
            <Avatar
              size={"large"}
              rounded
              icon={{
                name: "person-circle",
                type: "ionicon",
                color: style.theme.colors.warning,
                size: 60,
              }}
              source={{ uri: setImageQuality(chats.listing.images[0].url, 30) }}
              containerStyle={{
                padding: 0,
                width: 55,
                height: 60,
                borderRadius: 30,
                marginRight: 10,
              }}
              iconStyle={{
                alignSelf: "center",
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
                    marginBottom: 40,
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
