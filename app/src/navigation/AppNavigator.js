import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import TourDetailScreen from '../screens/TourDetailScreen';
import HotelDetailScreen from '../screens/HotelDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#2B6CB0',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{
                        title: 'StayBooker',
                    }}
                />
                <Stack.Screen 
                    name="TourDetail" 
                    component={TourDetailScreen}
                    options={{
                        title: 'Chi tiết Tour',
                    }}
                />
                <Stack.Screen 
                    name="HotelDetail" 
                    component={HotelDetailScreen}
                    options={{
                        title: 'Chi tiết Khách sạn',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator; 