import {Modal, TouchableOpacity, View} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {Card, Divider, Icon, Text, useTheme} from "@rneui/themed";
import {containerStyles} from "../helpers/objects";
import ScreenHeaderComponent from "./ScreenHeaderComponent";
import {defaultFont} from "../fontConfig/defaultFont";
import {client} from "../configs/axios";
import {ChatContext} from "../context/chatContext";
import {AuthContext} from "../context/authContext";
import {useNavigation} from "@react-navigation/native";

// import {} from ""

const MessageOptionModal = ({visible, setVisible, chat}) => {
    const {theme} = useTheme();
    const {chatRooms, getChatRooms, onlineUsers} = useContext(ChatContext);
    const {user} = useContext(AuthContext);
    const navigation = useNavigation();


    const [thisChat, setThisChat] = useState(chat);

    useEffect(() => {
        setThisChat(chat);
    }, [chat]);

    const handleDeal = async () => {
        try {
            const res = await client.patch(`/chats/messages/${chat._id}`);

            const sender = chat?.sender;
            setThisChat({...res.data.document, sender});
            res.data && getChatRooms();
        } catch (e) {
            console.log(e.response.data, "error")
        }
    }

    const handleAcceptDeal = async () => {
        try {
            const res = await client.put(`/chats/messages/${chat._id}`);

            const sender = chat?.sender;
            setThisChat({...res.data.document, sender});
            res.data && getChatRooms();
        } catch (e) {
            console.log(e.response.data, "error")
        }
    }

    return (
        <Modal visible={visible} fullScreen animationType={"slide"}>
            <View
                style={{
                    ...containerStyles,
                    backgroundColor: theme.colors.background,
                }}
            >
                <ScreenHeaderComponent title={"Back To Conversation"} hideModeToggle={true}
                                       backAction={() => {
                                           navigation.navigate("Messages", {chat: thisChat})
                                           setVisible(false)
                                       }}/>
                <View style={{paddingVertical: 0, width: "100%"}}>
                    {thisChat?.dealAccepted ? <>
                        <TouchableOpacity disabled
                                          style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                            <Icon name="shopping-bag" type="feather" size={22}/>
                            <Text style={{fontSize: 18, fontFamily: `${defaultFont}_500Medium`}}>Deal Closed</Text>
                        </TouchableOpacity>

                    </> : <>
                        {!thisChat?.dealInitiated ? (
                            <TouchableOpacity onPress={handleDeal}
                                              style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                <Icon name="shopping-bag" type="feather" size={22}/>
                                <Text style={{fontSize: 18, fontFamily: `${defaultFont}_500Medium`}}>Close Deal</Text>
                            </TouchableOpacity>
                        ) : (
                            (thisChat?.dealInitiator !== user?._id) ? (
                                <>
                                    <TouchableOpacity onPress={handleAcceptDeal}
                                                      style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                        <Icon name="shopping-bag" type="feather" size={22}/>
                                        <Text style={{fontSize: 18, fontFamily: `${defaultFont}_500Medium`}}>Accept
                                            Deal</Text>
                                    </TouchableOpacity>
                                    <Divider style={{marginVertical: 10}}/>
                                    <TouchableOpacity onPress={handleDeal}
                                                      style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                        <Icon name="cancel" type="material" size={22}/>
                                        <Text style={{fontSize: 18, fontFamily: `${defaultFont}_500Medium`}}>Reject
                                            Deal</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity disabled
                                                      style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                        <Icon name="shopping-bag" type="feather" size={22}/>
                                        <Text style={{fontSize: 18, fontFamily: `${defaultFont}_500Medium`}}>Deal
                                            Initiated</Text>
                                    </TouchableOpacity>
                                    <Divider style={{marginVertical: 10}}/>
                                    <TouchableOpacity onPress={handleDeal}
                                                      style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                        <Icon name="cancel" type="material" size={22}/>
                                        <Text style={{fontSize: 18, fontFamily: `${defaultFont}_500Medium`}}>Cancel
                                            Deal</Text>
                                    </TouchableOpacity>
                                </>
                            )
                        )}</>}


                    <Divider style={{marginVertical: 10}}/>
                    <TouchableOpacity
                        onPress={() => {
                        }}
                    >
                        <Card
                            containerStyle={{
                                // width: "100%",
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
                                alignItems: "flex-start",
                                padding: 10,
                                justifyContent: "space-between",
                                width: "100%",
                                gap: 10,
                            }}
                        >
                            <Icon
                                name="warning-outline"
                                type="ionicon"
                                size={30}
                                style={{
                                    backgroundColor: "rgb(241,15,15)",
                                    padding: 10,
                                    borderRadius: 5,
                                }}
                                color={"#fff"}
                                containerStyle={{alignSelf: "center"}}
                            />
                            <View style={{flex: 1}}>
                                <Text
                                    style={{
                                        fontFamily: `${defaultFont}_600SemiBold`,

                                        color: "#fff",
                                    }}
                                >
                                    Report
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: `${defaultFont}_400Regular`,
                                        color: "#fff",
                                        fontSize: 12,
                                    }}
                                >
                                    Report this user if you find the messages inappropriate or
                                    offensive
                                </Text>
                            </View>
                            <Icon name="arrow-right" type="octicon" color={"#fff"}/>
                        </Card>
                    </TouchableOpacity>
                </View>

            </View>

        </Modal>
    );
};

export default MessageOptionModal;
