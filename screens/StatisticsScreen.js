import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const StatisticsScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Text>Statistics Screen</Text>
        <Button
            title="Go to statistics screen...again"
            onPress={() => navigation.push("Statistics")}
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

export default StatisticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});