import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  FlatList,
} from "react-native";

import React, { useContext, useEffect, useState } from "react";
import { containerStyles } from "../helpers/objects";
import {
  makeStyles,
  Text,
  Button as ThemedButton,
  useThemeMode,
  useTheme,
  SearchBar,
  Icon,
  Card,
  Chip,
  Avatar,
  Tab,
  TabView,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import profileImg from "../assets/boy.png";
import { defaultFont } from "../fontConfig/defaultFont";
import { Dimensions } from "react-native";
import { dummyText } from "../dummyData/exchangeItems";
import { setImageQuality, textTrimmer } from "../helpers/functions";
import { SearchBarAndroid } from "@rneui/base/dist/SearchBar/SearchBar-android";
import { databases } from "../configs/appwrite";
import { useDispatch, useSelector } from "react-redux";
import { updateViews } from "../store/listings";
import NewListings from "./NewListings";
import { client } from "../configs/axios";
import { fetchAllComments, getAllComments } from "../store/comments";
import { ChatContext } from "../context/chatContext";
import ItemDetailsTab from "../components/ItemDetailsTab";
import StyledCard from "../components/StyledCard";

export const CommentComponent = ({ comment }) => {
  const { mode } = useThemeMode();
  const { theme } = useTheme();
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          margin: 1,
          gap: 5,
        }}
      >
        <Avatar
          size="medium"
          rounded
          title="PIC"
          source={{ uri: setImageQuality(comment?.user?.avatar?.url, 35) }}
          containerStyle={{ backgroundColor: "rgb(0,0,0,0)" }}
        />
        <Card
          containerStyle={{
            borderWidth: 0,
            margin: 0,
            borderRadius: 10,
            width: 250,
            padding: 10,
            backgroundColor:
              mode === "dark" ? theme.colors.grey3 : theme.colors.background,
          }}
          // wrapperStyle={{ backgroundColor: "red" }}
        >
          <Text style={{ fontFamily: `${defaultFont}_600SemiBold` }}>
            {comment?.user?.name}
          </Text>
          <Text style={{ fontFamily: `${defaultFont}_400Regular` }}>
            {comment.text}
          </Text>
        </Card>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginEnd: "10%",
        }}
      >
        <ThemedButton title="Reply" type="clear" />
      </View>
    </View>
  );
};

const CustomTabNavigation = ({ item }) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name="location-outline" type="ionicon" size={15} />
        <Text style={{ fontFamily: `${defaultFont}_300Light` }}>
          {item?.location}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name="location-outline" type="ionicon" size={15} />
        <Text style={{ fontFamily: `${defaultFont}_300Light` }}>
          {item?.location}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name="location-outline" type="ionicon" size={15} />
        <Text style={{ fontFamily: `${defaultFont}_300Light` }}>
          {item?.location}
        </Text>
      </View>
    </View>
  );
};

// const ItemDetailsTabOne = ({ setScrollEnabled, item }) => {
//   const style = useTheme();
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const [index, setIndex] = useState(0);
//   const { mode } = useThemeMode();
//   const [query, setQuery] = useState("");
//   const comments = useSelector(getAllComments);

//   useEffect(() => {
//     dispatch(fetchAllComments({ listingId: item?._id }));
//   }, []);

//   console.log(comments);

