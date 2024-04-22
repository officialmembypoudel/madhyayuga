import {
  makeStyles,
  Text,
  Button,
  useThemeMode,
  useTheme,
  SearchBar,
  Icon,
  Card,
  Avatar,
} from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import homeIcon from "../assets/madhyaYugTransparent.png";
import { defaultFont } from "../fontConfig/defaultFont";
import { useDispatch } from "react-redux";

const CategoryCard = ({ category }) => {
  const style = useTheme();
  const { mode, setMode } = useThemeMode();

  return (
    <View>
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
          width: 105,
          elevation: 0,
        }}
        wrapperStyle={{
          alignItems: "center",
          //   backgroundColor: "red",
          justifyContent: "space-between",
        }}
      >
        <Avatar
          icon={{
            name: category.icon,
            type: category.iconFamily,
            color: category.color,
          }}
          size="medium"
          rounded
          //   onPress={() => {
          //     console.log("hello world");
          //   }}
          containerStyle={{
            backgroundColor:
              mode === "light" ? "#edeae1" : "rgba(245, 241, 237,0.9)",
            padding: 2,
            elevation: 2,
            marginRight: 10,
            marginHorizontal: 10,
          }}
          avatarStyle={{
            resizeMode: "contain",
            // backgroundColor: "red",
          }}
        />
        <Text
          style={{
            fontSize: 12,
            fontFamily: `${defaultFont}_500Medium`,
            marginTop: 3,
          }}
        >
          {category.name}
        </Text>
      </Card>
    </View>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({});
