import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  SectionList,
  TouchableOpacity,
  View,
  VirtualizedList,
} from "react-native";
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

const sections = [
  {
    title: "hot",
    data: [],
    horizontal: true,
  },
  {
    title: "new",
    data: newExchangeItems,
    horizontal: false,
  },
];

const SectionTitle = ({ title }) => {
  const style = useTheme();
  const styles = useStyles();
  return (
    <TouchableOpacity
      style={[
        styles.featured,
        {
          margin: 0,
          backgroundColor: style.theme.colors.background,
          paddingVertical: 10,
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
  const styles = useStyles();
  const theme = useTheme();
  const { setMode, mode } = useThemeMode();
  const [isDark, setIsDark] = useState(false);

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
            Welcome, Memby!
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

      <SectionList
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item, section }) => {
          return <ItemComponent type="column" item={item} />;
        }}
        renderSectionHeader={({ section: { title, horizontal } }) => {
          if (horizontal) {
            return (
              <>
                <CategoryComponent />
                <SectionTitle title={"Hot In The Area"} />
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  overScrollMode="never"
                  horizontal={true}
                  data={exchangeItems}
                  keyExtractor={(item) => item.id + 1}
                  renderItem={({ item }) => (
                    <ItemComponent type="row" item={item} />
                  )}
                />
              </>
            );
          } else {
            return <SectionTitle title="New From The Town" />;
          }
        }}
        contentContainerStyle={{ paddingBottom: 65 }}
        stickySectionHeadersEnabled={true}
      />
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
