import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const NotifScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Text>Notifications Screen</Text>
        <Button
            title="Go to notifications screen...again"
            onPress={() => navigation.push("Notifications")}
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

export default NotifScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});