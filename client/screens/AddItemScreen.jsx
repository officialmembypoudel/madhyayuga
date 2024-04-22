import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { containerStyles } from "../helpers/objects";
import {
  makeStyles,
  Text,
  Button,
  useThemeMode,
  useTheme,
  SearchBar,
  Icon,
  Input,
  Avatar,
  ListItem,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import selectImgDum from "../assets/add-image.png";
import { defaultFont } from "../fontConfig/defaultFont";
import { databases, storage } from "../configs/appwrite";
import { Client, ID } from "appwrite";
import { AuthContext } from "../context/authContext";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllListings,
  getAllCategories,
  getAllListings,
  getLocations,
  userListings,
} from "../store/listings";
import mime from "mime";
import { client } from "../configs/axios";
import Picker, { LocationPicker } from "../components/Pickers";

const defaultInputs = {
  name: "",
  with: "",
  description: "",
  condition: "",
  location: "",
  category: null,
};

const AddItemScreen = () => {
  const dispatch = useDispatch();
  const style = useTheme();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [isDark, setIsDark] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const { mode, setMode } = useThemeMode();
  const [newListing, setNewListing] = useState(defaultInputs);
  const [loading, setLoading] = useState(false);
  const categories = useSelector(getAllCategories);
  const locations = useSelector(getLocations);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 3,
    });

    if (!result.canceled) {
      setSelectedImg(result.assets);
    }
  };

  const createListing = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", newListing.name);
      data.append("description", newListing.description);
      data.append("condition", newListing.condition);
      data.append("location", newListing.location);
      data.append("with", newListing.with);
      selectedImg.forEach((img) => {
        data.append("images", {
          uri: img.uri,
          type: mime.getType(img.uri),
          name: img?.uri?.split("/").pop(),
        });
      });

      data.append("categoryId", newListing.category._id);

      const response = await client.post("/listings/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data) {
        console.log(response.data.documents);
        setLoading(false);
        setNewListing(defaultInputs);
        setSelectedImg(null);
        dispatch(fetchAllListings());
        dispatch(userListings());
      }
    } catch (error) {
      console.log(error?.response?.data);
      setLoading(false);
      console.log("Failed to add photo", error?.message);
    }
  };

  return (
    <View
      behavior="padding"
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent title="List Your Item" />
      {/* <Avatar
        source={selectedImg ? { uri: selectedImg.uri } : selectImgDum}
        containerStyle={{
          alignSelf: "center",
          height: 150,
          width: 250,
          marginBottom: 15,
          // borderRadius: 10,
        }}
        imageProps={{ borderBottomRightRadius: 15, borderRadius: 5 }}
      >
        <Avatar.Accessory
          iconProps={{
            name: "camera",
            // color: theme.colors.success,
          }}
          size={30}
          onPress={pickImage}
        />
      </Avatar> */}

      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
        }}
        onPress={pickImage}
      >
        {selectedImg ? (
          selectedImg?.map((img) => (
            <Avatar
              key={img.uri}
              source={{ uri: img.uri }}
              containerStyle={{
                alignSelf: "center",
                height: 100,
                width: 100,
                marginBottom: 15,
                borderRadius: 10,
                backgroundColor: theme.colors.grey4,
                padding: 2,
              }}
              imageProps={{ borderBottomRightRadius: 15, borderRadius: 5 }}
            />
          ))
        ) : (
          <Avatar
            source={selectedImg ? { uri: selectedImg.uri } : selectImgDum}
            containerStyle={{
              alignSelf: "center",
              height: 100,
              width: 100,
              marginBottom: 15,
              // borderRadius: 10,
              marginRight: "auto",
            }}
            imageProps={{ borderBottomRightRadius: 15, borderRadius: 5 }}
          />
        )}
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior="padding"
        // keyboardVerticalOffset={100}
      >
        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text
              style={{
                fontFamily: `${defaultFont}_400Regular`,
                fontSize: 18,
                marginBottom: 4,
              }}
            >
              Item's Names
            </Text>
            <Input
              value={newListing.name}
              onChangeText={(name) =>
                setNewListing({ ...newListing, name: name })
              }
              inputContainerStyle={{
                borderWidth: 2,
                borderRadius: 5,
                borderBottomWidth: 2,
                paddingHorizontal: 5,
                borderColor: theme.colors.grey4,
                backgroundColor: theme.colors.grey4,
              }}
              // leftIcon={<Icon name="mail" type="feather" />}
              // errorMessage="Fuck@nigga.com"
              placeholder="name"
              // keyboardType="email-address"
              containerStyle={{ paddingHorizontal: 0 }}
              inputStyle={{
                fontFamily: `${defaultFont}_400Regular`,
              }}
            />
          </View>
          <View>
            <Text
              style={{
                fontFamily: `${defaultFont}_400Regular`,
                fontSize: 18,
                marginBottom: 4,
              }}
            >
              Category
            </Text>
            <View style={{ marginBottom: 25 }}>
              <Picker
                value={newListing.category}
                items={categories}
                onChange={(value) =>
                  setNewListing({ ...newListing, category: value })
                }
              />
            </View>
          </View>

          <View>
            <Text
              style={{
                fontFamily: `${defaultFont}_400Regular`,
                fontSize: 18,
                marginBottom: 4,
              }}
            >
              With
            </Text>
            <Input
              value={newListing.with}
              onChangeText={(forItem) =>
                setNewListing({ ...newListing, with: forItem })
              }
              inputContainerStyle={{
                borderWidth: 2,
                borderRadius: 5,
                borderBottomWidth: 2,
                paddingHorizontal: 5,
                borderColor: theme.colors.grey4,
                backgroundColor: theme.colors.grey4,
              }}
              // leftIcon={<Icon name="mail" type="feather" />}
              // errorMessage="Fuck@nigga.com"
              placeholder="in exchange with"
              // keyboardType="email-address"
              containerStyle={{ paddingHorizontal: 0 }}
              inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
            />
          </View>

          <View>
            <Text
              style={{
                fontFamily: `${defaultFont}_400Regular`,
                fontSize: 18,
                marginBottom: 4,
              }}
            >
              Condition
            </Text>
            <Input
              value={newListing.condition}
              onChangeText={(condition) =>
                setNewListing({ ...newListing, condition: condition })
              }
              inputContainerStyle={{
                borderWidth: 2,
                borderRadius: 5,
                borderBottomWidth: 2,
                paddingHorizontal: 5,
                borderColor: theme.colors.grey4,
                backgroundColor: theme.colors.grey4,
              }}
              // leftIcon={<Icon name="mail" type="feather" />}
              // errorMessage="Fuck@nigga.com"
              placeholder="new or old"
              // keyboardType="email-address"
              containerStyle={{ paddingHorizontal: 0 }}
              inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
            />
          </View>
          <View style={{ marginBottom: 25 }}>
            <Text
              style={{
                fontFamily: `${defaultFont}_400Regular`,
                fontSize: 18,
                marginBottom: 4,
              }}
            >
              Location
            </Text>

            <LocationPicker
              items={locations}
              onChange={(value) =>
                setNewListing({ ...newListing, location: value })
              }
              value={newListing.location}
            />

            {/* <Input
              value={newListing.location}
              onChangeText={(location) =>
                setNewListing({ ...newListing, location: location })
              }
              inputContainerStyle={{
                borderWidth: 2,
                borderRadius: 5,
                borderBottomWidth: 2,
                paddingHorizontal: 5,
                borderColor: theme.colors.grey4,
                backgroundColor: theme.colors.grey4,
              }}
              // leftIcon={<Icon name="mail" type="feather" />}
              // errorMessage="Fuck@nigga.com"
              placeholder="location"
              // keyboardType="email-address"
              containerStyle={{ paddingHorizontal: 0 }}
              inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
            /> */}
          </View>
          <View>
            <Text
              style={{
                fontFamily: `${defaultFont}_400Regular`,
                fontSize: 18,
                marginBottom: 4,
              }}
            >
              Description
            </Text>
            <Input
              multiline
              numberOfLines={4}
              maxLength={100}
              value={newListing.description}
              onChangeText={(description) =>
                setNewListing({ ...newListing, description: description })
              }
              inputContainerStyle={{
                borderWidth: 2,
                borderRadius: 5,
                borderBottomWidth: 2,
                paddingHorizontal: 5,
                borderColor: theme.colors.grey4,
                backgroundColor: theme.colors.grey4,
              }}
              // leftIcon={<Icon name="mail" type="feather" />}
              // errorMessage="Fuck@nigga.com"
              // placeholder="say something about your item..."
              // keyboardType="email-address"
              containerStyle={{ paddingHorizontal: 0 }}
              inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
            />
          </View>
          <Button
            loading={loading}
            disabled={Boolean(
              newListing.name === "" ||
                newListing.for === "" ||
                newListing.description === "" ||
                newListing.condition === "" ||
                newListing.location === "" ||
                !selectedImg
            )}
            title="Create Listing"
            color="success"
            buttonStyle={{ paddingVertical: 12, borderRadius: 5 }}
            // onPress={axiosUpload}
            onPress={createListing}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddItemScreen;

const styles = StyleSheet.create({});
