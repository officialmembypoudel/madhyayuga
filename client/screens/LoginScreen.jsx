import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
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
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import { defaultFont } from "../fontConfig/defaultFont";
import homeIcon from "../assets/madhyaYugTransparent.png";
import { AuthContext } from "../context/authContext";

const LoginScreen = () => {
  const style = useTheme();
  const auth = useContext(AuthContext);
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  // const { mode, setMode } = useThemeMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = auth;

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
            Login Now.
          </Text>
        </View>
        <View style={{ width: "100%", alignSelf: "center" }}>
          <Input
            value={email}
            onChangeText={(email) => setEmail(email)}
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
            autoCapitalize="none"
          />
          <Input
            value={password}
            onChangeText={(password) => setPassword(password)}
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
          />
          <Button
            title="Login"
            titleStyle={{
              fontFamily: `${defaultFont}_500Medium`,
            }}
            containerStyle={{
              borderRadius: 5,
              marginVertical: 20,
            }}
            buttonStyle={{ paddingVertical: 13 }}
            onPress={() => {
              login(email, password);
              console.log("navigate to Home screen");
            }}
          />
        </View>
        {/* {user?.name && <Text>{user?.name}</Text>} */}
        <View style={{ alignSelf: "center", marginBottom: 50 }}>
          <Button
            title={"Don't Have an Account? Register now"}
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
            icon={<Icon name="chevron-forward" type="ionicon" size={18} />}
            iconPosition="right"
            onPress={() => {
              navigation.navigate("Register");
              console.log("navigate to Register screen");
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
