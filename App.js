import React, { useState, useEffect } from "react";
import { Platform, Text, View, ActivityIndicator, StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } from 'react-native-paper'
import { DrawerContent } from './screens/DrawerContent';

import MainTabScreen from './screens/MainTabScreen';

import { AuthContext } from './components/context'

import RootStackScreen from "./screens/RootStackScreen"
import AsyncStorage from '@react-native-async-storage/async-storage'

const Drawer = createDrawerNavigator();

import * as Location from "expo-location";
import MapView from "react-native-maps";
import Polyline from "@mapbox/polyline";

const App = () => {
  // const [isLoading, setIsLoading] = React.useState(true);
  // const [accessToken, setaccessToken] = React.useState(null); 

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const initialLoginState = {
    isLoading: true,
    email: null,
    accessToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }
  
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          accessToken: action.token,
          isLoading: false,
        };
      case 'LOGIN': 
        return {
          ...prevState,
          email: action.email,
          accessToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          email: null,
          accessToken: null,
          isLoading: false,
        };
      case 'REGISTER': 
        return {
          ...prevState,
          email: action.email,
          accessToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(user) => {
      // setaccessToken('fgkj');
      // setIsLoading(false);
      const { firstName, lastName, email, accessToken, roles } = user
      
      try {
        await AsyncStorage.setItem('firstName', firstName);
        await AsyncStorage.setItem('lastName', lastName);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('accessToken', accessToken);
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', accessToken);
      dispatch({ type: 'LOGIN', email: email, accessToken: accessToken });
    },
    signOut: async() => {
      // setaccessToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem('accessToken');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setaccessToken('fgkj');
      // setIsLoading(false);
    },
    toggleTheme: () => {
      setIsDarkTheme( isDarkTheme => !isDarkTheme );
    }
  }), []);

  useEffect(() => {
    setTimeout(async() => {
      // setIsLoading(false);
      let accessToken;
      accessToken = null;
      try {
        accessToken = await AsyncStorage.getItem('accessToken');
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', accessToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: accessToken });
    }, 1000);
  }, []);

  if( loginState.isLoading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
    <AuthContext.Provider value={authContext}>
    <NavigationContainer theme={theme}>
      { loginState.accessToken !== null ? (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
        </Drawer.Navigator>
      )
    :
      <RootStackScreen/>
    }
    </NavigationContainer>
    </AuthContext.Provider>
    </PaperProvider>
  );

}

export default App

/* export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      coords: [],
      x: "false",
      cordLatitude: 48.8566969,
      cordLongitude: 2.3514616,
    };

    this.mergeLot = this.mergeLot.bind(this);
  }

  componentDidMount() {
    this.getDirections("40.1884979, 29.061018", "41.0082,28.9784");
  }

  _getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      this.setState({
        error: "Permission to access location was denied",
      });
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    this.setState({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      error: null,
    });
  };

  async getDirections(startLoc, destinationLoc) {
    try {
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyDJMj_s-R9Hpa9r-a60rF41qfeWVKq3dN0`
      );
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      this.setState({ coords: coords });
      return coords;
    } catch (error) {
      alert(error);
      return error;
    }
  }

  mergeLot() {
    if (this.state.latitude != null && this.state.longitude != null) {
      let concatLot = this.state.latitude + "," + this.state.longitude;
      this.setState(
        {
          concat: concatLot,
        },
        () => {
          this.getDirections(concatLot, "43.7323492,7.4276832");
        }
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header />
        <Boxes />
        <Footer />
      </View>
    );
    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.1884979,
          longitude: 29.061018,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      >
        {!!this.state.latitude && !!this.state.longitude && (
          <MapView.Marker
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
            }}
            title={"Your Location"}
          />
        )}

        {!!this.state.cordLatitude && !!this.state.cordLongitude && (
          <MapView.Marker
            coordinate={{
              latitude: this.state.cordLatitude,
              longitude: this.state.cordLongitude,
            }}
            title={"Your Destination"}
          />
        )}

        {!!this.state.latitude &&
          !!this.state.longitude &&
          this.state.x == "true" && (
            <MapView.Polyline
              coordinates={this.state.coords}
              strokeWidth={2}
              strokeColor="red"
            />
          )}

        <MapView.Polyline
          coordinates={this.state.coords}
          strokeWidth={2}
          strokeColor="red"
        />

        {!!this.state.latitude &&
          !!this.state.longitude &&
          this.state.x == "error" && (
            <MapView.Polyline
              coordinates={[
                {
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                },
                {
                  latitude: this.state.cordLatitude,
                  longitude: this.state.cordLongitude,
                },
              ]}
              strokeWidth={2}
              strokeColor="red"
            />
          )}
      </MapView>
    );
  }
} */
