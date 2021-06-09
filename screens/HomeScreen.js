import React, { Component } from "react";
import { Button, Text, View, StyleSheet } from "react-native";

class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Workout"
          onPress={() => this.props.navigation.navigate("Workout", {
            type: 'running',
          })}
        />
      </View>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
