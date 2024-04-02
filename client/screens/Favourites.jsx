import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
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
  Card,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import ItemComponent from "../components/ItemComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavourites,
  getFavourites,
  userListings,
} from "../store/listings";
import { AuthContext } from "../context/authContext";
import { databases } from "../configs/appwrite";
import { client } from "../configs/axios";

const Favourites = () => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const style = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const allListings = useSelector(getFavourites);

  useEffect(() => {
    dispatch(fetchFavourites());
  }, [dispatch]);

  console.log(allListings);
  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent
        title="My Favourites"
        backAction={() => {
          navigation.navigate("Profile");
        }}
      />
      {allListings && (
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingBottom: 70 }}
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
          // horizontal={true}
          data={allListings}
          // keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <ItemComponent item={{ ...item?.listing }} type="column" />
          )}
        />
      )}
    </View>
  );
};

export default Favourites;

const styles = StyleSheet.create({});
