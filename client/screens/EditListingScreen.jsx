import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
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
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import selectImgDum from "../assets/selectImg.png";
import { defaultFont } from "../fontConfig/defaultFont";
import { databases, storage } from "../configs/appwrite";
import { ID } from "appwrite";
import { AuthContext } from "../context/authContext";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllListings,
  getLocations,
  userListings,
} from "../store/listings";
import { client } from "../configs/axios";

import mime from "mime";
import { LocationPicker } from "../components/Pickers";

const defaultInputs = {
  name: "",
  with: "",
  description: "",
  condition: "",
  location: "",
};

const EditListingScreen = ({ route }) => {
  const dispatch = useDispatch();
  const style = useTheme();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { item } = route.params;
  const [isDark, setIsDark] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const { mode, setMode } = useThemeMode();
  const [newListing, setNewListing] = useState({});
  const [loading, setLoading] = useState(false);
  const locations = useSelector(getLocations);

  useEffect(() => {
    setNewListing({ ...item });
  }, [item]);

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

  const updateListing = async () => {
    setLoading(true);
    try {
      if (selectedImg) {
        const data = new FormData();
        data.append("name", newListing.name);
        data.append("description", newListing.description);
        data.append("condition", newListing.condition);
        data.append("location", newListing.location);
        data.append("with", newListing.with);
        // data.append("categoryId", newListing.category._id);ß
        selectedImg.forEach((img) => {
          data.append("images", {
            uri: img.uri,
            type: mime.getType(img.uri),
            name: img?.uri?.split("/").pop(),
          });
        });
        const response = await client.put(
          `/listings/update/${item._id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          dispatch(fetchAllListings());
          dispatch(userListings());
          setLoading(false);
          navigation.navigate("myListings");
          setSelectedImg(null);
        }
      } else {
        const response = await client.put(
          `/listings/update/${item._id}`,
          newListing
        );
        console.log(response.data);
        if (response.data.success) {
          dispatch(fetchAllListings());
          dispatch(userListings());
          setLoading(false);
          navigation.navigate("myListings");
        } else {
          console.log(response.data.message);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error?.response?.data);
      console.log(error.message);
    }
  };
  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent title={`Edit ${item.name}`} />
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
          onPress={() => {
            pickImage();
          }}
        >
          {selectedImg
            ? selectedImg?.map((img) => (
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
                >
                  <Avatar.Accessory
                    size={30}
                    color={"rgb(245, 241, 237)"}
                    iconProps={{
                      name: "delete",
                    }}
                    style={{
                      // marginBottom: 15,
                      backgroundColor: theme.colors.error,
                      marginRight: 2,
                    }}
                    onPress={() => {
                      setSelectedImg(
                        selectedImg.filter((image) => image.uri !== img.uri)
                      );
                      if (selectedImg.length === 1) {
                        setSelectedImg(null);
                      }
                    }}
                  />
                </Avatar>
              ))
            : item?.images?.map((img) => (
                <Avatar
                  key={img.url}
                  source={{ uri: img.url }}
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
              ))}
        </TouchableOpacity>
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
            placeholder="say something about your item..."
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
            For
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
        <View>
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
        <Button
          loading={loading}
          disabled={Boolean(
            newListing.name === "" ||
              newListing.for === "" ||
              newListing.description === "" ||
              newListing.condition === "" ||
              newListing.location === ""
          )}
          title="Update Listing"
          color="success"
          buttonStyle={{ paddingVertical: 12, borderRadius: 5, marginTop: 25 }}
          onPress={updateListing}
        />
      </ScrollView>
    </View>
  );
};

export default EditListingScreen;

const styles = StyleSheet.create({});
