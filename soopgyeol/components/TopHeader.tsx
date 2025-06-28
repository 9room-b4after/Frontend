// components/TopHeader.tsx
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import Colors from './Colors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type Props = {
  selected: 'shop' | 'profile' | null;
  onSelect: (key: 'shop' | 'profile') => void;
  showShop?: boolean;
};
export default function TopHeader({ selected, onSelect, showShop = true}: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return ( 
    <View style={styles.topBar}>
      {showShop ? (
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Shop')} 
        >
          <Feather
            name="shopping-cart"
            size={24}
            color={selected === 'shop' ? Colors.mint : Colors.gray}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/ic_back_arrow.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.logoButton} onPress={() => console.log('Logo')}>
        <Image source={require('../assets/ic_logo.png')} style={styles.logo} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')} 
      >
        <Ionicons
          name="person-outline"
          size={24}
          color={selected === 'profile' ? Colors.mint : Colors.gray}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 48,
    marginTop: 18,
    justifyContent: 'center',
  },
  shopButton: {
    position: 'absolute',
    left: 50,
    top: 0,
    padding: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginLeft: -20,
    resizeMode: 'contain',
  },
  profileButton: {
    position: 'absolute',
    right: 50,
    top: 0,
    padding: 10,
  },
  logoButton: {
    alignSelf: 'center',
  },
  logo: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
});
