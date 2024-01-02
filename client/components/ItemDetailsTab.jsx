import { Card, Icon, Text, useTheme, useThemeMode } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, View, useWindowDimensions } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import StyledCard from "./StyledCard";
import { defaultFont } from "../fontConfig/defaultFont";
import { SearchBarAndroid } from "@rneui/base/dist/SearchBar/SearchBar-android";
import { fetchAllComments, getAllComments } from "../store/comments";
import { useDispatch, useSelector } from "react-redux";
import { textTrimmer } from "../helpers/functions";
import { dummyText } from "../dummyData/exchangeItems";
import { CommentComponent } from "../screens/ItemDisplayScreen";

export default function ItemDetailsTab({ item }) {
  const { theme } = useTheme();
  const { mode } = useThemeMode();
  const layout = useWindowDimensions();
  const dispatch = useDispatch();
  const comments = useSelector(getAllComments);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "first",
      title: "Description",
      icon: "description",
      iconType: "material",
    },
    {
      key: "second",
      title: "Comments",
      icon: "chatbox-ellipses",
      iconType: "ionicon",
    },
    { key: "third", title: "Bids", icon: "bucket", iconType: "entypo" },
  ]);

  useEffect(() => {
    dispatch(fetchAllComments({ listingId: item?._id }));
  }, []);

  const FirstRoute = (props) => {
    return (
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text
            // selectable
            selectionColor={theme.colors.success}
            style={{
              fontFamily: `${defaultFont}_400Regular`,
              textAlign: "justify",
            }}
          >
            {item?.description}
          </Text>
        </View>
      </ScrollView>
    );
  };
  const SecondRoute = () => (
    <View style={{ width: "100%", flex: 1 }}>
      <ScrollView horizontal>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ height: 340, width: "100%" }}
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingTop: 20 }}
          data={comments}
          renderItem={({ item }) => <CommentComponent comment={item} />}
          // horizontal={false}
        />
      </ScrollView>
      <View style={{ width: "100%" }}>
        <SearchBarAndroid
          value={query}
          containerStyle={{
            backgroundColor: "rgba(0,0,0,0)",
            width: "100%",
            padding: 0,
            // height: 67,
            borderColor: "rgba(0,0,0,0)",
            marginVertical: 0,
          }}
          inputContainerStyle={{
            backgroundColor: "rgba(0,0,0,0)",
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.colors.black,
            // height: 50,
            width: "100%",
            borderBottomWidth: 2,
          }}
          searchIcon={
            <Icon
              name="comment"
              color={mode === "dark" ? theme.colors.grey0 : null}
            />
          }
          cancelIcon={
            <Icon
              name="arrow-back"
              type="ionIcons"
              color={mode === "dark" ? theme.colors.grey0 : null}
              // onPress={() => Keyboard.dismiss()}
              // reverseColor
              containerStyle={{ borderRadius: 30 }}
            />
          }
          clearIcon={
            <Icon
              name="send"
              color={mode === "dark" ? theme.colors.grey0 : null}
              onPress={() => setQuery("")}
              // reverseColor
              containerStyle={{ borderRadius: 30 }}
            />
          }
          inputStyle={{
            color: theme.colors.grey0,
            fontFamily: `${defaultFont}_500Medium`,
          }}
          onChangeText={(input) => setQuery(input)}
          onClear={() => setQuery("")}
          placeholder="add a comment"
          selectionColor={theme.colors.primary}
        />
      </View>
    </View>
  );
  const ThirdRoute = () => (
    <ScrollView nestedScrollEnabled={true}>
      <View>
        <Text
          // selectable
          selectionColor={theme.colors.success}
          style={{
            fontFamily: `${defaultFont}_400Regular`,
            textAlign: "justify",
          }}
        >
          {textTrimmer(dummyText, 1800)}
        </Text>
      </View>
    </ScrollView>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  const RenderTabBar = (props) => (
    <View style={{ padding: 1 }}>
      <StyledCard paddingEnabled={false}>
        <TabBar
          {...props}
          activeColor={"white"}
          inactiveColor={"black"}
          style={{ backgroundColor: "transparent" }}
          indicatorStyle={{
            backgroundColor: theme.colors.grey0,
          }}
          renderLabel={({ route, focused, color }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Icon
                name={route.icon}
                type={route.iconType}
                iconStyle={{
                  color: focused
                    ? theme.colors.black
                    : theme.colors.greyOutline,
                }}
              />
              <Text
                style={{
                  color: focused
                    ? theme.colors.black
                    : theme.colors.greyOutline,
                  fontFamily: `${defaultFont}_600SemiBold`,
                  fontSize: 12,
                }}
              >
                {route.title}
              </Text>
            </View>
          )}
        />
      </StyledCard>
    </View>
  );

  return (
    <View style={{ height: 400, width: "100%" }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={RenderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
}
