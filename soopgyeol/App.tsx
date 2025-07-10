import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types/navigation'; 
import TabNavigator from './navigation/TabNavigator';
import SearchScreen from './screens/calendar/SearchScreen';
import DetailScreen from './screens/calendar/DetailScreen';
import RewardListScreen from './screens/reward/RewardListScreen';
import RewardDetailScreen from './screens/reward/RewardDetailScreen';
import HomeScreen from './screens/home/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import NicknameScreen from './screens/NicknameScreen';
import ShopScreen from './screens/ShopScreen';
import InventoryScreen from './screens/InventoryScreen';

import ProfileScreen from './screens/ProfileScreen';
import OAuthRedirectHandler from './components/OAuthRedirectHandler'; 
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();
const Stack = createNativeStackNavigator<RootStackParamList>(); 

export default function App() {
  // @ts-ignore
  return (
    <NavigationContainer>
      {/* ✅ NavigationContext 안쪽으로 옮김 */}
      <OAuthRedirectHandler />
      <Stack.Navigator 
        initialRouteName="Splash" 
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Nickname" component={NicknameScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="RewardList" component={RewardListScreen} />
        <Stack.Screen name="RewardDetail" component={RewardDetailScreen} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}
