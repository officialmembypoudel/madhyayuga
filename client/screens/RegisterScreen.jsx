import { StyleSheet, View, Image, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
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
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { defaultFont } from "../fontConfig/defaultFont";
import homeIcon from "../assets/madhyaYugTransparent.png";
import { account, databases } from "../configs/appwrite";
import { ID } from "appwrite";
import { AuthContext } from "../context/authContext";
import { client } from "../configs/axios";

const defaultUserValue = {
  name: "",
  email: "",
  password: "",
  cPassword: "",
  phone: "",
};

const RegisterScreen = () => {
  const style = useTheme();
  const { setUser, setIsSignedIn } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const [newUser, SetNewUser] = useState(defaultUserValue);

  const handleRegister = async () => {
    // TODO add register
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
        console.log(response.data);
        navigation.navigate("VerifyOTP");
      }
    } catch (error) {
      console.log(error.response.data);
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
          <Input
            value={newUser.name}
            onChangeText={(value) => SetNewUser({ ...newUser, name: value })}
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
          />
          <Input
            value={newUser.email}
            onChangeText={(value) => SetNewUser({ ...newUser, email: value })}
            inputContainerStyle={{
              borderWidth: 2,
              borderRadius: 5,
              borderBottomWidth: 2,
              paddingHorizontal: 5,
              borderColor: theme.colors.grey4,
              backgroundColor: theme.colors.grey4,
            }}
            leftIcon={<Icon name="mail" type="feather" />}
            // errorMessage="Fuck@nigga.com"
            placeholder="email"
            keyboardType="email-address"
            containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
            inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
          />
          <Input
            value={newUser.phone}
            onChangeText={(value) => SetNewUser({ ...newUser, phone: value })}
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
          />
          <Input
            value={newUser.password}
            onChangeText={(value) =>
              SetNewUser({ ...newUser, password: value })
            }
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
          />
          <Input
            value={newUser.cPassword}
            onChangeText={(value) =>
              SetNewUser({ ...newUser, cPassword: value })
            }
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
          />
          <Button
            title="Register"
            titleStyle={{
              fontFamily: `${defaultFont}_500Medium`,
            }}
            containerStyle={{
              borderRadius: 5,
              marginVertical: 20,
            }}
            buttonStyle={{ paddingVertical: 13 }}
            onPress={handleRegister}
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
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
