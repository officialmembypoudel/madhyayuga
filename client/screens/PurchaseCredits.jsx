import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import {
  CardField,
  useStripe,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import { client } from "../configs/axios";
import { defaultFont } from "../fontConfig/defaultFont";
import { AuthContext } from "../context/authContext";

const PurchaseCredit = () => {
  const style = useTheme();
  const navigation = useNavigation();
  const { user, getUser } = useContext(AuthContext);
  const cardFieldRef = React.useRef();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();
  const [selectedCredit, setSelectedCredit] = useState(null);

  const fetchIntentClientSecret = async () => {
    const response = await client.post(
      "/create-payment-intent",
      {
        amount: selectedCredit?.price * 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { clientSecret, error } = await response.data;

    return { clientSecret, error };
  };

  const handlePayPress = async () => {
    if (!cardDetails?.complete) {
      console.log("Please enter complete card details");
      alert("Please enter complete card details");
      return;
    }
    const billingDetails = {
      email: user.email,
      phone: user.phone,
      name: user.name,
    };

    try {
      const { clientSecret, error } = await fetchIntentClientSecret();
      if (error) {
        console.log("Error fetching client secret", error);
        return;
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          type: "Card",
          paymentMethodData: {
            billingDetails,
          },
          paymentMethodType: "Card",
        });
        if (error) {
          console.log("Error confirming payment", error.message);
          alert(`Error confirming payment: ${error.message}`);
        } else {
          console.log(
            "Payment confirmed",
            paymentIntent?.paymentMethod.billingDetails
          );
          setCardDetails(null);
          cardFieldRef.current.clear();
          const response = await client.patch("/users/add-credit", {
            credit: selectedCredit.credits,
            amount: paymentIntent.amount / 100,
            description: paymentIntent.id,
          });
          response.data && getUser();
          alert("Payment Was Successful!");
          setSelectedCredit(null);
        }
      }
    } catch (error) {
      console.log("Error fetching client secret", error.response.data);
      alert(
        `Error confirming payment: ${
          error.response.data.message ?? error.message
        }`
      );
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
        title="Purchase Credits"
        hideModeToggle
        backAction={() => {
          setSelectedCredit(null);
          setCardDetails(null);
          cardFieldRef?.current?.clear();
          navigation.navigate("Profile");
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        {creditPrice.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (item.price === selectedCredit?.price) {
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
                  item.price === selectedCredit?.price
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
                ${item.price}
              </Text>
              <View
                style={{
                  width: "100%",
                  marginTop: "auto",
                  backgroundColor:
                    item.price === selectedCredit?.price
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
                      item.price === selectedCredit?.price
                        ? style.theme.colors.white
                        : style.theme.colors.black,
                  }}
                >
                  {item.credits} Credits
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
      {selectedCredit ? (
        <View style={{ width: "100%" }}>
          <Text
            style={{
              fontFamily: `${defaultFont}_500Medium`,
              fontSize: 18,
              marginVertical: 20,
            }}
          >
            Enter Your Card Details
          </Text>
          <CardField
            ref={cardFieldRef}
            postalCodeEnabled={false}
            placeholder={{
              number: "4242 4242 4242 4242",
            }}
            cardStyle={{
              backgroundColor: style.theme.colors.grey4,
              textColor: style.theme.colors.black,
            }}
            style={{
              width: "100%",
              height: 50,
              marginBottom: 30,
            }}
            onCardChange={(cardDetails) => {
              setCardDetails(cardDetails);
            }}
          />
          <Button
            loading={loading}
            title={"Pay"}
            onPress={handlePayPress}
            buttonStyle={{ paddingVertical: 13 }}
          />
        </View>
      ) : (
        <View style={{ width: "100%", marginTop: 20 }}>
          <Text
            style={{
              fontFamily: `${defaultFont}_400Regular`,
            }}
          >
            ✔ Select a plan you see the fitest.
          </Text>

          <Text
            style={{
              fontFamily: `${defaultFont}_400Regular`,
            }}
          >
            ✔ You can purchase credits to use for your listings.
          </Text>
          <Text
            style={{
              fontFamily: `${defaultFont}_400Regular`,
            }}
          >
            ✔ The credits will be used to promote your listings.
          </Text>
          <Text
            style={{
              fontFamily: `${defaultFont}_400Regular`,
              color: style.theme.colors.error,
            }}
          >
            {"✘    You can't refund the credits once purchased."}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PurchaseCredit;

const styles = StyleSheet.create({});
