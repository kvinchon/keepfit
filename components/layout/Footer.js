import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default class Footer extends React.Component {
  render() {
    return (
      <View style={styles.footer}>
        <Text>Footer Component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    height: "15%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
});
