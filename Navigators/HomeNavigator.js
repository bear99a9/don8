import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AdContainer from "../Screens/Ads/AdContainer";
import SingleAd from "../Screens/Ads/SingleAd";
import AdMap from "../Screens/Ads/AdMap";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={AdContainer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Ad Detail"
        component={SingleAd}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Ad Map"
        component={AdMap}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function HomeNavigator() {
  return <MyStack />;
}
