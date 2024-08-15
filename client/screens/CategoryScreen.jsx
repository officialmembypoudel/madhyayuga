import { StyleSheet, TouchableOpacity, View } from "react-native";
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
import CategoryCard from "../components/CategoryCard";
import { useNavigation } from "@react-navigation/native";
import { array } from "../components/CategoryComponent";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCategories,
  fetchListingsByCategory,
  getAllCategories,
} from "../store/listings";

const CategoryScreen = () => {
  const style = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const categories = useSelector(getAllCategories);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, []);

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent title="Browse All Categories" />

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginHorizontal: "1%",
          alignItems: "center",
        }}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category._id}
            style={{
              backgroundColor: "rgba(0,0,0,0)",
              marginBottom: 40,
              borderRadius: 10,
              elevation: 3,
            }}
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate("ListingByCategory", {
                categoryId: category._id,
              });
              dispatch(fetchListingsByCategory({ categoryId: category._id }));
            }}
          >
            <CategoryCard category={category} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({});
