import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import * as Location from "expo-location";
import MapView from "react-native-maps";
import Polyline from "@mapbox/polyline";


const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: "tomato"
  },
  map: {
    flex: 1
  }
});

const API_KEY = ''

export default class WorkoutScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      coords: [],
      x: "false",
      cordLatitude: 48.8566969,
      cordLongitude: 2.3514616,
    };

    this.mergeLot = this.mergeLot.bind(this);
  }

  componentDidMount() {
    this.getDirections("40.1884979, 29.061018", "41.0082,28.9784");
  }

  _getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      this.setState({
        error: "Permission to access location was denied",
      });
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    this.setState({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      error: null,
    });
  };

  async getDirections(startLoc, destinationLoc) {
    try {
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${API_KEY}`
      );
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      console.log(coords)
      this.setState({ coords: coords });
      return coords;
    } catch (error) {
      alert(error);
      return error;
    }
  }

  mergeLot() {
    if (this.state.latitude != null && this.state.longitude != null) {
      let concatLot = this.state.latitude + "," + this.state.longitude;
      this.setState(
        {
          concat: concatLot,
        },
        () => {
          this.getDirections(concatLot, "43.7323492,7.4276832");
        }
      );
    }
  }

  render() {
    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.1884979,
          longitude: 29.061018,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      >
        {!!this.state.latitude && !!this.state.longitude && (
          <MapView.Marker
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
            }}
            title={"Your Location"}
          />
        )}

        {!!this.state.cordLatitude && !!this.state.cordLongitude && (
          <MapView.Marker
            coordinate={{
              latitude: this.state.cordLatitude,
              longitude: this.state.cordLongitude,
            }}
            title={"Your Destination"}
          />
        )}

        {!!this.state.latitude &&
          !!this.state.longitude &&
          this.state.x == "true" && (
            <MapView.Polyline
              coordinates={this.state.coords}
              strokeWidth={2}
              strokeColor="red"
            />
          )}

        <MapView.Polyline
          coordinates={this.state.coords}
          strokeWidth={2}
          strokeColor="red"
        />

        {!!this.state.latitude &&
          !!this.state.longitude &&
          this.state.x == "error" && (
            <MapView.Polyline
              coordinates={[
                {
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                },
                {
                  latitude: this.state.cordLatitude,
                  longitude: this.state.cordLongitude,
                },
              ]}
              strokeWidth={2}
              strokeColor="red"
            />
          )}
      </MapView>
    );
  }
}
