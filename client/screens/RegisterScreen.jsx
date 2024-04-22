import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useContext, useState } from "react";
import { containerStyles, phoneRegExp } from "../helpers/objects";
import {
  makeStyles,
  Text,
  Button,
  useThemeMode,
  useTheme,
  SearchBar,
  Icon,
  Input,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { defaultFont } from "../fontConfig/defaultFont";
import homeIcon from "../assets/madhyaYugTransparent.png";
import { account, databases } from "../configs/appwrite";
import { ID } from "appwrite";
import { AuthContext } from "../context/authContext";
import { client } from "../configs/axios";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "../context/Notification";

const defaultUserValue = {
  name: "",
  email: "",
  password: "",
  cPassword: "",
  phone: "",
};
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required!")
    .email("Please enter a valid email address!"),
  password: yup
    .string()
    .required("Password is required!")
    .min(8, "Password must contain at least 8 characters"),
  name: yup.string().required("Name is required!"),
  phone: yup
    .string()
    .required("Phone Number is required!")
    .matches(phoneRegExp, "Phone number is not valid")
    .min(9, "Phone number is not valid")
    .max(10, "Phone number is not valid"),
  cPassword: yup
    .string()
    .required("please confirm your password!")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const RegisterScreen = () => {
  const style = useTheme();
  const { setUser, setIsSignedIn, sendDevicePushTokenToServer } =
    useContext(AuthContext);
  const { expoPushToken } = useNotification();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  // const [newUser, SetNewUser] = useState(defaultUserValue);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultUserValue,
  });

  const handleRegister = async (newUser) => {
    // TODO add register logic
    setLoading(true);
    try {
      const response = await client.post(
        "/register",
        {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          phone: newUser.phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.user) {
        setUser(response.data.user);
        if (expoPushToken) {
          const { user } = await sendDevicePushTokenToServer();
          if (user) {
            setUser(user);
          }
        }
        console.log(response.data);
        navigation.navigate("VerifyOTP");
        setLoading(false);
      }
    } catch (error) {
      console.log("Failed to register");
      console.log(error.response.data);
      setErrorMessage(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
        justifyContent: "space-around",
      }}
    >
      {/* <ScreenHeaderComponent title="Login" /> */}
      <ScrollView
        style={{ width: "100%", flex: 1 }}
        contentContainerStyle={{ justifyContent: "center", flex: 1 }}
      >
        <KeyboardAvoidingView behavior="padding">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 25,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#f0f0f0",
                alignSelf: "flex-start",
                padding: 4,
                borderRadius: 25,
                elevation: 2,
                margin: 1,
              }}
            >
              <Image
                source={homeIcon}
                style={{
                  height: 40,
                  resizeMode: "contain",
                  width: 40,
                }}
              />
            </View>
            <Text
              h3
              h3Style={{
                // color: "#dc3545",
                fontFamily: `${defaultFont}_700Bold`,
                fontWeight: "600",
                fontSize: 35,
                marginLeft: 10,
              }}
            >
              Madhyayuga
            </Text>
          </View>
          <View style={{ marginVertical: 20 }}>
            <Text
              h3
              h3Style={{
                color: "#dc3545",
                fontFamily: `${defaultFont}_700Bold`,
                fontWeight: "600",
              }}
            >
              Hey,
            </Text>
            <Text
              h3
              h3Style={{
                fontFamily: `${defaultFont}_700Bold`,
                fontWeight: "600",
              }}
            >
              Register Now.
            </Text>
          </View>
          <View style={{ width: "100%", alignSelf: "center" }}>
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
                    await trigger("name");
                    setErrorMessage(null);
                  }}
                  inputContainerStyle={{
                    borderWidth: 2,
                    borderRadius: 5,
                    borderBottomWidth: 2,
                    paddingHorizontal: 5,
                    borderColor: theme.colors.grey4,
                    backgroundColor: theme.colors.grey4,
                  }}
                  leftIcon={<Icon name="person" type="octicons" />}
                  // errorMessage="Fuck@nigga.com"
                  placeholder="full name"
                  // keyboardType="name-phone-pad"
                  containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
                  inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  errorMessage={errors.name?.message}
                />
              )}
              name="name"
            />

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
                    await trigger("email");
                    setErrorMessage(null);
                  }}
                  inputContainerStyle={{
                    borderWidth: 2,
                    borderRadius: 5,
                    borderBottomWidth: 2,
                    paddingHorizontal: 5,
                    borderColor: theme.colors.grey4,
                    backgroundColor: theme.colors.grey4,
                  }}
                  leftIcon={<Icon name="mail" type="feather" />}
                  placeholder="email"
                  keyboardType="email-address"
                  containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
                  inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  autoCapitalize="none"
                  errorMessage={errors.email?.message}
                  errorStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                />
              )}
              name="email"
            />
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
                    await trigger("phone");
                    setErrorMessage(null);
                  }}
                  inputContainerStyle={{
                    borderWidth: 2,
                    borderRadius: 5,
                    borderBottomWidth: 2,
                    paddingHorizontal: 5,
                    borderColor: theme.colors.grey4,
                    backgroundColor: theme.colors.grey4,
                  }}
                  leftIcon={<Icon name="phone" type="feather" />}
                  // errorMessage="Fuck@nigga.com"
                  placeholder="phone"
                  keyboardType="phone-pad"
                  containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
                  inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  errorMessage={errors.phone?.message}
                />
              )}
              name="phone"
            />

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
                    await trigger("password");
                    setErrorMessage(null);
                  }}
                  inputContainerStyle={{
                    borderWidth: 2,
                    borderRadius: 5,
                    borderBottomWidth: 2,
                    borderColor: theme.colors.grey4,
                    backgroundColor: theme.colors.grey4,
                    paddingHorizontal: 5,
                  }}
                  leftIcon={<Icon name="lock" type="feather" />}
                  placeholder="password"
                  // errorMessage="incorrect password"
                  containerStyle={{ paddingHorizontal: 0 }}
                  inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  errorMessage={errors.password?.message}
                  errorStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                />
              )}
              name="password"
            />
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
                    await trigger("cPassword");
                    setErrorMessage(null);
                  }}
                  inputContainerStyle={{
                    borderWidth: 2,
                    borderRadius: 5,
                    borderBottomWidth: 2,
                    borderColor: theme.colors.grey4,
                    backgroundColor: theme.colors.grey4,
                    paddingHorizontal: 5,
                  }}
                  leftIcon={<Icon name="lock" type="feather" />}
                  placeholder="confirm password"
                  // errorMessage="incorrect password"
                  containerStyle={{ paddingHorizontal: 0 }}
                  inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  errorMessage={errors.cPassword?.message}
                  errorStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                />
              )}
              name="cPassword"
            />
            {errorMessage ? (
              <Text
                style={{
                  fontFamily: `${defaultFont}_400Regular`,
                  color: style.theme.colors.error,
                }}
              >
                {errorMessage}
              </Text>
            ) : null}
            <Button
              loading={loading}
              title="Register"
              titleStyle={{
                fontFamily: `${defaultFont}_500Medium`,
              }}
              containerStyle={{
                borderRadius: 5,
                marginVertical: 20,
              }}
              buttonStyle={{ paddingVertical: 13 }}
              onPress={() => handleSubmit(handleRegister)()}
              color="success"
            />
          </View>
          <View style={{ alignSelf: "center", marginBottom: 50 }}>
            <Button
              title={"Have an Account? Login Now."}
              titleStyle={{
                color: style.theme.colors.black,
                fontFamily: `${defaultFont}_500Medium`,
              }}
              type="clear"
              radius={10}
              style={{ alignSelf: "center" }}
              buttonStyle={{
                borderColor: style.theme.colors.black,
              }}
              containerStyle={{}}
              icon={<Icon name="chevron-back" type="ionicon" size={18} />}
              iconPosition="left"
              onPress={() => {
                navigation.navigate("Login");
                console.log("navigate to login screen");
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
