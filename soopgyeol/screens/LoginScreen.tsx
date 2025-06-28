// screens/LoginScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const screenWidth = Dimensions.get('window').width;

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
        <Image source={require('../assets/img_login_earth.png')} style={styles.earth} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.kakaoButton}>
          <Image source={require('../assets/ic_kakao.png')} style={styles.icon} />
          <Text style={styles.kakaoText}>카카오 계정으로 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <Image source={require('../assets/ic_google.png')} style={styles.icon} />
          <Text style={styles.googleText}>구글 계정으로 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.textLoginButton}onPress={() => navigation.navigate('Nickname')}>
          <Text style={styles.textLoginText}>로그인하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  earth: {
    width: 450, 
    height: 500,
    resizeMode: 'cover', 
  },

  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
    paddingBottom: 150,
  },

  kakaoButton: {
    backgroundColor: '#FFE812',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    width: 300,
    height: 50,
    borderRadius: 10,
    marginBottom: 40,
  },

  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    width: 300,
    height: 50,
    borderRadius: 8,
  },

  icon: {
    width: 36,
    height: 36,
    marginRight: 12,
    resizeMode: 'contain',
  },

  kakaoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  googleText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },

  textLoginButton: {
    marginTop: 12,
    padding: 8,
  },

  textLoginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#38B36D', 
    textDecorationLine: 'underline',
  },
});
