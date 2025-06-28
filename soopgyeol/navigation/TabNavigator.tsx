import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import RewardScreen from '../screens/reward/RewardScreen';
import CustomTabBar from '../components/CustomTabBar';
import { TabParamList } from '../types/navigation'; 
import CalendarScreen from '../screens/calendar/CalendarScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const calendarRef = useRef<{ goToToday: () => void } | null>(null);

  return (
    // @ts-ignore
    <Tab.Navigator
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          onCalendarPress={() => {
            props.navigation.navigate('Calendar');
            calendarRef.current?.goToToday?.();
          }}
        />
      )}
      screenOptions={{ headerShown: false, tabBarStyle: {backgroundColor: '#F5F5F8'} }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Reward" component={RewardScreen} />
    </Tab.Navigator>
  );
}
