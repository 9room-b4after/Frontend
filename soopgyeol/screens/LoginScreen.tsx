// screens/LoginScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect,useState } from 'react';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const screenWidth = Dimensions.get('window').width;
export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get('https://soopgyeol.site/api/v1/auth/oauth/oauth2/google/url');
      const googleUrl = response.data.url;

      const result = await WebBrowser.openAuthSessionAsync(
        googleUrl,
        'https://soopgyeol.site/api/v1/auth/oauth/oauth2/google/code-log'
      );

      if (result.type === 'success' && result.url) {
        const url = result.url;
        const code = extractCodeFromUrl(url);

        const jwtResponse = await axios.post(
          'https://soopgyeol.site/api/v1/auth/oauth/oauth2/google/code',
          {
            provider: 'google',
            code,
          }
        );

        const token = jwtResponse.data.token;
        console.log('Google JWT:', token);
        navigation.navigate('Nickname');
      }
    } catch (err) {
      console.error('구글 로그인 실패:', err); 
      if (axios.isAxiosError(err)) {
        console.log('Axios 응답 데이터:', err.response?.data);
        console.log('Axios 상태 코드:', err.response?.status);
        console.log('Axios 전체 응답:', err.response);
      }
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const response = await axios.get('https://soopgyeol.site/api/v1/auth/oauth/oauth2/kakao/url');
      const kakaoUrl = response.data.url;

      const result = await WebBrowser.openAuthSessionAsync(kakaoUrl, 'https://soopgyeol.site/api/v1/auth/oauth/oauth2/kakao/code-log');

      if (result.type === 'success' && result.url) {
        const url = result.url;
        const code = extractCodeFromUrl(url); 
        const jwtResponse = await axios.post('https://soopgyeol.site/api/v1/auth/oauth/login', {
          provider: 'kakao',
          code,
        });
        const token = jwtResponse.data.token;
        console.log('Kakao JWT:', token);
        navigation.navigate('Nickname');
      }
    } catch (err) {
      console.error('카카오 로그인 실패:', err);
    }
  };

  const extractCodeFromUrl = (url: string) => {
    const parsed = Linking.parse(url);
    return parsed.queryParams?.code;
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
