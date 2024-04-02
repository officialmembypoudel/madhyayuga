import {
  Avatar,
  Button,
  Card,
  Icon,
  Text,
  useTheme,
  useThemeMode,
} from "@rneui/themed";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import StyledCard from "./StyledCard";
import { defaultFont } from "../fontConfig/defaultFont";
import { SearchBarAndroid } from "@rneui/base/dist/SearchBar/SearchBar-android";
import {
  addComment,
  fetchAllComments,
  getAllComments,
} from "../store/comments";
import { useDispatch, useSelector } from "react-redux";
import { setImageQuality, textTrimmer } from "../helpers/functions";
import { dummyText } from "../dummyData/exchangeItems";
import { CommentComponent } from "../screens/ItemDisplayScreen";
import { client } from "../configs/axios";
import { useScrollToTop } from "@react-navigation/native";
import BidItemsCard from "./BidItemsCard";
import SelectBidModal from "./SelectBidModal";
import { fetchBids, getBids } from "../store/listings";

const SecondRoute = ({ route }) => {
  const { theme } = useTheme();
  const { mode } = useThemeMode();
  const dispatch = useDispatch();
  const comments = useSelector(getAllComments);
  const [query, setQuery] = useState("");
  const commentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    dispatch(fetchAllComments({ listingId: route?.item?._id }));
  }, []);

  const handleAddComment = async () => {
    if (query) {
      setLoading(true);
      try {
        // Fetch comments from the server
        const response = await client.post("/listings/comments/add", {
          listingId: route?.item?._id,
          type: replyTo ? "reply" : "comment",
          text: query,
          commentId: replyTo?._id,
        });

        response && setQuery("");
        response && setLoading(false);
        response && setReplyTo(null);
        if (response) {
          const resultaction = await dispatch(
            fetchAllComments({
              listingId: route?.item?._id,
            })
          );

          resultaction?.payload?.length > 0 &&
            commentRef?.current?.scrollToIndex({ index: 0, animated: true });
        }
      } catch (error) {
        setLoading(false);
        console.error("comments add error", error.response.data);
      }
    }
  };

  return (
    <View style={{ width: "100%", flex: 1 }}>
      <ScrollView horizontal>
        <FlatList
          ref={commentRef}
          showsVerticalScrollIndicator={false}
          style={{ height: 340, width: "100%" }}
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingTop: 20 }}
          data={comments}
          renderItem={({ item }) => (
            <CommentComponent
              comment={item}
              setReplyTo={setReplyTo}
              replyTo={replyTo}
            />
          )}
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
            <Button type="clear" loading={loading}>
              <Icon
                name="send"
                color={mode === "dark" ? theme.colors.grey0 : null}
                onPress={handleAddComment}
                // reverseColor
                containerStyle={{ borderRadius: 30 }}
              />
            </Button>
          }
          inputStyle={{
            color: theme.colors.grey0,
            fontFamily: `${defaultFont}_500Medium`,
          }}
          onChangeText={(input) => setQuery(input)}
          onClear={() => setQuery("")}
          placeholder={
            replyTo ? "reply to " + replyTo?.user?.name : "add a comment"
          }
          selectionColor={theme.colors.primary}
        />
      </View>
    </View>
  );
};

const ThirdRoute = ({ route: { item } }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const allBids = useSelector(getBids);

  const handleBidModal = () => setVisible(!visible);

  useEffect(() => {
    dispatch(fetchBids(item?._id));
  }, [item._id]);

  return (
    <View>
      {allBids && (
        <FlatList
          style={{ width: "100%", height: 340 }}
          contentContainerStyle={{ paddingBottom: 70 }}
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
          // horizontal={true}
          data={allBids}
          keyExtractor={(item) => item?._id}
          renderItem={({ item }) => (
            <View style={{ padding: 1 }}>
              <BidItemsCard item={{ ...item?.for }} />
            </View>
          )}
        />
      )}

      <Button
        title={"Add"}
        containerStyle={{ marginBottom: 10, alignSelf: "flex-end" }}
        buttonStyle={{
          backgroundColor: theme.colors.grey4,
          borderRadius: 10,
          elevation: 0,
        }}
        onPress={handleBidModal}
      >
        <Icon name="add" />
      </Button>
      <SelectBidModal
        item={item}
        visible={visible}
        setVisible={setVisible}
        handleBidModal={handleBidModal}
      />
    </View>
  );
};

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
      item: item,
    },
    {
      key: "third",
      title: "Bids",
      icon: "bucket",
      iconType: "entypo",
      item: item,
    },
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
            display: "none",
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
    <View style={{ height: 500, width: "100%" }}>
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
