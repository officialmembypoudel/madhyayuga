import {StyleSheet, View, Image, FlatList, Modal} from "react-native";
import React, {useEffect, useState} from "react";
import {containerStyles} from "../helpers/objects";
import {Text, Button, useThemeMode, useTheme, Icon, AirbnbRating, Rating, Input} from "@rneui/themed";
import {useNavigation} from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import {client} from "../configs/axios";
import ItemComponent from "../components/ItemComponent";
import {defaultFont} from "../fontConfig/defaultFont";

const ToReview = () => {
    const style = useTheme();
    const navigation = useNavigation();
    const [isDark, setIsDark] = useState(false);
    const {mode, setMode} = useThemeMode();
    const [toReview, setToReview] = useState(null)
    const [open, setOpen] = useState(false)
    const [selectedReview, setSelectedReview] = useState(null)

    const [rating, setRating] = useState(0)
    const [review, setReview] = useState("")

    useEffect(() => {
        const fetchToReview = async () => {
            try {
                const res = await client.get("/users/review")

                console.log(res.data.documents)
                setToReview(res.data)
            } catch (e) {
                console.log(e.response.data, "error")
            }
        }
        fetchToReview()
    }, []);


    return (
        <View
            style={{
                ...containerStyles,
                backgroundColor: style.theme.colors.background,
            }}
        >
            <ScreenHeaderComponent title="To Review" hideModeToggle={true}
                                   backAction={() => navigation.navigate("Profile")}/>

            <View>
                {toReview ? (
                    <FlatList
                        style={{width: "100%"}}
                        contentContainerStyle={{paddingBottom: 70}}
                        showsHorizontalScrollIndicator={false}
                        overScrollMode="never"
                        // horizontal={true}
                        data={toReview?.documents}
                        // keyExtractor={(item) => item.$id}
                        renderItem={({item}) => (
                            <ItemComponent item={{...item?.listing, userId: item?.reviewee}} type="column"
                                           onPress={() => {
                                               setOpen(true)
                                               setSelectedReview(item)
                                           }}/>
                        )}
                    />
                ) : null}
            </View>
            <Modal visible={open} animationType={"slide"} fullScreen>
                <View style={{
                    ...containerStyles,
                    backgroundColor: style.theme.colors.background,
                }}>
                    <ScreenHeaderComponent title={`Review ${selectedReview?.reviewee?.name}`} hideModeToggle={true}
                                           backAction={() => {
                                               setOpen(false)
                                               setReview("")
                                               setRating(0)
                                           }}/>

                    <Text>Note: You are reviewing for {selectedReview?.listing?.name}</Text>
                    <View style={{flexDirection: "row", alignItems: "flex-end", gap: 10}}>
                        <Text style={{fontFamily: `${defaultFont}_500Medium`, fontSize: 18, marginBottom: 3}}>Provide
                            Your Rating</Text>
                        <AirbnbRating defaultRating={rating} onFinishRating={(value) => setRating(value)}
                                      reviewColor={"red"}
                                      reviewSize={0.0001}
                                      size={25}/>

                    </View>
                    <View style={{width: "100%"}}>
                        <Text style={{
                            fontFamily: `${defaultFont}_500Medium`,
                            fontSize: 18,
                            marginBottom: 5,
                            marginTop: 10
                        }}>Provide
                            Your Review</Text>
                        <Input
                            multiline
                            numberOfLines={4}
                            maxLength={200}
                            value={review}

                            onChangeText={(value) => setReview(value)}

                            inputContainerStyle={{
                                borderWidth: 2,
                                borderRadius: 5,
                                borderBottomWidth: 2,
                                paddingHorizontal: 5,
                                borderColor: style.theme.colors.grey4,
                                backgroundColor: style.theme.colors.grey4,
                            }}
                            placeholder="your review (upto 200 words)"
                            containerStyle={{paddingHorizontal: 0, marginBottom: 5}}
                            inputStyle={{fontFamily: `${defaultFont}_400Regular`}}

                        />
                    </View>

                    <View style={{width: "100%", marginTop: 20}}>
                        <Button
                            // loading={loading}
                            title="Review"
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
                            buttonStyle={{paddingVertical: 12}}
                            onPress={() => {

                            }}
                            disabled={rating <= 0 || !review}
                        />
                    </View>

                </View>
            </Modal>
        </View>
    );
};

export default ToReview;

const styles = StyleSheet.create({});
