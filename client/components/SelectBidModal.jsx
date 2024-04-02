import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Text, useTheme } from "@rneui/themed";
import { containerStyles } from "../helpers/objects";
import { useDispatch, useSelector } from "react-redux";
import {
  addBid,
  fetchBids,
  getUserListings,
  userListings,
} from "../store/listings";
import ItemComponent from "./ItemComponent";
import BidItemsCard from "./BidItemsCard";
import { defaultFont } from "../fontConfig/defaultFont";
import { NormalDataTextComponent } from "../screens/ItemDisplayScreen";

const SelectBidModal = ({ item, visible, setVisible, handleBidModal }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const myListings = useSelector(getUserListings);
  const [selectedBid, setSelectedBid] = useState(null);

  useEffect(() => {
    dispatch(userListings());
  }, []);

  const handleDone = () => {
    dispatch(addBid({ listingId: item?._id, forId: selectedBid?._id }));
    handleBidModal();
    setSelectedBid(null);
    dispatch(fetchBids(item?._id));
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View
          style={{
            ...containerStyles,
            paddingTop: 0,
            marginTop: 100,
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {selectedBid && (
              <Button
                type="clear"
                title="Done"
                titleStyle={{
                  fontSize: 15,
                  fontFamily: `${defaultFont}_500Medium`,
                }}
                onPress={handleDone}
              />
            )}
            <Button
              type="clear"
              title="Close"
              titleStyle={{
                fontSize: 15,
                fontFamily: `${defaultFont}_500Medium`,
              }}
              onPress={() => {
                setSelectedBid(null);
                handleBidModal();
              }}
              containerStyle={{ marginLeft: "auto" }}
            />
          </View>

          <View style={{ paddingBottom: 5 }}>
            <NormalDataTextComponent
              title={"Select Your Bid"}
              text={""}
              noSemicolon={true}
            />
          </View>
          {myListings && (
            <FlatList
              style={{ width: "100%" }}
              contentContainerStyle={{ paddingBottom: 70 }}
              showsHorizontalScrollIndicator={false}
              overScrollMode="never"
              // horizontal={true}
              data={myListings}
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedBid(item)}
                  style={{ width: "100%", padding: 1 }}
                >
                  <BidItemsCard
                    selectedBid={selectedBid}
                    selection
                    item={{ ...item }}
                    showUserName={false}
                    hideUserName={true}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SelectBidModal;
