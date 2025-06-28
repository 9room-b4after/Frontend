import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Colors from '../components/Colors';

const icons = {
  Home: require('../assets/btn_home.png'),
  Calendar: require('../assets/btn_calendar.png'),
  Reward: require('../assets/btn_reward.png'),
};

const checkImage = require('../assets/img_check_bar.png');

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
  onCalendarPress,
}: any) {
  return (
    <View style={styles.tabBar}>
      <View style={styles.tabBarInner}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => {  navigation.navigate(route.name);
              }}
              style={styles.tab}
            >
              <View style={styles.iconWrapper}>
                <Image
                  source={checkImage}
                  style={[
                    styles.checkMark,
                    { opacity: isFocused ? 1 : 0 },
                  ]}
                />
                <Image
                  source={icons[route.name]}
                  style={[
                    styles.icon,
                    { tintColor: isFocused ? Colors.mint : Colors.gray },
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',      
    bottom: 0,                
    height: 109,      
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',     
    backgroundColor: '#fff',
    paddingHorizontal: 40,     
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 25,
  },
  tab: {
    alignItems: 'center',
  },
   iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    position: 'absolute',
    bottom: 47,
    width: 65,
    height: 3,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
