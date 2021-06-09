import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen';
import NotificationsScreen from './NotificationsScreen';
import WorkoutScreen from './WorkoutScreen';
import StatisticsScreen from './StatisticsScreen';
import ProfileScreen from './ProfileScreen';

const HomeStack = createStackNavigator();
const NotificationsStack = createStackNavigator();
const WorkoutStack = createStackNavigator();
const StatisticsStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#50C2C9',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsStackScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarColor: '#50C2C9',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-notifications" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Workout"
        component={WorkoutStackScreen}
        options={{
          tabBarLabel: 'Workout',
          tabBarColor: '#50C2C9',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-bicycle" color={color} size={26} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Statistics"
        component={StatisticsStackScreen}
        options={{
          tabBarLabel: 'Statistics',
          tabBarColor: '#50C2C9',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-fitness" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarColor: '#50C2C9',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => (
<HomeStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: '#50C2C9',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold'
        }
    }}>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{
        title:'Recent Activities',
        headerLeft: () => (
            <Icon.Button name="ios-menu" size={25} backgroundColor="#50C2C9" onPress={() => navigation.openDrawer()}></Icon.Button>
        )
        }} />
</HomeStack.Navigator>
);


const NotificationsStackScreen = ({navigation}) => (
  <NotificationsStack.Navigator screenOptions={{
          headerStyle: {
          backgroundColor: '#50C2C9',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold'
          }
      }}>
          <NotificationsStack.Screen name="Notifications" component={NotificationsScreen} options={{
          title:'Notifications',
          headerLeft: () => (
              <Icon.Button name="ios-menu" size={25} backgroundColor="#50C2C9" onPress={() => navigation.openDrawer()}></Icon.Button>
          )
          }} />
  </NotificationsStack.Navigator>
  );

const WorkoutStackScreen = ({navigation}) => (
<WorkoutStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: '#50C2C9',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold'
        }
    }}>
        <WorkoutStack.Screen name="Workout" component={WorkoutScreen} options={{
          title: 'Daily Workout',
        headerLeft: () => (
            <Icon.Button name="ios-menu" size={25} backgroundColor="#50C2C9" onPress={() => navigation.openDrawer()}></Icon.Button>
        )
        }} />
</WorkoutStack.Navigator>
);

const StatisticsStackScreen = ({navigation}) => (
  <StatisticsStack.Navigator screenOptions={{
          headerStyle: {
          backgroundColor: '#50C2C9',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold'
          }
      }}>
          <StatisticsStack.Screen name="Stats" component={StatisticsScreen} options={{
            title: 'Statistics',
          headerLeft: () => (
              <Icon.Button name="ios-menu" size={25} backgroundColor="#50C2C9" onPress={() => navigation.openDrawer()}></Icon.Button>
          )
          }} />
  </StatisticsStack.Navigator>
  );


const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator screenOptions={{
          headerStyle: {
          backgroundColor: '#50C2C9',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold'
          }
      }}>
          <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{
            title: 'Profile',
          headerLeft: () => (
              <Icon.Button name="ios-menu" size={25} backgroundColor="#50C2C9" onPress={() => navigation.openDrawer()}></Icon.Button>
          )
          }} />
  </ProfileStack.Navigator>
  );
  
  