//   return (
//     <>
//       <Tab
//         value={index}
//         onChange={(e) => setIndex(e)}
//         variant="default"
//         style={{
//           elevation: 1,
//           backgroundColor:
//             mode === "dark"
//               ? style.theme.colors.grey4
//               : style.theme.colors.background,
//           borderRadius: 10,
//         }}
//       >
//         <Tab.Item
//           title="Description"
//           titleStyle={{
//             fontSize: 12,
//             color: style.theme.colors.black,
//           }}
//           icon={{
//             name: "description",
//             type: "material",
//             color: style.theme.colors.black,
//           }}
//           containerStyle={(active) => ({
//             backgroundColor: active
//               ? style.theme.colors.grey3
//               : "rgba(0,0,0,0)",
//             borderRadius: 10,
//             borderBottomLeftRadius: 0,
//             borderBottomRightRadius: 0,
//           })}
//         />
//         <Tab.Item
//           title="Comments"
//           titleStyle={{
//             fontSize: 12,
//             color: style.theme.colors.black,
//           }}
//           icon={{
//             name: "chatbox-ellipses",
//             type: "ionicon",
//             color: style.theme.colors.black,
//           }}
//           containerStyle={(active) => ({
//             backgroundColor: active
//               ? style.theme.colors.grey3
//               : "rgba(0,0,0,0)",
//             borderRadius: 10,
//             borderBottomLeftRadius: 0,
//             borderBottomRightRadius: 0,
//           })}
//         />
//         <Tab.Item
//           title="Bids"
//           titleStyle={{
//             fontSize: 12,
//             color: style.theme.colors.black,
//           }}
//           icon={{
//             name: "bucket",
//             type: "entypo",
//             color: style.theme.colors.black,
//           }}
//           containerStyle={(active) => ({
//             backgroundColor: active
//               ? style.theme.colors.grey3
//               : "rgba(0,0,0,0)",
//             borderRadius: 10,
//             borderBottomLeftRadius: 0,
//             borderBottomRightRadius: 0,
//           })}
//         />
//       </Tab>

//       <View style={{ backgroundColor: "transparent", height: 400 }}>
//         <TabView
//           value={index}
//           onChange={(e) => setIndex(e)}
//           tabItemContainerStyle={{
//             // width: "100%",
//             height: 400,
//             overflow: "hidden",
//             backgroundColor: "transparent",
//           }}
//           disableSwipe={false}
//           containerStyle={{
//             flexGrow: 1,
//             overflow: "hidden",
//             backgroundColor: "transparent",
//           }}
//         >
//           <TabView.Item style={{ height: "100%" }} collapsable>
//             <ScrollView
//               nestedScrollEnabled={true}
//               contentContainerStyle={{ paddingTop: 20 }}
//               showsVerticalScrollIndicator={false}
//             >
//               <View>
//                 <Text
//                   // selectable
//                   selectionColor={style.theme.colors.success}
//                   style={{
//                     fontFamily: `${defaultFont}_400Regular`,
//                     textAlign: "justify",
//                   }}
//                 >
//                   {item?.description}
//                 </Text>
//               </View>
//             </ScrollView>
//           </TabView.Item>
//           <TabView.Item
//             style={{
//               height: "100%",
//               justifyContent: "space-between",
//               width: "100%",
//             }}
//             collapsable
//           >
//             <View style={{ width: "100%" }}>
//               <ScrollView horizontal>
//                 <FlatList
//                   showsVerticalScrollIndicator={false}
//                   style={{ height: 340, width: "100%" }}
//                   nestedScrollEnabled={true}
//                   contentContainerStyle={{ paddingTop: 20 }}
//                   data={comments}
//                   renderItem={({ item }) => <CommentComponent comment={item} />}
//                   // horizontal={false}
//                 />
//               </ScrollView>
//               <View style={{ width: "100%" }}>
//                 <SearchBarAndroid
//                   value={query}
//                   containerStyle={{
//                     backgroundColor: "rgba(0,0,0,0)",
//                     width: "100%",
//                     padding: 0,
//                     // height: 67,
//                     borderColor: "rgba(0,0,0,0)",
//                     marginVertical: 0,
//                   }}
//                   inputContainerStyle={{
//                     backgroundColor: "rgba(0,0,0,0)",
//                     borderRadius: 10,
//                     borderWidth: 2,
//                     borderColor: theme.theme.colors.black,
//                     // height: 50,
//                     width: "100%",
//                     borderBottomWidth: 2,
//                   }}
//                   searchIcon={
//                     <Icon
//                       name="comment"
//                       color={mode === "dark" ? theme.theme.colors.grey0 : null}
//                     />
//                   }
//                   cancelIcon={
//                     <Icon
//                       name="arrow-back"
//                       type="ionIcons"
//                       color={mode === "dark" ? theme.theme.colors.grey0 : null}
//                       onPress={() => Keyboard.dismiss()}
//                       // reverseColor
//                       containerStyle={{ borderRadius: 30 }}
//                     />
//                   }
//                   clearIcon={
//                     <Icon
//                       name="send"
//                       color={mode === "dark" ? theme.theme.colors.grey0 : null}
//                       onPress={() => setQuery("")}
//                       // reverseColor
//                       containerStyle={{ borderRadius: 30 }}
//                     />
//                   }
//                   inputStyle={{
//                     color: theme.theme.colors.grey0,
//                     fontFamily: `${defaultFont}_500Medium`,
//                   }}
//                   onChangeText={(input) => setQuery(input)}
//                   onClear={() => setQuery("")}
//                   placeholder="add a comment"
//                   selectionColor={theme.theme.colors.primary}
//                 />
//               </View>
//             </View>
//           </TabView.Item>
//           {/* <TabView.Item
//             style={{
//               height: "100%",
//               overflow: "hidden",
//               backgroundColor: "transparent",
//             }}
//           >
//             <ScrollView nestedScrollEnabled={true}>
//               <View>
//                 <Text
//                   // selectable
//                   selectionColor={style.theme.colors.success}
//                   style={{
//                     fontFamily: `${defaultFont}_400Regular`,
//                     textAlign: "justify",
//                   }}
//                 >
//                   {textTrimmer(dummyText, 1800)}
//                 </Text>
//               </View>
//             </ScrollView>
//           </TabView.Item> */}
//         </TabView>
//       </View>
//       {/* </ScrollView> */}
//     </>
//   );
// };

