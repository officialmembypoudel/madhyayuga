import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Touchable,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { containerStyles } from "../helpers/objects";
import {
  Text,
  Button,
  useThemeMode,
  useTheme,
  Icon,
  Avatar,
  Card,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import { setImageQuality } from "../helpers/functions";
import { defaultFont } from "../fontConfig/defaultFont";
import { client } from "../configs/axios";
import { AuthContext } from "../context/authContext";
import { SearchBarAndroid } from "@rneui/base/dist/SearchBar/SearchBar-android";
import { ChatContext } from "../context/chatContext";

const MessagesScreen = ({ route }) => {
  const style = useTheme();
  const chat = route.params.chat;
  const { user } = useContext(AuthContext);
  const {
    messages,
    getMessages,
    addMessage,
    loading,
    setCurrentChatRoom,
    sendingMessage,
    onlineUsers,
  } = useContext(ChatContext);
  const navigation = useNavigation();
  const messagesRef = useRef(null);
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const [newMessage, setNewMessage] = useState("");
  const [isReceiverOnline, setIsReceiverOnline] = useState(false);

  useEffect(() => {
    getMessages(chat._id, messagesRef);
    setCurrentChatRoom(chat._id);
  }, [chat]);

  useEffect(() => {
    const otherUser = chat?.members.filter(
      (member) => member._id !== user._id
    )[0];

    const isUserOnline = onlineUsers?.some((u) => u.user === otherUser?._id);

    setIsReceiverOnline(isUserOnline);
  }, [chat, onlineUsers?.length]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      {chat ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
              <Icon name="md-chevron-back" type="ionicon" size={25} />
            </TouchableOpacity>
            <Avatar
              size="medium"
              rounded
              source={{ uri: setImageQuality(chat?.listing?.images[0].url) }}
              containerStyle={{
                borderWidth: 1.7,
                borderColor: style.theme.colors.primary,
              }}
            >
              {isReceiverOnline ? (
                <Avatar.Accessory
                  style={{
                    elevation: 0,
                    shadowOpacity: 0,
                    shadowOffset: 0,
                    width: 15,
                    height: 15,
                    borderRadius: 30,
                    backgroundColor: "transparent",
                  }}
                  iconStyle={{
                    color: "limegreen",
                  }}
                  iconProps={{ name: "lens", size: 15 }}
                />
              ) : null}
            </Avatar>
            <View
              style={{
                flex: 1,
                justifyContent: "center", // Center the content vertically
                alignItems: "center", // Center the content horizontally
                paddingRight: "21%",
              }}
            >
              <Text
                h4
                h4Style={{
                  fontFamily: `${defaultFont}_600SemiBold`,
                  fontWeight: 600,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                {chat?.listing?.name}
              </Text>
              <Text
                style={{
                  fontFamily: `${defaultFont}_500Medium`,
                  textAlign: "center",
                }}
              >
                {chat?.sender?.name}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 20,
              flex: 1,
              height: "100%",
            }}
          >
            {messages[0]?.message ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                scrollsToTop={false}
                ref={messagesRef}
                onContentSizeChange={() =>
                  messagesRef.current.scrollToEnd({
                    animated: true,
                    block: "end",
                    behaviour: "smooth",
                  })
                }
                style={{ width: "100%" }}
                data={messages}
                keyExtractor={(item, index) => item?._id || index.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 5,
                      marginBottom: 10,
                      justifyContent:
                        item?.sender === user?._id ? "flex-end" : "flex-start",
                    }}
                  >
                    {item?.sender !== user?._id ? (
                      <Avatar
                        size="small"
                        rounded
                        source={{
                          uri: setImageQuality(chat?.sender?.avatar, 35),
                        }}
                      />
                    ) : null}
                    <Card
                      containerStyle={{
                        margin: 0,
                        padding: 10,
                        backgroundColor:
                          item?.sender !== user?._id ? "#aeb9cc" : "#218aff",
                        borderWidth: 0,
                        borderRadius: 10,
                        width: "75%",
                        elevation: 0,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: `${defaultFont}_400Regular`,
                          color:
                            item?.sender !== user?._id ? "#1a1a1a" : "#f3f3f3",
                        }}
                      >
                        {item?.message}
                      </Text>
                      <Text
                        style={{
                          fontFamily: `${defaultFont}_400Regular`,
                          fontSize: 10,
                          textAlign: "right",
                          color:
                            item?.sender !== user?._id ? "#1a1a1a" : "#f3f3f3",
                        }}
                      >
                        {new Date(item?.createdAt).toDateString()}
                      </Text>
                    </Card>
                  </View>
                )}
              />
            ) : null}
          </View>
          <Card
            containerStyle={{
              width: "100%",
              //   flex: 1,
              //   flexGrow: 1,
              margin: 0,
              padding: 10,
              backgroundColor:
                mode === "dark"
                  ? style.theme.colors.grey4
                  : style.theme.colors.background,
              borderWidth: 0,
              borderRadius: 10,
              elevation: 4,
            }}
            wrapperStyle={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <SearchBarAndroid
              value={newMessage}
              containerStyle={{
                backgroundColor: "rgba(0,0,0,0)",

                padding: 0,

                borderColor: "rgba(0,0,0,0)",
                marginVertical: 0,
                flexGrow: 1,
              }}
              inputContainerStyle={{
                backgroundColor: "rgba(0,0,0,0)",
                borderRadius: 10,
                // borderWidth: 2,

                borderColor: style.theme.colors.black,
                // height: 50,
                width: "100%",
                borderBottomWidth: 0,
              }}
              searchIcon={
                <Icon
                  name="comment"
                  color={mode === "dark" ? style.theme.colors.grey0 : null}
                />
              }
              cancelIcon={
                <Icon
                  name="arrow-back"
                  type="ionIcons"
                  color={mode === "dark" ? style.theme.colors.grey0 : null}
                  onPress={() => Keyboard.dismiss()}
                  // reverseColor
                  containerStyle={{ borderRadius: 30 }}
                />
              }
              clearIcon={
                <Button
                  loading={sendingMessage}
                  type="clear"
                  onPress={() => {
                    addMessage(
                      chat._id,
                      newMessage,
                      messagesRef,
                      chat?.sender?._id
                    );
                    setNewMessage("");
                  }}
                >
                  <Icon
                    name="send"
                    color={
                      mode === "dark"
                        ? style.theme.colors.grey0
                        : style.theme.colors.primary
                    }
                    // reverseColor
                    containerStyle={{ borderRadius: 30 }}
                  />
                </Button>
              }
              inputStyle={{
                color: style.theme.colors.grey0,
                fontFamily: `${defaultFont}_500Medium`,
              }}
              onChangeText={(input) => setNewMessage(input)}
              onClear={() => setNewMessage("")}
              placeholder="write a message..."
              selectionColor={style.theme.colors.primary}
            />
          </Card>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({});
