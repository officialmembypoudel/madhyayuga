import { Pressable, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
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
  Chip,
} from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import { defaultFont } from "../fontConfig/defaultFont";
import {
  getCategoryName,
  setImageQuality,
  textTrimmer,
} from "../helpers/functions";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getAllCategories } from "../store/listings";

export default function ItemComponent({ type, item, zindex }) {
  const { theme } = useTheme();
  const { mode } = useThemeMode();
  const navigation = useNavigation();
  const categories = useSelector(getAllCategories);

  const pressed = () => navigation.navigate("Item", { item });
  return (
    <TouchableOpacity
      onPress={pressed}
      style={{
        elevation: 1,
        backgroundColor: "rgba(0,0,0,0)",
        borderRadius: 12,
        // width: "100%",
        marginLeft: type === "column" ? "1%" : 0,
        marginRight: type === "row" ? 10 : 0,
        marginBottom: type === "column" ? 5 : 5,
        padding: 1,
        height: type === "column" ? "auto" : "auto",
        zIndex: zindex,
      }}
      activeOpacity={0.7}
    >
      <Card
        containerStyle={{
          margin: 0,
          marginBottom: 0,
          padding: 10,
          backgroundColor:
            mode === "dark" ? theme.colors.grey4 : theme.colors.background,
          borderWidth: 0,
          borderRadius: 10,
          width: type === "row" ? 190 : "100%",
          elevation: 0,
        }}
        wrapperStyle={{
          display: "flex",
          flexDirection: type === "column" ? "row" : "column",
          gap: type === "column" ? 5 : 20,
          padding: 0,
          alignItems: type === "column" ? "center" : "flex-start",
        }}
      >
        {item?.images ? (
          <Avatar
            title={item?.name}
            source={{ uri: setImageQuality(item?.images[0]?.url, 35) }}
            imageProps={{ borderRadius: 5 }}
            containerStyle={{
              width: 172,
              height: 138,
              borderRadius: 5,
              backgroundColor: theme.colors.grey3,
            }}
          />
        ) : (
          <Avatar
            title={item?.name}
            imageProps={{ borderRadius: 5 }}
            containerStyle={{
              width: 172,
              height: 138,
              borderRadius: 5,
              backgroundColor: theme.colors.grey3,
            }}
          />
        )}
        <View
          style={{
            marginLeft: type === "column" ? "auto" : 0,
            width: type === "column" ? "45%" : 170,
            // backgroundColor: "red",
          }}
        >
          {/* <View
            style={{ alignSelf: "flex-start", marginTop: 5, marginBottom: 5 }}
          >
            <Chip
              title="Hot"
              type="solid"
              color={theme.colors.error}
              icon={
                <Icon
                  name="fire"
                  type="material-community"
                  color={theme.colors.white}
                />
              }
              onPress={pressed}
              radius={10}
              titleStyle={{
                fontFamily: `${defaultFont}_400Regular`,
              }}
            />
          </View> */}
          <Text
            style={{
              color: theme.colors.grey0,
              marginTop: 0,
              textAlign: "left",
              fontSize: 15,
              marginBottom: 2,
              fontFamily: `${defaultFont}_400Regular`,
            }}
          >
            {`${getCategoryName(categories, item?.categoryId)}`}
          </Text>
          {type === "row" && <Card.Divider style={{ marginBottom: 2 }} />}
          <Text
            style={{
              color: theme.colors.grey0,
              marginTop: 0,
              textAlign: "left",
              fontSize: 16,
              fontFamily: `${defaultFont}_500Medium`,
              fontWeight: "500",
            }}
          >
            {item?.name}
          </Text>
          <Text
            style={{
              color: theme.colors.grey0,
              marginTop: 0,
              textAlign: "left",
              fontSize: 13,
              marginBottom: 2,
              fontFamily: `${defaultFont}_300Light`,
            }}
          >
            {item?.location}
          </Text>
          <Text
            style={{
              color: theme.colors.grey0,
              marginTop: 0,
              textAlign: "left",
              fontSize: 15,
              marginBottom: 2,
              fontFamily: `${defaultFont}_400Regular`,
            }}
          >
            {item.condition}
          </Text>
          <Text
            style={{
              color: theme.colors.grey0,
              marginTop: 0,
              textAlign: "left",
              fontSize: 16,
              fontFamily: `${defaultFont}_500Medium`,
              fontWeight: "500",
            }}
          >
            For: {item?.with}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
    // </View>
  );
}

const styles = StyleSheet.create({});
