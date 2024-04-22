import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useState } from "react";
import { containerStyles } from "../helpers/objects";
import {
  Text,
  Button,
  useThemeMode,
  useTheme,
  Icon,
  Card,
  Avatar,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { defaultFont } from "../fontConfig/defaultFont";
import { AuthContext } from "../context/authContext";
import profileImg from "../assets/profile.png";
import { client } from "../configs/axios";
import mime from "mime";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";

const AddProfilePhoto = ({ route }) => {
  const style = useTheme();
  const navigation = useNavigation();
  const { user, setUser, setIsSignedIn } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const { header } = route.params;

  console.log(user);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImg(result.assets[0]);
      console.log(result.assets[0]);
    }
  };

  const handleAddImage = async () => {
    const formData = new FormData();
    formData.append("avatar", {
      uri: selectedImg.uri,
      // uri: selectedImg.replace("file://", ""),
      type: mime.getType(selectedImg.uri),
      name: selectedImg.uri.split("/").pop(),
    });
    console.log(formData);
    try {
      setLoading(true);
      const response = await client.post("/register/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data) {
        setLoading(false);
        setUser(response.data.user);
        setSelectedImg(null);
        setIsSignedIn(true);
        if (header) {
          navigation.navigate("Profile");
        }
      }
    } catch (error) {
      console.log("Failed to add photo");
      console.log(error.response.data);
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      {header ? (
        <ScreenHeaderComponent
          title={"Edit Profile Image"}
          hideModeToggle={true}
          backAction={() => {
            navigation.navigate("Profile");
            setSelectedImg(null);
          }}
        />
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => {}}
            style={{
              flexDirection: "row",
              alignItems: "center",
              // marginBottom: 20,
            }}
          >
            <Text
              h4
              h4Style={{
                fontFamily: `${defaultFont}_600SemiBold`,
                fontWeight: "600",
              }}
            >
              Add Photo
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ width: "100%", justifyContent: "space-between", flex: 1 }}>
        <View>
          <Text
            style={{
              fontFamily: `${defaultFont}_400Regular`,
              fontSize: 15,
              marginBottom: 5,
            }}
          >
            {header
              ? `Hello, ${user.name}! Select another profile photo to continue.`
              : `Hello, ${user.name}! Add a profile photo to continue.`}
          </Text>
        </View>
        {header ? (
          <Avatar
            size={"xlarge"}
            source={{ uri: selectedImg ? selectedImg.uri : user.avatar.url }}
            rounded
            containerStyle={{
              alignSelf: "center",
              elevation: 0,
              borderRadius: 80,
              borderWidth: 1,
              borderColor: style.theme.colors.primary,
              padding: 0,
              backgroundColor: style.theme.colors.grey3,
            }}
            imageProps={{
              style: {
                width: "100%",
                margin: 0,
                padding: 0,
              },
            }}
            onPress={pickImage}
          >
            <Avatar.Accessory
              size={30}
              color={"rgb(245, 241, 237)"}
              iconProps={{
                name: "camera",
              }}
              style={{
                marginBottom: 15,
                backgroundColor: style.theme.colors.primary,
                marginRight: 2,
              }}
              onPress={pickImage}
            />
          </Avatar>
        ) : (
          <Avatar
            size={"xlarge"}
            source={selectedImg ? { uri: selectedImg.uri } : profileImg}
            rounded
            containerStyle={{
              alignSelf: "center",
              elevation: 0,
              borderRadius: 80,
              borderWidth: 1,
              borderColor: style.theme.colors.primary,
              padding: 0,
              backgroundColor: style.theme.colors.grey3,
            }}
            imageProps={{
              style: {
                width: "100%",
                margin: 0,
                padding: 0,
              },
            }}
            onPress={pickImage}
          >
            <Avatar.Accessory
              size={30}
              color={"rgb(245, 241, 237)"}
              iconProps={{
                name: "camera",
              }}
              style={{
                marginBottom: 15,
                backgroundColor: style.theme.colors.primary,
                marginRight: 2,
              }}
              onPress={pickImage}
            />
          </Avatar>
        )}
        <Button
          loading={loading}
          disabled={!selectedImg}
          title="Add Photo"
          titleStyle={{
            fontFamily: `${defaultFont}_500Medium`,
          }}
          containerStyle={{
            borderRadius: 5,
            marginBottom: header ? 90 : 30,
            marginVertical: 30,
          }}
          buttonStyle={{ paddingVertical: 13 }}
          onPress={handleAddImage}
          color="primary"
        />
      </View>
    </View>
  );
};

export default AddProfilePhoto;

const styles = StyleSheet.create({});
