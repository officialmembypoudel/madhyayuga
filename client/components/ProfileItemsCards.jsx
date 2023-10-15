import { StyleSheet, View } from "react-native";
import React from "react";
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
  Chip,
} from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import { defaultFont } from "../fontConfig/defaultFont";

const ProfileItemsCards = ({
  icon,
  iconType,
  iconBackgroundColor,
  iconColor,
  title,
  onPress,
}) => {
  const style = useTheme();
  const { mode, setMode } = useThemeMode();
  return (
    <TouchableOpacity
      style={{
        width: "100%",
        elevation: 3,
        borderRadius: 10,
        backgroundColor: style.theme.colors.error,
        marginBottom: 20,
      }}
      activeOpacity={0.95}
      onPress={onPress ? onPress : () => {}}
    >
      <Card
        containerStyle={{
          padding: 10,
          backgroundColor:
            mode === "dark" ? style.theme.colors.grey4 : "#FAFAFF",
          borderWidth: 0,
          borderRadius: 10,
          width: "100%",
          //   height: 70,
          elevation: 0,
          //   padding: 0,
          margin: 0,
        }}
        wrapperStyle={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Avatar
          // rounded
          size="medium"
          icon={{
            name: icon,
            type: iconType,
            color: mode === "light" ? iconColor : iconBackgroundColor,
            size: 30,
          }}
          containerStyle={
            {
              // backgroundColor: mode === "light" ? iconBackgroundColor : "red",
              // padding: 5,
              // borderRadius: 30,
            }
          }
          iconStyle={{
            backgroundColor:
              mode === "light" ? iconBackgroundColor : style.theme.colors.grey0,
            padding: 10,
            borderRadius: 30,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            // fontWeight: "800",
            fontFamily: `${defaultFont}_600SemiBold`,
            marginRight: "auto",
            marginLeft: 10,
          }}
        >
          {title}
        </Text>
        <Avatar
          rounded
          size="medium"
          icon={{
            name: "md-chevron-forward",
            type: "ionicon",
            color: style.theme.colors.black,
            size: 25,
          }}
        />
      </Card>
    </TouchableOpacity>
  );
};

export default ProfileItemsCards;

const styles = StyleSheet.create({});
