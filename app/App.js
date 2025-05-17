import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import TourDetailScreen from './src/screens/TourDetailScreen';
import HotelDetailScreen from './src/screens/HotelDetailScreen';
import NewsDetailScreen from './src/screens/NewsDetailScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
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
              name="MainTabs" 
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="TourDetail" 
              component={TourDetailScreen}
              options={{ title: 'Chi tiết Tour' }}
            />
            <Stack.Screen 
              name="HotelDetail" 
              component={HotelDetailScreen}
              options={{ title: 'Chi tiết Khách sạn' }}
            />
            <Stack.Screen 
              name="NewsDetail" 
              component={NewsDetailScreen}
              options={{ title: 'Chi tiết Tin tức' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
