import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import { containerStyles } from "../helpers/objects";
import {
  makeStyles,
  Text,
  Button,
  useThemeMode,
  useTheme,
  SearchBar,
  Icon,
  Card,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import ProfileMiniCard from "../components/ProfileMiniCard";
import ProfileItemsCards from "../components/ProfileItemsCards";
import { defaultFont } from "../fontConfig/defaultFont";
import { AuthContext } from "../context/authContext";

const ProfileScreen = () => {
  const style = useTheme();
  const { logOut, user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();

  const onSettingsPress = () => {
    console.log("pressed and worked");
  };

  return (
    <View
      style={{
        backgroundColor:
          mode === "light" ? "#ffff" : style.theme.colors.background,
        // height: "100%",
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 55,
      }}
    >
      <ScreenHeaderComponent title="Profile" hideModeToggle={false} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", marginBottom: 30 }}>
          <ProfileMiniCard user={user} />
        </View>
        <View style={{ padding: 1 }}>
          <ProfileItemsCards
            iconBackgroundColor={"#ffff"}
            iconColor={style.theme.colors.primary}
            icon="account-details"
            iconType="material-community"
            title="My Account details"
            onPress={() =>
              navigation.navigate("AccountDetails", { user, goBack: "Profile" })
            }
          />
          <ProfileItemsCards
            iconColor={style.theme.colors.warning}
            iconBackgroundColor={"#ffff"}
            icon="cash-outline"
            iconType="ionicon"
            title="Purchase Credits"
            onPress={() =>
              navigation.navigate("PurchaseCredit", { user, goBack: "Profile" })
            }
          />
          <ProfileItemsCards
            iconColor={style.theme.colors.success}
            iconBackgroundColor={"#ffff"}
            icon="format-list-bulleted-square"
            iconType="material-community"
            title="My Listings"
            onPress={() => navigation.navigate("myListings")}
          />
          <ProfileItemsCards
            iconColor={style.theme.colors.error}
            iconBackgroundColor={"#ffff"}
            icon="heart-outline"
            iconType="ionicon"
            title="My Favourites"
            onPress={() => navigation.navigate("Favourites")}
          />
          <ProfileItemsCards
            iconColor={"gold"}
            iconBackgroundColor={"#ffff"}
            icon="star-half"
            iconType="ionicon"
            title="To Review"
            onPress={() => navigation.navigate("ToReview")}
          />
          {/* <ProfileItemsCards
          iconColor={style.theme.colors.warning}
          iconColor={"#ffff"}
          title="Saved Listings"
          icon="bookmark-box-multiple"
          iconType="material-community"
        /> */}
          <ProfileItemsCards
            iconColor={style.theme.colors.grey3}
            iconBackgroundColor={"#ffff"}
            icon="privacy-tip"
            iconType="material"
            title="Terms and Conditions"
          />
        </View>
        <Button
          title="Logout"
          titleStyle={{
            fontFamily: `${defaultFont}_500Medium`,
          }}
          containerStyle={{
            borderRadius: 5,
            marginVertical: 20,
            width: "100%",
            alignSelf: "center",
            // marginHorizontal: 20,
          }}
          buttonStyle={{ paddingVertical: 13 }}
          onPress={() => {
            logOut();
            console.log("navigate to Home screen");
          }}
          color="error"
        />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
