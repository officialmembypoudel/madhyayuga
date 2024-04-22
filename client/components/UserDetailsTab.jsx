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

import { useDispatch, useSelector } from "react-redux";
import ItemComponent from "./ItemComponent";
import UserRating from "./UserRating";
import { setImageQuality } from "../helpers/functions";
import { client } from "../configs/axios";

export default function UserDetailsTab({ user }) {
  const { theme } = useTheme();
  const { mode } = useThemeMode();
  const layout = useWindowDimensions();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [listings, setListings] = useState([]);
  const [routes, setRoutes] = useState([
    {
      key: "first",
      title: "Reviews",
      icon: "star-half-outline",
      iconType: "ionicon",
      user: user,
    },
    {
      key: "second",
      title: "Listings",
      icon: "list-outline",
      iconType: "ionicon",
      user: user,
    },
  ]);
  const fetchReviewsAndListings = async () => {
    try {
      const reviewResponse = await client.get(`/users/${user._id}/reviews`);
      const listingResponse = await client.get(`/listings?userId=${user._id}`);
      setListings(listingResponse.data?.documents ?? []);
      setReviews(reviewResponse.data?.documents ?? []);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchReviewsAndListings();
  }, [user?._id]);

  const FirstRoute = () => {
    return (
      <ScrollView
        nestedScrollEnabled={true}
        //   contentContainerStyle={{ paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {reviews?.length === 0 && (
          <Text
            style={{
              fontFamily: `${defaultFont}_600SemiBold`,
              fontSize: 18,
              marginBottom: 10,
              textAlign: "center",
              marginTop: 15,
            }}
          >
            No Reviews Yet
          </Text>
        )}
        <View style={{ padding: 1 }}>
          {reviews?.map((review, index) => (
            <StyledCard paddingEnabled={true} key={index}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Avatar
                  size={"large"}
                  rounded
                  source={{
                    uri: setImageQuality(review?.reviewer?.avatar?.url, 20),
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: `${defaultFont}_500Medium`,
                      fontSize: 16,
                      color: theme.colors.black,
                      marginBottom: 5,
                    }}
                  >
                    {review?.reviewer?.name}
                  </Text>
                  <UserRating rating={review?.rating} total={1} />
                  <Text
                    style={{
                      fontFamily: `${defaultFont}_400Regular`,
                      fontSize: 16,
                      color: theme.colors.black,
                      marginTop: 3,
                    }}
                  >
                    {review?.review}
                  </Text>
                </View>
              </View>
            </StyledCard>
          ))}
        </View>
      </ScrollView>
    );
  };

  const SecondRoute = ({ route }) => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%", height: "auto" }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {listings?.map((listing, index) => (
          <ItemComponent key={index} item={listing} type="column" />
        ))}
      </ScrollView>
    );
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
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
