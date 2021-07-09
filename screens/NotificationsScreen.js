import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const NotifScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Text>Coming Soon!</Text>
        <Button
          title="Go to Workout"
          onPress={() => navigation.navigate("Workout")}
        />
      </View>
    );
};

export default NotifScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});