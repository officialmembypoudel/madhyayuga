import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import ItemComponent from "../components/ItemComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllListings, getAllListings } from "../store/listings";

const NewListings = ({ route }) => {
  const dispatch = useDispatch();
  const style = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const allListings = useSelector(getAllListings);
  const [newListings, setNewListings] = useState([]);
  const { listings, newList } = route?.params;

  useEffect(() => {
    dispatch(fetchAllListings({ limit: 100 }));
  }, []);

  useEffect(() => {
    setNewListings(allListings);
  }, [newListings]);
  //   console.log(newListings);
  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent
        title={newList ? "New Listings" : "Hot Listings"}
      />
      <FlatList
        style={{ width: "100%" }}
        contentContainerStyle={{ paddingBottom: 70 }}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        // horizontal={true}
        data={listings}
        // keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <ItemComponent type="column" item={{ ...item, from: "newListing" }} />
        )}
      />
    </View>
  );
};

export default NewListings;

const styles = StyleSheet.create({});
