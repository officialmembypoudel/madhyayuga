import { StyleSheet, View } from "react-native";
import React, { useContext, useEffect } from "react";
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
  //   AirbnbRating,
} from "@rneui/themed";
import profileImg from "../assets/profile.png";
import { defaultFont } from "../fontConfig/defaultFont";
import { AuthContext } from "../context/authContext";
import UserRating from "./UserRating";
import { useNavigation } from "@react-navigation/native";

const array = [1, 2, 3, 4, 5];

const ProfileMiniCard = ({ rating, user, hideAccessory, hideCredit }) => {
  const style = useTheme();
  const { mode, setMode } = useThemeMode();
  const navigation = useNavigation();

  return (
    <View>
      <Avatar
        onPress={() =>
          navigation.navigate("UserDetails", {
            user: user,
            backScreen: "Profile",
          })
        }
        size={"xlarge"}
        source={user?.avatar?.url ? { uri: user.avatar.url } : null}
        rounded
        containerStyle={{
          alignSelf: "center",
          elevation: 0,
          borderRadius: 80,
          borderWidth: 1,
          borderColor: style.theme.colors.primary,
          padding: 0,
        }}
        imageProps={{
          style: {
            width: "100%",
            margin: 0,
            padding: 0,
          },
        }}
      >
        {!hideAccessory && (
          <Avatar.Accessory
            size={30}
            color={"rgb(245, 241, 237)"}
            iconProps={{
              name: "edit",
            }}
            style={{
              marginBottom: 15,
              backgroundColor: style.theme.colors.primary,
              marginRight: 2,
            }}
            onPress={() =>
              navigation.navigate("AddProfilePhoto", { header: true })
            }
          />
        )}
      </Avatar>
      <Text
        // h4
        style={{
          fontSize: 25,
          textAlign: "center",
          marginVertical: 10,
          fontFamily: `${defaultFont}_700Bold`,
          // fontWeight: "700",
        }}
      >
        {user.name}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <UserRating total={user?.totalRating} rating={user.rating} />
      </View>

      {!hideCredit && (
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Chip
            title={`${user?.credit ?? 0} Credits`}
            color={style.theme.colors.error}
            type="solid"
            radius={10}
            icon={
              <Icon
                name="cash-outline"
                type="ionicon"
                color={"rgb(245, 241, 237)"}
              />
            }
            titleStyle={{
              fontFamily: `${defaultFont}_400Regular`,
            }}
          />
        </View>
      )}
    </View>
  );
};

export default ProfileMiniCard;

const styles = StyleSheet.create({});
