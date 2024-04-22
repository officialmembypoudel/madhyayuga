import { StyleSheet, View, Image, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { containerStyles, creditPrice } from "../helpers/objects";
import {
  Text,
  Button,
  useThemeMode,
  useTheme,
  Icon,
  Card,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import ItemComponent from "../components/ItemComponent";
import { defaultFont } from "../fontConfig/defaultFont";
import { AuthContext } from "../context/authContext";
import { client } from "../configs/axios";
import { useDispatch } from "react-redux";
import { userListings } from "../store/listings";

const daysCredit = [
  {
    days: 1,
    credit: 1,
  },
  {
    days: 10,
    credit: 8,
  },
];

const AddCreditToListingScreen = ({ route }) => {
  const style = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const { item } = route.params;
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const dispatch = useDispatch();

  const handleAddCredit = async () => {
    try {
      setLoading(true);
      const response = await client.patch(`/listings/${item._id}/add-credit`, {
        credit: selectedCredit?.credit,
        days: selectedCredit?.days,
      });
      response.data && dispatch(userListings());
      response.data &&
        alert(
          `Listing boosted successfully for ${
            selectedCredit.days > 1
              ? `${selectedCredit.days} days`
              : `${selectedCredit.days} day`
          }`
        );
      response.data && navigation.navigate("myListings");
      response.data && setSelectedCredit(null);
      response.data && setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response.data);
      Alert.alert(error.response.data.message);
    }
  };

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent
        title="Boost Listing"
        hideModeToggle={true}
        backAction={() => {
          navigation.navigate("myListings");
        }}
      />
      <Text
        style={{
          fontFamily: `${defaultFont}_600SemiBold`,
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        You are boosting{` ${item?.name}`}
      </Text>
      <View style={{ width: "100%" }}>
        <ItemComponent item={item} type={"column"} onPress={() => {}} />
      </View>

      <Text
        style={{
          fontFamily: `${defaultFont}_500Medium`,
          fontSize: 18,
          marginVertical: 10,
        }}
      >
        Select a plan to boost your listing
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        {[
          ...daysCredit,
          { days: user?.credit * 0.3 + user?.credit, credit: user?.credit },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (item.credit === selectedCredit?.credit) {
                return setSelectedCredit(null);
              }
              setSelectedCredit(item);
            }}
          >
            <Card
              containerStyle={{
                margin: 0,
                padding: 0,
                borderRadius: 10,
                borderColor:
                  item.credit === selectedCredit?.credit
                    ? style.theme.colors.black
                    : style.theme.colors.grey4,
                width: 110,
                height: 120,
                backgroundColor: style.theme.colors.background,
              }}
              wrapperStyle={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "auto",
                  textAlign: "center",
                  fontFamily: `${defaultFont}_500Medium`,
                  fontSize: 18,
                }}
              >
                {item.days} {item.days > 1 ? "Days" : "Day"}
              </Text>
              <View
                style={{
                  width: "100%",
                  marginTop: "auto",
                  backgroundColor:
                    item.credit === selectedCredit?.credit
                      ? style.theme.colors.black
                      : style.theme.colors.grey4,
                  borderBottomLeftRadius: 9,
                  borderBottomRightRadius: 9,
                  paddingVertical: 5,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: `${defaultFont}_500Medium`,
                    fontSize: 16,
                    color:
                      item.credit === selectedCredit?.credit
                        ? style.theme.colors.white
                        : style.theme.colors.black,
                  }}
                >
                  {item.credit} Credits
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
      {selectedCredit ? (
        <View
          style={{
            width: "100%",
            marginVertical: 20,
            marginTop: "auto",
            marginBottom: 90,
          }}
        >
          <Button
            disabled={!selectedCredit}
            color="success"
            loading={loading}
            title={`Boost Listing For ${
              selectedCredit.days > 1
                ? `${selectedCredit.days} days`
                : `${selectedCredit.days} day`
            }`}
            buttonStyle={{ paddingVertical: 13 }}
            onPress={handleAddCredit}
          />
        </View>
      ) : null}
    </View>
  );
};

export default AddCreditToListingScreen;

const styles = StyleSheet.create({});
