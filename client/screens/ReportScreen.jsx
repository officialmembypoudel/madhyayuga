import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { containerStyles } from "../helpers/objects";
import {
  Text,
  Button,
  useThemeMode,
  useTheme,
  Icon,
  Card,
  Input,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import { Avatar } from "@rneui/base";
import { setImageQuality } from "../helpers/functions";
import { defaultFont } from "../fontConfig/defaultFont";
import { client } from "../configs/axios";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import mime from "mime";

const schema = yup.object().shape({
  contactEmail: yup
    .string()
    .required("Email is required!")
    .email("Please enter a valid email address!"),
  title: yup
    .string()
    .required("Title is required!")
    .min(3, "Title must contain at least 3 characters"),
  description: yup
    .string()
    .required("Description is required")
    .max(1000, "Description must be less than 1000 characters"),
});

const ReportScreen = ({ route }) => {
  const { theme } = useTheme();
  const { item, user, chat } = route.params;
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [contactEmail, setContactEmail] = useState("");

  console.log(user);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    resetField,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      contactEmail: "",
      title: "",
      description: "",
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedImg(result.assets[0]);
      console.log(result.assets[0]);
    }
  };

  console.log(selectedImg);
  const handleReportListing = async (data) => {
    const formData = new FormData();
    formData.append("image", {
      uri: selectedImg.uri,
      type: mime.getType(selectedImg.uri),
      name: selectedImg.uri.split("/").pop(),
    });
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (item) {
      formData.append("listing", item._id);
    } else {
      formData.append("reportedUser", user._id);
    }
    formData.append("contactEmail", data.contactEmail);
    console.log(formData);
    try {
      setLoading(true);
      const response = await client.post("/listings/reports/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data) {
        setLoading(false);
        setSelectedImg(null);
        setTitle("");
        setDescription("");
        resetField("title");
        resetField("description");
        resetField("contactEmail");
        if (user) {
          return navigation.navigate("Messages", { chat });
        }

        navigation.navigate("Item", { item });
      }
    } catch (error) {
      console.log("Failed to report");
      console.log(error.response.data);
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScreenHeaderComponent
        backAction={() =>
          item
            ? navigation.navigate("Item", { item })
            : navigation.navigate("Messages", { chat })
        }
        title={item ? "Report Listing" : "Report User"}
        hideModeToggle={false}
      />
      <Text
        style={{
          fontFamily: `${defaultFont}_500Medium`,
          fontSize: 20,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        You are Reporting
      </Text>
      <Card
        containerStyle={{
          width: "100%",
          margin: 0,
          marginBottom: 10,
          // padding: 10,
          padding: 0,
          backgroundColor: "rgba(241,15,15, 0.5)",
          borderWidth: 0,
          borderRadius: 10,
          //   width: 105,
          elevation: 1,
        }}
        wrapperStyle={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          //   justifyContent: "space-between",

          width: "100%",
          gap: 10,
        }}
      >
        <Avatar
          size={"medium"}
          source={{
            uri: setImageQuality(
              item ? item?.images[0]?.url : user?.avatar,
              30
            ),
          }}
          containerStyle={{
            elevation: 0,
            shadowOpacity: 0,
            shadowOffset: 0,
            borderWidth: 1.7,
            borderRadius: 5,
            borderColor: "#rgba(241,15,15, 1)",
            backgroundColor: "#fff",
          }}
          avatarStyle={{ borderRadius: 5, resizeMode: "contain" }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: `${defaultFont}_500Medium`,
              fontSize: 16,
              color: "#fff",
            }}
          >
            {item?.name} {user?.name}
          </Text>
          <Text
            style={{
              fontFamily: `${defaultFont}_500Medium`,
              fontSize: 14,
              color: "#fff",
            }}
          >
            {item?.userId?.name} {user?.email}
          </Text>
          <Text
            style={{
              fontFamily: `${defaultFont}_400Regular`,
              fontSize: 12,
              color: "#fff",
            }}
          >
            {item
              ? new Date(item?.createdAt).toDateString()
              : new Date(Date.now()).toDateString()}
          </Text>
        </View>
      </Card>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontFamily: `${defaultFont}_500Medium`,
                fontSize: 18,
                marginBottom: 10,
              }}
            >
              Attach Your screenshot
              <Text style={{ color: "#dc3545" }}>{" *"}</Text>
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.grey4,
                // padding: 10,
                alignSelf: "flex-start",
                borderRadius: 8,
                position: "relative",
              }}
              onPress={pickImage}
            >
              {selectedImg ? (
                <>
                  <Avatar
                    size="xlarge"
                    avatarStyle={{ borderRadius: 8 }}
                    source={{ uri: selectedImg?.uri }}
                  />
                  <TouchableOpacity
                    onPress={() => setSelectedImg(null)}
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      backgroundColor: "#fff",
                      padding: 4,
                      borderRadius: 15,
                    }}
                  >
                    <Icon name="delete" color={theme.colors.error} size={23} />
                  </TouchableOpacity>
                </>
              ) : (
                <Icon
                  name="image"
                  type="evilicon"
                  size={100}
                  style={{ margin: 10 }}
                />
              )}
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                fontFamily: `${defaultFont}_500Medium`,
                fontSize: 18,
                marginBottom: 10,
              }}
            >
              How do we contact you?
              <Text style={{ color: "#dc3545" }}>{" *"}</Text>
            </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={async (value) => {
                    onChange(value);
                    await trigger("contactEmail");
                  }}
                  inputContainerStyle={{
                    borderWidth: 2,
                    borderRadius: 5,
                    borderBottomWidth: 2,
                    paddingHorizontal: 5,
                    borderColor: theme.colors.grey4,
                    backgroundColor: theme.colors.grey4,
                  }}
                  placeholder="email, eg.: john-doe@gmail.com"
                  keyboardType="email-address"
                  containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
                  inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  autoCapitalize="none"
                  errorMessage={errors.contactEmail?.message}
                  errorStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                />
              )}
              name="contactEmail"
            />
          </View>
          <View>
            <Text
              style={{
                fontFamily: `${defaultFont}_500Medium`,
                fontSize: 18,
                marginBottom: 10,
              }}
            >
              Why do you want to report?
              <Text style={{ color: "#dc3545" }}>{" *"}</Text>
            </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={async (value) => {
                    onChange(value);
                    await trigger("title");
                  }}
                  inputContainerStyle={{
                    borderWidth: 2,
                    borderRadius: 5,
                    borderBottomWidth: 2,
                    paddingHorizontal: 5,
                    borderColor: theme.colors.grey4,
                    backgroundColor: theme.colors.grey4,
                  }}
                  placeholder="subject, eg.: offensive, hurtful "
                  containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
                  inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  autoCapitalize="none"
                  errorMessage={errors.title?.message}
                  errorStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                />
              )}
              name="title"
            />
          </View>
          <View>
            <Text
              style={{
                fontFamily: `${defaultFont}_500Medium`,
                fontSize: 18,
                marginBottom: 10,
              }}
            >
              Write a brief description of the issue.
              <Text style={{ color: "#dc3545" }}>{" *"}</Text>
            </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  multiline
                  numberOfLines={4}
                  maxLength={1000}
                  value={value}
                  onChangeText={async (value) => {
                    onChange(value);
                    await trigger("description");
                  }}
                  inputContainerStyle={{
                    borderWidth: 2,
                    borderRadius: 5,
                    borderBottomWidth: 2,
                    paddingHorizontal: 5,
                    borderColor: theme.colors.grey4,
                    backgroundColor: theme.colors.grey4,
                  }}
                  placeholder="brief descripton (upto 1000 words)"
                  containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
                  inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  autoCapitalize="none"
                  errorMessage={errors.description?.message}
                  errorStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                />
              )}
              name="description"
            />
            {/* <Input
              multiline
              numberOfLines={4}
              value={description}
              maxLength={1000}
              onChangeText={(text) => setDescription(text)}
              inputContainerStyle={{
                borderWidth: 2,
                borderRadius: 5,
                borderBottomWidth: 2,
                paddingHorizontal: 5,
                borderColor: theme.colors.grey4,
                backgroundColor: theme.colors.grey4,
              }}
              placeholder="brief descripton (upto 1000 words)"
              containerStyle={{ paddingHorizontal: 0 }}
              inputStyle={{
                fontFamily: `${defaultFont}_400Regular`,
              }}
            /> */}
          </View>
          <View style={{ width: "100%", marginTop: 20 }}>
            <Button
              loading={loading}
              title="Report"
              color="success"
              containerStyle={{
                width: "100%",
                // padding: 5,
                borderRadius: 5,
              }}
              titleStyle={{
                fontFamily: `${defaultFont}_500Medium`,
                fontSize: 18,
              }}
              buttonStyle={{ paddingVertical: 12 }}
              onPress={() => {
                handleSubmit((data) => {
                  handleReportListing(data);
                })();
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({});
