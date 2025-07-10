// screens/LoginScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get(
        'https://soopgyeol.site/api/v1/auth/oauth/oauth2/google/url',
        {
          params: {
            redirectUri: 'soopgyeol://oauth-callback/google',
          },
        }
      );

      const googleUrl = response.data.url;
      console.log('Google 로그인 URL:', googleUrl);

      const result = await WebBrowser.openAuthSessionAsync(
        googleUrl,
        'soopgyeol://oauth-callback/google' 
      );
      if (result.type === 'success' && result.url) {
        const parsed = Linking.parse(result.url);
        const token = parsed.queryParams?.token;

        if (typeof token === 'string') {
          console.log('구글 토큰:', token); 
          await AsyncStorage.setItem('accessToken', token);
          navigation.navigate('Nickname');
        }
      }
    } catch (err) {
      console.error('구글 로그인 실패:', err);
    }
  };

const handleKakaoLogin = async () => {

  try {
    const response = await axios.get(
      'https://soopgyeol.site/api/v1/auth/oauth/oauth2/kakao/url',
      {
        params: {
          redirectUri: 'soopgyeol://oauth-callback/kakao',
        },
      }
    );

    const kakaoUrl = response.data.url;

    const result = await WebBrowser.openAuthSessionAsync(
      kakaoUrl,
      'soopgyeol://oauth-callback/kakao'
    );

    if (result.type === 'success' && result.url) {
      const parsed = Linking.parse(result.url);
      const token = parsed.queryParams?.token;

      if (typeof token === 'string') {
        console.log('카카오 토큰:', token); 
        await AsyncStorage.setItem('accessToken', token);
        navigation.navigate('Nickname');
      }
    }
  } catch (err) {
    console.error('카카오 로그인 실패:', err);
  }
};

  return (
    <View style={styles.container}>
        <Image source={require('../assets/img_login_earth.png')} style={styles.earth} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.kakaoButton} onPress={handleKakaoLogin}>
          <Image source={require('../assets/ic_kakao.png')} style={styles.icon} />
          <Text style={styles.kakaoText}>카카오 계정으로 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Image source={require('../assets/ic_google.png')} style={styles.icon} />
          <Text style={styles.googleText}>구글 계정으로 로그인</Text>
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
});
