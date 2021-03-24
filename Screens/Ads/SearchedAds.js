import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Content, Left, Body, ListItem, Thumbnail, Text } from "native-base";

let { width } = Dimensions.get("screen");

const SearchedAd = (props) => {
  const { adsFiltered } = props;
  return (
    <Content style={{ width: width }}>
      {adsFiltered.length > 0 ? (
        adsFiltered.map((item) => (
          <ListItem
            onPress={() => {
              props.navigation.navigate("Ad Map", { item: item });
            }}
            key={item.id}
            avatar
          >
            <Left>
              <Thumbnail
                source={{
                  uri: item.image
                    ? item.image
                    : "https://images.unsplash.com/photo-1514030849962-49ac486d3d20?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1450&q=80 ",
                }}
              />
            </Left>
            <Body>
              <Text>{item.charityName}</Text>
              <Text>{item.description}</Text>
            </Body>
          </ListItem>
        ))
      ) : (
        <View style={StyleSheet.center}>
          <Text style={{ alignSelf: "center" }}>
            No adverts match the selected criteria
          </Text>
        </View>
      )}
    </Content>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchedAd;
