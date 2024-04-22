import { StyleSheet, View, Image, FlatList } from "react-native";
import React, { useState } from "react";
import { containerStyles } from "../helpers/objects";
import { Text, Button, useThemeMode, useTheme, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import { getCategoryName } from "../helpers/functions";
import { getAllCategories, getListingByCategory } from "../store/listings";
import { useSelector } from "react-redux";
import CategoryComponent from "../components/CategoryComponent";
import ItemComponent from "../components/ItemComponent";
import { defaultFont } from "../fontConfig/defaultFont";

const ListingsByCategoryScreen = ({ route }) => {
  const style = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const { categoryId } = route.params;
  const categories = useSelector(getAllCategories);
  const allListings = useSelector(getListingByCategory);

  console.log(allListings);

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent title={getCategoryName(categories, categoryId)} />
      <CategoryComponent />
      {allListings?.length > 0 ? (
        <>
          <FlatList
            style={{
              marginTop: 10,
              width: "100%",
            }}
            contentContainerStyle={{ paddingBottom: 5 }}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            data={allListings}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ItemComponent type="column" item={{ ...item, from: "home" }} />
            )}
          />
        </>
      ) : (
        <View
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            h4
            h4Style={{
              fontFamily: `${defaultFont}_600SemiBold`,
              fontWeight: "600",
            }}
          >
            No listings found
          </Text>
        </View>
      )}
    </View>
  );
};

export default ListingsByCategoryScreen;

const styles = StyleSheet.create({});
