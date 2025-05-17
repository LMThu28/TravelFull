import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ToursScreen from '../screens/ToursScreen';
import HotelsScreen from '../screens/HotelsScreen';
import NewsScreen from '../screens/NewsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2B6CB0',
        tabBarInactiveTintColor: '#4A5568',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#2B6CB0',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Tours"
        component={ToursScreen}
        options={{
          title: 'Tours',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🎫</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Hotels"
        component={HotelsScreen}
        options={{
          title: 'Khách sạn',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏨</Text>
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          title: 'Tin tức',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📰</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator; 