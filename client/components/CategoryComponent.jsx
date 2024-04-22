import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import {
  makeStyles,
  Text,
  Button,
  useThemeMode,
  useTheme,
  Avatar,
  Icon,
} from "@rneui/themed";
import homeIcon from "../assets/madhyaYugTransparent.png";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { defaultFont } from "../fontConfig/defaultFont";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCategories,
  fetchListingsByCategory,
  getAllCategories,
} from "../store/listings";
// import { Icon } from "@rneui/base";

export const array = [
  {
    id: 1,
    url: homeIcon,
    name: "Vehicles",
    icon: "car-sport",
    color: "#dc3545",
    type: "ionicon",
  },
  {
    id: 2,
    url: homeIcon,
    name: "Clothes",
    icon: "shirt",
    color: "#67d193",
    type: "ionicon",
  },
  {
    id: 3,
    url: homeIcon,
    name: "Food",
    icon: "food-turkey",
    color: "#9c6644",
    type: "material-community",
  },
  {
    id: 4,
    url: homeIcon,
    name: "Electronics",
    icon: "washing-machine",
    color: "black",
    type: "material-community",
  },
  {
    id: 5,
    url: homeIcon,
    name: "Books",
    icon: "bookshelf",
    color: "grey",
    type: "material-community",
  },
  {
    id: 6,
    url: homeIcon,
    name: "Cosmetics",
    icon: "lipstick",
    color: "#9c0d38",
    type: "material-community",
  },
  {
    id: 9,
    url: homeIcon,
    name: "Real Estate",
    icon: "home",
    color: "#6200b3",
    type: "antdesign",
  },
];

const CategoryComponent = () => {
  const style = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const categories = useSelector(getAllCategories);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, []);

  return (
    <SafeAreaView style={{ height: 75 }}>
      <ScrollView
        horizontal
        // style={{ backgroundColor: "pink" }}
        showsHorizontalScrollIndicator={false}
      >
        {categories.slice(0, 5).map((category) => (
          <TouchableOpacity
            onPress={() => {
              dispatch(fetchListingsByCategory({ categoryId: category._id }));
              navigation.navigate("ListingByCategory", {
                categoryId: category._id,
              });
            }}
            key={category._id}
            style={styles.box}
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
                backgroundColor: "white",
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
              style={{ fontFamily: `${defaultFont}_500Medium`, fontSize: 13 }}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate("Category")}
        >
          <Avatar
            icon={{
              name: "grid-outline",
              type: "ionicon",
              color: style.theme.colors.secondary,
            }}
            size="medium"
            rounded
            //   onPress={() => {
            //     console.log("hello world");
            //   }}
            containerStyle={{
              backgroundColor: "white",
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
            style={{ fontFamily: `${defaultFont}_500Medium`, fontSize: 13 }}
          >
            Show All
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryComponent;

const styles = StyleSheet.create({
  box: {
    flexDirection: "column",
    // backgroundColor: "pink",
    marginRight: 4,
    alignItems: "center",
  },
});
