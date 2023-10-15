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
import { useDispatch } from "react-redux";
import { fetchAllListings, userListings } from "../store/listings";

const defaultInputs = {
  name: "",
  for: "",
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

  useEffect(() => {
    setNewListing({ ...item });
  }, [item]);

  const updateListing = () => {
    setLoading(true);
    const promise = databases.updateDocument(
      "madhyayuga",
      "listings",
      item.$id,
      {
        name: newListing.name,
        description: newListing.description,
        for: newListing.for,
        condition: newListing.condition,
        location: newListing.location,
      }
    );
    promise.then(
      (res) => {
        console.log(res);
        dispatch(fetchAllListings({ limit: 100 }));
        dispatch(userListings({ userId: user.$id }));
        setNewListing({ ...defaultInputs });
        setLoading(false);
        navigation.navigate("myListings");
      },
      (error) => {
        console.log("listing upload error", error);
        setLoading(false);
      }
    );
  };
  console.log(newListing);
  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent title={`Edit ${item.name}`} />
      <ScrollView style={{ width: "100%" }}>
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
            value={newListing.for}
            onChangeText={(forItem) =>
              setNewListing({ ...newListing, for: forItem })
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
          <Input
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
          />
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
          buttonStyle={{ paddingVertical: 12, borderRadius: 5 }}
          onPress={updateListing}
        />
      </ScrollView>
    </View>
  );
};

export default EditListingScreen;

const styles = StyleSheet.create({});
