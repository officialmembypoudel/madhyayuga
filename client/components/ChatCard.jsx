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
import React from "react";
import { flexDirection } from "../helpers/objects";
import { textTrimmer } from "../helpers/functions";
import { defaultFont } from "../fontConfig/defaultFont";

const ChatCard = ({ chats }) => {
  const style = useTheme();
  const { mode } = useThemeMode();
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
          <Avatar
            size={"large"}
            icon={{
              name: "person-circle",
              type: "ionicon",
              color: style.theme.colors.warning,
              size: 60,
            }}
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
          />
          <View>
            <Card.Title
              style={{
                textAlign: "left",
                fontFamily: `${defaultFont}_500Medium`,
                fontWeight: "500",
              }}
            >
              {chats.sender}
            </Card.Title>
            <Text
              style={{ width: 300, fontFamily: `${defaultFont}_400Regular` }}
            >
              {textTrimmer(chats.message, 36)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default ChatCard;

const styles = StyleSheet.create({});
