import React from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { RadioButton, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Separator = () => <View style={styles.separator} />;

const ProfileScreen = () => {
  const [data, setData] = React.useState({
    type: "",
    value: "",
    mode: "",
    id: "",
    userId: "",
  });

  React.useEffect(() => {
    const getData = async () => {
      const jsonPref = await AsyncStorage.getItem("preferences");
      const preferences = JSON.parse(jsonPref);
      setData({
        ...data,
        type: preferences.type,
        value: preferences.value,
        mode: preferences.mode,
        id: preferences.id,
        userId: preferences.userId,
      });
    };
    getData();
  }, []);

  const api = axios.create({
    baseURL: "https://fast-beyond-99793.herokuapp.com/api",
  });
  const textInputChange = (text) => {
    if (text) {
      setData({
        ...data,
        value: text.replace(/[^0-9]/g, ""),
      });
    }
  };

  const submit = async () => {
    if (
      data.type.length == 0 ||
      data.value.length == 0 ||
      data.mode.length == 0
    ) {
      Alert.alert("Wrong Input!", "All fields are required.", [
        { text: "Okay" },
      ]);
      return;
    }

    const body = {
      id: data.id,
      type: data.type,
      value: data.value,
      mode: data.mode,
      userId: data.userId,
    };

    const accessToken = await AsyncStorage.getItem("accessToken");
    api
      .put("/preferences/" + data.id, body, {
        headers: {
          "x-access-token": accessToken,
        },
      })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.setItem("preferences", JSON.stringify(body));
          Alert.alert("Success", "Your preferences have been updated.", [
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
    <View>
      <View style={styles.preferences}>
        <Text style={styles.title}>Preferences</Text>
        <Button
          title="Save"
          onPress={() => {
            submit();
          }}
        />
      </View>
      <Separator />
      <Text style={styles.category}>Mode of travel</Text>
      <View style={styles.action}>
        <RadioButton.Group
          onValueChange={(newMode) => setData({ ...data, mode: newMode })}
          value={data.mode}
          style={styles.action}
        >
          <View>
            <Text>Walking</Text>
            <RadioButton value="walking" />
          </View>
          <View>
            <Text>Cycling</Text>
            <RadioButton value="cycling" />
          </View>
        </RadioButton.Group>
      </View>
      <Separator />
      <Text style={styles.category}>Search by</Text>
      <View style={styles.action}>
        <RadioButton.Group
          onValueChange={(newType) => setData({ ...data, type: newType })}
          value={data.type}
          style={styles.action}
        >
          <View>
            <Text>Duration</Text>
            <RadioButton value="duration" />
          </View>
          <View>
            <Text>Distance</Text>
            <RadioButton value="distance" />
          </View>
        </RadioButton.Group>
      </View>
      <Separator />
      <Text style={styles.category}>Total time or distance (min/m)</Text>
      {!!data.value && (
        <View style={styles.action}>
          <TextInput
            placeholder="The duration or distance to travel"
            defaultValue={data.value.toString()}
            style={[
              styles.textInput,
              {
                color: "#000",
              },
            ]}
            autoCapitalize="none"
            keyboardType="numeric"
            onChangeText={(val) => textInputChange(val)}
          />
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 10,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  title: {
    color: "#05375a",
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 10,
  },
  category: {
    color: "#05375a",
    fontSize: 24,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    marginLeft: 10,
    marginTop: 10,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  preferences: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});
