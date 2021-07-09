import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Location from "expo-location";
import MapView from "react-native-maps";
import Polyline from "@mapbox/polyline";
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://fast-beyond-99793.herokuapp.com/api'
})

const WorkoutScreen = ({ navigation }) => {
  const [data, setData] = React.useState({
    latitude: null,
    longitude: null,
    error: null,
    coords: [],
    x: "false",
    coordLatitude: null,
    coordLongitude: null,
    mode: null,
    distance: null,
    duration: null,
    geometry: null,
    userId: null,
  });

  React.useEffect(() => {
    const getData = async () => {
      const { latitude, longitude } = await getLocation();
      const startingPoint = longitude + "," + latitude;
      const {
        mode,
        distance,
        duration,
        geometry,
        coords,
        coordLongitude,
        coordLatitude,
        userId,
      } = await getDirections(startingPoint);
      setData({
        latitude,
        longitude,
        mode,
        distance,
        duration,
        geometry,
        coords,
        coordLongitude,
        coordLatitude,
        userId,
      });
    };
    getData();
  }, []);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw Error("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (e) {
      console.error(e);
    }
  };

  const getDirections = async (startingPoint) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const jsonPref = await AsyncStorage.getItem("preferences");
      const userId = await AsyncStorage.getItem("id");
      const preferences = JSON.parse(jsonPref);
      const url = `https://fast-beyond-99793.herokuapp.com/api/directions?startingPoint=${startingPoint}&type=${preferences.type}&value=${preferences.value}&mode=${preferences.mode}`;
      let resp = await fetch(url, {
        headers: {
          "x-access-token": accessToken,
        },
      });
      let respJson = await resp.json();
      let route = respJson.routes[0];
      let points = Polyline.decode(route.geometry);
      let destination = respJson.waypoints[1].location;
      let coordinates = [];
      points.forEach((point) => {
        coordinates.push({ latitude: point[0], longitude: point[1] });
      });

      return {
        mode: preferences.mode,
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry,
        coords: coordinates,
        coordLongitude: destination[0],
        coordLatitude: destination[1],
        userId: userId,
      };
    } catch (e) {
      alert(e);
      return e;
    }
  };

  const mergeLot = () => {
    if (data.latitude != null && data.longitude != null) {
      let concatLot = data.longitude + "," + data.latitude;
      setData(
        {
          ...data,
          concat: concatLot,
        },
        () => {
          this.getDirections(concatLot, "duration", 60, "cycling");
        }
      );
    }
  };

  const save = async () => {
    if (
      !data.latitude ||
      !data.longitude ||
      !data.coordLatitude ||
      !data.coordLongitude ||
      !data.mode ||
      !data.distance ||
      !data.duration ||
      !data.geometry ||
      !data.userId
    ) {
      Alert.alert("Error!", "An error has occurred.", [{ text: "OK" }]);
      return;
    }

    const workout = {
      mode: data.mode,
      distance: data.distance,
      duration: data.duration,
      coordinates: data.geometry,
      startingPoint: data.latitude + "," + data.longitude,
      endingPoint: data.coordLatitude + "," + data.coordLongitude,
      userId: data.userId,
    };

    const accessToken = await AsyncStorage.getItem("accessToken");
    api
      .post("/workouts", workout, {
        headers: {
          "x-access-token": accessToken,
        },
      })
      .then(async (response) => {
        if (response.status === 200) {
          Alert.alert("Success", "Your workout have been saved.", [
            { text: "OK" },
          ]);
          return;
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    data.latitude &&
    data.longitude && (
      <View style={styles.map} key={data.uniqueValue}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: data.latitude,
            longitude: data.longitude,
            latitudeDelta: 1,
            longitudeDelta: 1,
          }}
        >
          {!!data.latitude && !!data.longitude && (
            <MapView.Marker
              coordinate={{
                latitude: data.latitude,
                longitude: data.longitude,
              }}
              title={"Your Location"}
            />
          )}

          {!!data.coordLatitude && !!data.coordLongitude && (
            <MapView.Marker
              coordinate={{
                latitude: data.coordLatitude,
                longitude: data.coordLongitude,
              }}
              title={"Your Destination"}
            />
          )}

          {!!data.latitude && !!data.longitude && data.x == "true" && (
            <MapView.Polyline
              coordinates={data.coords}
              strokeWidth={2}
              strokeColor="red"
            />
          )}

          <MapView.Polyline
            coordinates={data.coords}
            strokeWidth={2}
            strokeColor="red"
          />

          {!!data.latitude && !!data.longitude && data.x == "error" && (
            <MapView.Polyline
              coordinates={[
                {
                  latitude: data.latitude,
                  longitude: data.longitude,
                },
                {
                  latitude: data.cordLatitude,
                  longitude: data.cordLongitude,
                },
              ]}
              strokeWidth={2}
              strokeColor="red"
            />
          )}
        </MapView>
        
        <View
          style={{
            position: "absolute", //use absolute position to show button on top of the map
            top: "1%", //for center align
            alignSelf: "flex-end", //for align to right
          }}
        >
          <Button title="Save" onPress={() => {
            save()
          }} />
        </View>
      </View>
    )
  );
};

export default WorkoutScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: "tomato",
  },
  map: {
    flex: 1,
  },
});
