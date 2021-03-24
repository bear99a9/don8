import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView from "react-native-maps";
import * as Permissions from "expo-permissions";
import Polyline from "@mapbox/polyline";
import Constants from "expo-constants";

const locations = require("./location.json");
export default class Map extends React.Component {
  state = {
    latitude: null,
    longitude: null,
    locations: locations,
  };

  async componentDidMount() {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);

    if (status !== "granted") {
      const response = await Permissions.askAsync(Permissions.LOCATION);
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) =>
        this.setState({ latitude, longitude }, this.mergeCoords),
      (error) => console.log("Error:", error)
    );

    const {
      locations: [sampleLocation],
    } = this.state;

    this.setState(
      {
        desLatitude: sampleLocation.lat,
        desLongitude: sampleLocation.lng,
      },
      this.mergeCoords
    );
  }

  mergeCoords = () => {
    const { latitude, longitude, desLatitude, desLongitude } = this.state;

    const hasStartAndEnd = latitude !== null && desLatitude !== null;
    if (hasStartAndEnd) {
      const concatStart = `${latitude},${longitude}`;
      const concatEnd = `${desLatitude},${desLongitude}`;
      this.getDirections(concatStart, concatEnd);
    }
  };

  async getDirections(startLoc, destinationLoc) {
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${api_key}`
      );
      const respJson = await resp.json();
      if (respJson.routes.length > 0) {
        const points = Polyline.decode(
          respJson.routes[0].overview_polyline.points
        );
        const coords = points.map((point, index) => {
          return {
            latitude: point[0],
            longitude: point[1],
          };
        });
        this.setState({ coords });
        console.log(coords);
      }
      return;
    } catch (error) {
      alert(error);
    }
  }

  render() {
    const { latitude, longitude, coords } = this.state;
    console.log(latitude, longitude, coords && coords.length);
    if (latitude) {
      return (
        <MapView
          showsUserLocation
          style={{ flex: 1 }}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <MapView.Polyline
            strokeWidth={6}
            strokeColor="#ff0000"
            coordinates={coords || []}
          />
        </MapView>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>We need your permission!</Text>
      </View>
    );
  }
}
