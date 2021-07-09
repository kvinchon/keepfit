import React, { Component } from "react";
import {
  Button,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import MapView from "react-native-maps";
import Polyline from "@mapbox/polyline";

const Separator = () => <View style={styles.separator} />;

const api = axios.create({
  baseURL: "https://fast-beyond-99793.herokuapp.com/api",
});

const Home = ({ navigation }) => {
  const [data, setData] = React.useState({
    workouts: [],
  });

  React.useEffect(() => {
    const getData = async () => {
      const userId = await AsyncStorage.getItem("id");
      const accessToken = await AsyncStorage.getItem("accessToken");
      api
        .get("/users/" + userId + "/workouts", {
          headers: {
            "x-access-token": accessToken,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let workouts = [];
            response.data.forEach((workout) => {
              let time = workout.duration;
              let hours = Math.floor(time / 3600);
              time = time - hours * 3600;
              let minutes = Math.floor(time / 60);

              if (hours > 0) {
                time = hours + " h " + minutes + " min";
              } else if (minutes > 0) {
                time = minutes + " min";
              }

              workout.duration = time;
              workout.distance = workout.distance / 1000;

              let startingPoint = workout.startingPoint.split(",");
              let endingPoint = workout.endingPoint.split(",");
              workout.latitude = parseFloat(startingPoint[0]);
              workout.longitude = parseFloat(startingPoint[1]);
              workout.coordLatitude = parseFloat(endingPoint[0]);
              workout.coordLongitude = parseFloat(endingPoint[1]);

              let points = Polyline.decode(workout.coordinates);
              let coordinates = [];
              points.forEach((point) => {
                coordinates.push({ latitude: point[0], longitude: point[1] });
              });
              workout.coords = coordinates;
              workout.createdAt = moment(workout.createdAt).format("MMMM Do");

              workouts.push(workout);
            });
            setData({ workouts });
          }
        });
    };
    getData();
  }, []);

  return (
    data.workouts && (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.map}>
          {data.workouts.map((item, key) => (
            <View key={key} style={(styles.map, { height: 300 })}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                  latitudeDelta: 1,
                  longitudeDelta: 1,
                }}
              >
                {!!item.latitude && !!item.longitude && (
                  <MapView.Marker
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}
                    title={"Your Location"}
                  />
                )}

                {!!item.coordLatitude && !!item.coordLongitude && (
                  <MapView.Marker
                    coordinate={{
                      latitude: item.coordLatitude,
                      longitude: item.coordLongitude,
                    }}
                    title={"Your Destination"}
                  />
                )}

                {!!item.latitude && !!item.longitude && (
                  <MapView.Polyline
                    coordinates={item.coords}
                    strokeWidth={2}
                    strokeColor="red"
                  />
                )}

                <MapView.Polyline
                  coordinates={item.coords}
                  strokeWidth={2}
                  strokeColor="red"
                />
              </MapView>
              <View style={styles.infos}>
                <View style={styles.textView}>
                  <Text style={styles.textTitle}>Date</Text>
                  <Text style={styles.textTitle}>Mode</Text>
                  <Text style={styles.textTitle}>Duration</Text>
                  <Text style={styles.textTitle}>Distance</Text>
                </View>
                <View style={styles.textView}>
                  <Text style={styles.text}>{item.createdAt}</Text>
                  <Text style={styles.text}>{item.mode}</Text>
                  <Text style={styles.text}>{item.duration}</Text>
                  <Text style={styles.text}>{item.distance.toFixed(2)} km</Text>
                </View>
              </View>

              <Separator />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    )
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  separator: {
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  map: {
    flex: 1,
  },
  textView: {
    fontSize: 42,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  infos: {
    backgroundColor: "#05375a",
    paddingVertical: 10,
  },
  textTitle: {
    color: "#fff",
    fontSize: 12,
    width: "20%",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    width: "20%",
  },
});