const NormalDataTextComponent = ({ title, text, fontFamily, fontSize }) => {
  const style = useTheme();
  return (
    <Text
      style={{
        //   color: style.theme.colors.black,
        marginBottom: 3,
        fontFamily: fontFamily ? fontFamily : `${defaultFont}_600SemiBold`,
        // fontWeight: "600",
        fontSize: fontSize ? fontSize : 16,
        marginRight: 20,
      }}
      selectable
      selectionColor={style.theme.colors.error}
    >
      {`${title ? title + ": " : ""} ${text}`}
    </Text>
  );
};

const ItemDisplayScreen = ({ route }) => {
  const dispatch = useDispatch();
  const style = useTheme();
  const navigation = useNavigation();
  const { createChatRoom } = useContext(ChatContext);
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const { item } = route.params;
  const screenWidth = Dimensions.get("window").width;
  const [newItem, setNewItem] = useState({ ...item });
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(item?.userId);
  }, [item]);
  return (
    <>
      {item ? (
        <View
          style={{
            ...containerStyles,
            backgroundColor: style.theme.colors.background,
          }}
        >
          <ScrollView
            // overScrollMode="never"
            contentContainerStyle={{ paddingBottom: 100, padding: 2 }}
            style={{ width: "100%", flex: 1 }}
            // nestedScrollEnabled={true}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            // horizontal
          >
            <ScreenHeaderComponent title={item.name} hideModeToggle={false} />
            <Card
              containerStyle={{
                width: "100%",
                margin: 0,
                marginBottom: 10,
                padding: 10,
                backgroundColor:
                  mode === "dark"
                    ? style.theme.colors.grey4
                    : style.theme.colors.background,
                borderWidth: 0,
                borderRadius: 10,
                //   width: 105,
                elevation: 1,
              }}
            >
              {/* <Card.Image
            source={{ uri: item.imageSrc }}
            style={{
              width: "100%",
              height: 250,
              alignSelf: "center",
              marginTop: 0,
              resizeMode: "cover",
            }}
          /> */}
              <Avatar
                title={`${item?.name} image`}
                source={{ uri: setImageQuality(item?.images[0]?.url, 35) }}
                containerStyle={{
                  backgroundColor: style.theme.colors.grey3,
                  width: "100%",
                  height: 250,
                  borderRadius: 8,
                }}
                imageProps={{ borderRadius: 8 }}
              />
            </Card>
            <Card
              containerStyle={{
                width: "100%",
                margin: 0,
                marginBottom: 10,
                padding: 10,
                backgroundColor:
                  mode === "dark"
                    ? style.theme.colors.grey4
                    : style.theme.colors.background,
                borderWidth: 0,
                borderRadius: 10,
                //   width: 105,
                elevation: 1,
              }}
            >
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name="location-outline" type="ionicon" size={15} />
                  <Text style={{ fontFamily: `${defaultFont}_300Light` }}>
                    {item?.location}
                  </Text>
                </View>
                <NormalDataTextComponent title="Name" text={item.name} />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      //   color: style.theme.colors.black,
                      marginBottom: 3,
                      fontFamily: `${defaultFont}_600SemiBold`,
                      fontWeight: "600",
                      fontSize: 16,
                      marginRight: 20,
                    }}
                    selectable
                    selectionColor={style.theme.colors.error}
                  >
                    Exchange With: {item?.with}
                  </Text>
                  <ThemedButton
                    icon={<Icon name="logo-google" type="ionicon" size={16} />}
                    type="clear"
                    radius={30}
                    onPress={() => {
                      console.log("google search");
                    }}
                  />
                </View>
                <NormalDataTextComponent
                  title="Condition"
                  text={item.condition}
                />
              </View>
            </Card>
            <StyledCard>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar
                  rounded
                  size={"large"}
                  source={{ uri: setImageQuality(user?.avatar?.url, 35) }}
                  title="img"
                />
                <View style={{ marginLeft: 10 }}>
                  <NormalDataTextComponent text={user?.name} />
                  <NormalDataTextComponent
                    text={user?.email}
                    fontFamily={`${defaultFont}_500Medium`}
                    fontSize={14}
                  />
                  <NormalDataTextComponent
                    text={user?.phone}
                    fontFamily={`${defaultFont}_500Medium`}
                    fontSize={14}
                  />
                </View>
              </View>
            </StyledCard>
            {/* <StyledCard> */}
            <ItemDetailsTab item={item} />

            {/* <ItemDetailsTabOne item={item} /> */}
            {/* </StyledCard> */}
          </ScrollView>
          <View
            style={{
              backgroundColor: "rgba(246, 241, 232,0.6)",

              position: "absolute",
              height: 60,
              width: screenWidth,
              //   backgroundColor: "red",
              bottom: 0,
              left: 0,
              flexDirection: "row",
              //   justifyContent: "space-between",
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={[
                styles.buttons,
                { backgroundColor: "rgba(126, 188, 137,0.0)" },
              ]}
            >
              <Icon name="call-outline" type="ionicon" />

              <NormalDataTextComponent text="Call" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttons,
                { backgroundColor: "rgba(254, 93, 38,0.0)" },
              ]}
            >
              <Icon name="mail-outline" type="ionicon" />

              <NormalDataTextComponent text="Email" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttons,
                { backgroundColor: "rgba(7, 94, 84,0.0)" },
              ]}
              onPress={() => {
                createChatRoom(item?._id, item?.userId?._id);
              }}
            >
              <Icon name="chatbox-outline" type="ionicon" />
              <NormalDataTextComponent text="Chat" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text>Item not found</Text>
      )}
    </>
  );
};

export default ItemDisplayScreen;

const styles = StyleSheet.create({
  buttons: {
    // witdh: "33.33%",
    // flex: 1,
    flexGrow: 1,
    padding: 7,
    // paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
