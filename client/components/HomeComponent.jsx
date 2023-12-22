import React, { useContext, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import {
  makeStyles,
  Text,
  Button,
  useThemeMode,
  useTheme,
  Avatar,
} from "@rneui/themed";
import { Icon } from "@rneui/base";
import SearchBarComponent from "./SearchBar";
import ItemComponent from "./ItemComponent";
import homeIcon from "../assets/madhyaYugTransparent.png";
import CategoryComponent from "./CategoryComponent";
import ModeToogleComponent from "./ModeToogleComponent";
import { defaultFont } from "../fontConfig/defaultFont";
import { exchangeItems, newExchangeItems } from "../dummyData/exchangeItems";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/authContext";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllListings,
  getAllListings,
  updateViews,
} from "../store/listings";
import { useNavigation } from "@react-navigation/native";
import { getFirstName } from "../helpers/functions";
import { ScrollView } from "react-native-virtualized-view";

const SectionTitle = ({ title, onPress }) => {
  const style = useTheme();
  const styles = useStyles();
  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => {}}
      style={[
        styles.featured,
        {
          margin: 0,
          backgroundColor: style.theme.colors.background,
          paddingVertical: 10,
          width: "100%",
        },
      ]}
    >
      <Text
        style={{
          fontSize: 18,
          fontFamily: `${defaultFont}_600SemiBold`,
        }}
      >
        {title}
      </Text>
      <Icon name="chevron-right" color={style.theme.colors.black} />
    </TouchableOpacity>
  );
};

const HomeComponent = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const styles = useStyles();
  const theme = useTheme();
  const { setMode, mode } = useThemeMode();
  const [isDark, setIsDark] = useState(false);
  const allListings = useSelector(getAllListings);

  const sections = [
    {
      title: "hot",
      data: allListings,
      horizontal: true,
    },
    {
      title: "new",
      data: allListings,
      horizontal: false,
    },
  ];

  const navigateToNewListings = () => navigate("NewListing");

  useEffect(() => {
    dispatch(fetchAllListings({ limit: 5 }));
  }, [dispatch]);
  // console.log(allListings);
  const handleOnPress = (state) => {
    setIsDark(state);
    setMode(state ? "dark" : "light");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "85%",
          }}
        >
          <Avatar
            source={homeIcon}
            size="small"
            rounded
            onPress={() => handleOnPress(!isDark)}
            containerStyle={{
              backgroundColor: "white",
              padding: 2,
              elevation: 10,
              marginRight: 10,
            }}
            avatarStyle={{
              resizeMode: "contain",
            }}
          />
          <Text
            h4
            h4Style={{
              fontFamily: `${defaultFont}_600SemiBold`,
              fontWeight: "600",
            }}
          >
            {`Welcome, ${getFirstName(user.name)}`}
          </Text>
        </View>
        <ModeToogleComponent />
      </View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 5,
          alignSelf: "flex-end",
        }}
      >
        <Icon
          name="location-outline"
          type="ionicon"
          color={theme.theme.colors.black}
          size={15}
        />
        <Text style={{ fontFamily: `${defaultFont}_300Light` }}>
          Itahari, Sunsari
        </Text>
      </TouchableOpacity>
      <SearchBarComponent />

      {allListings && (
        <>
          <CategoryComponent />
          <ScrollView></ScrollView>
          <FlatList
            style={{
              width: "100%",
            }}
            contentContainerStyle={{ paddingBottom: 70 }}
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
            horizontal={false}
            data={allListings}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ItemComponent type="column" item={{ ...item, from: "home" }} />
            )}
            StickyHeaderComponent={() => (
              <SectionTitle
                title={"Hot In the Town"}
                onPress={() => navigate("NewListing")}
              />
            )}
            ListHeaderComponent={() => (
              <View>
                <SectionTitle
                  title={"New In the Town"}
                  onPress={() => navigate("NewListing")}
                />
                <FlatList
                  style={{
                    width: "100%",
                  }}
                  contentContainerStyle={{ paddingBottom: 5 }}
                  showsHorizontalScrollIndicator={false}
                  overScrollMode="never"
                  horizontal={true}
                  data={allListings}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <ItemComponent
                      type="row"
                      item={{ ...item, from: "home" }}
                    />
                  )}
                />
                {/* from here */}
                <SectionTitle
                  title={"Hot In the Town"}
                  onPress={() => navigate("NewListing")}
                />
                {/* chat gpt make this block of code skicky when scrolling */}
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 55,
    paddingHorizontal: 8,
  },
  text: {
    marginVertical: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  featured: {
    // marginVertical: 10,
    // marginTop: 15,
    flexDirection: "row",
    // width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

export default HomeComponent;
