import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; 
export default function OAuthRedirectHandler() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      console.log('[딥링크]수신된 URL:', url);

      const { queryParams } = Linking.parse(url);
      const rawToken = queryParams?.token;
      const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

      if (token) {
        AsyncStorage.setItem('accessToken', token);
        navigation.navigate('Nickname');
      } else {
        console.warn('[딥링크] 토큰이 URL에 존재하지 않습니다');
      }
    };

    const sub = Linking.addEventListener('url', handleUrl);
    return () => sub.remove();
  }, [navigation]);

  return null;
}
