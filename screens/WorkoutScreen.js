import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const WorkoutScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Text>Workout Screen</Text>
        <Button
            title="Go to workout screen...again"
            onPress={() => navigation.push("Workout")}
        />
        <Button
            title="Go to home"
            onPress={() => navigation.navigate("Home")}
        />
        <Button
            title="Go back"
            onPress={() => navigation.goBack()}
        />
      </View>
    );
};

export default WorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});