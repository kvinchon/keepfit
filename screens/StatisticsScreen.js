import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Separator = () => <View style={styles.separator} />;

const api = axios.create({
  baseURL: "https://fast-beyond-99793.herokuapp.com/api",
});

const StatisticsScreen = ({ navigation }) => {
  const [data, setData] = React.useState({
    stats: {},
  });

  const toTime = (duration) => {
    let time = duration;
    let hours = Math.floor(time / 3600);
    time = time - hours * 3600;
    let minutes = Math.floor(time / 60);

    if (hours > 0) {
      time = hours + " h " + minutes + " min";
    } else if (minutes > 0) {
      time = minutes + " min";
    }

    return time
  }

  const toDistance = (distance) => {
    return (distance / 1000).toFixed(2) + ' km'
  }

  React.useEffect(() => {
    const getData = async () => {
      const userId = await AsyncStorage.getItem("id");
      const accessToken = await AsyncStorage.getItem("accessToken");
      api
        .get("/users/" + userId + "/stats", {
          headers: {
            "x-access-token": accessToken,
          },
        })
        .then(async (response) => {
          if (response.status === 200) {
            let stats;

            stats = response.data[0];
            stats.totalDuration = await toTime(stats.totalDuration)
            stats.maxDuration = await toTime(stats.maxDuration)
            stats.avgDuration = await toTime(stats.avgDuration)

            stats.totalDistance = await toDistance(stats.totalDistance)
            stats.maxDistance = await toDistance(stats.maxDistance)
            stats.avgDistance = await toDistance(stats.avgDistance)

            setData({ stats });
          }
        });
    };
    getData();
  }, []);

  return (
    data.stats && (
      <View>
        <View style={styles.view}>
          <Text style={styles.title}>Duration</Text>
          <Separator />
          <View style={styles.statsView}>
            <Text style={styles.statsTitle}>Total</Text>
            <Text style={styles.statsTitle}>Longest</Text>
            <Text style={styles.statsTitle}>Average</Text>
          </View>
          <View style={styles.statsView}>
            <Text style={styles.stats}>{data.stats.totalDuration}</Text>
            <Text style={styles.stats}>{data.stats.maxDuration}</Text>
            <Text style={styles.stats}>{data.stats.avgDuration}</Text>
          </View>
        </View>
        <View style={styles.view}>
          <Text style={styles.title}>Distance</Text>
          <Separator />
          <View style={styles.statsView}>
            <Text style={styles.statsTitle}>Total</Text>
            <Text style={styles.statsTitle}>Longest</Text>
            <Text style={styles.statsTitle}>Average</Text>
          </View>
          <View style={styles.statsView}>
            <Text style={styles.stats}>{data.stats.totalDistance}</Text>
            <Text style={styles.stats}>{data.stats.maxDistance}</Text>
            <Text style={styles.stats}>{data.stats.avgDistance}</Text>
          </View>
        </View>
      </View>
    )
  );
};

export default StatisticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#05375a",
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 10,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statsView: {
    fontSize: 42,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  statsTitle: {
    color: "#05375a",
    fontSize: 16,
    width: "30%"
  },
  stats: {
    color: "#05375a",
    fontWeight: "bold",
    fontSize: 20,
    width: "30%"
  },
  view: {
    marginBottom: 20
  }
});
