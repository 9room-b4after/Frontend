// screens/shop/ProfileScreen.tsx
import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../components/Colors';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../types/navigation'; 
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState(''); 

  const [levelTextOverlay, setLevelTextOverlay] = useState('Lv.1 새싹지기');
  const [levelIconUrl, setLevelIconUrl] = useState('');
  const [slogan] = useState('“ 환경 보호의 첫 걸음을 내딘는 순수한 시작 ”');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getNextGradeParts = (heroName?: string) => {
    switch (heroName) {
      case 'Lv.1 새싹지기':
        return { textBefore: '"환경 보호의 ', highlight: '첫 걸음', textAfter: '을 내딛는 순수한 시작"' };
      case 'Lv.2 줄임꾼':
        return { textBefore: '', highlight: '"작은 실천', textAfter: '으로 지구를 지켜가는 단계"' };
      case 'Lv.3 탐험가':
        return { textBefore: '', highlight: '"새로운 탄소 줄이기', textAfter: ' 방법에 도전하는 단계"' };
      case 'Lv.4 지구지킴이':
        return { textBefore: '', highlight: '"탄소 중립', textAfter: '을 실현하는 환경 영웅"' };
      default:
        return { textBefore: '', highlight: '...', textAfter: '' };
    }
  };

  const getHighlightColor = (heroName?: string) => {
    if (heroName === 'Lv.1 새싹지기' || heroName === 'Lv.2 줄임꾼'|| heroName === 'Lv.3 탐험가'|| heroName === 'Lv.4 지구지킴이') return Colors.mint;
    return '#000';
  };
  
  const { textBefore, highlight, textAfter } = getNextGradeParts(levelTextOverlay);
  const highlightColor = getHighlightColor(levelTextOverlay);
  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('로그인이 필요합니다.');
        return;
      }

      const res = await axios.get('https://soopgyeol.site/api/v1/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.data) {
        setNickname(res.data.nickname || '');
        setEmail(res.data.email || ''); 
      }
    } catch (error) {
      console.error('프로필 정보 불러오기 실패:', error);
    }
  };
  const fetchHeroStage = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('로그인이 필요합니다.');
        return;
      }

      const res = await axios.get('https://soopgyeol.site/hero-stage', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',          
        },
      });
      if (res.data.success) {
        const data = res.data.data;
        setLevelTextOverlay(data.heroName);
        setLevelIconUrl(data.heroUrl);        
      }
      } catch (error) {
        console.error('영웅 등급 불러오기 실패:', error);
      }
    };
    
  useEffect(() => {
    fetchUserProfile();
    fetchHeroStage();
  }, []);
  const handleWithdraw = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const response = await axios.delete('https://soopgyeol.site/api/v1/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      alert('회원 탈퇴가 완료되었습니다.');
      await AsyncStorage.removeItem('accessToken');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {
      alert('회원 탈퇴에 실패했습니다.');
    }
  } catch (error) {
    console.error('회원 탈퇴 실패:', error);
    alert('회원 탈퇴 중 오류가 발생했습니다.');
  }};

  const saveNickname = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    const response = await axios.patch(
      'https://soopgyeol.site/api/v1/users/me/nickname',
      { nickname },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  if (response.data?.nickname) {
    alert('닉네임이 성공적으로 변경되었습니다!');
    setNickname(response.data.nickname);  
  } else {
    console.log('서버 응답:', response.data);
    alert('닉네임 변경에 실패했습니다.');
  }
  } catch (error) {
    console.error('닉네임 변경 실패:', error);
    alert('닉네임 변경 중 오류가 발생했습니다.');
  }};
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/bg_profile_mint.png')}
        style={styles.topBackground}
      />
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image source={require('../assets/ic_back_arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>내 정보</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileWrapper}>
          <Image
            source={require('../assets/ic_sample_profile.png')}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.levelSection}>
          <View style={styles.levelBox}>
            {levelIconUrl && (
              <Image source={{ uri: levelIconUrl }} style={styles.treeImage} />
            )}
          </View>
            <Text style={styles.slogan}>
              {textBefore}
            <Text style={{ color: highlightColor, fontWeight: 'bold' }}>{highlight}</Text>
              {textAfter}
          </Text>
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.label}>닉네임</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
          />
          <TouchableOpacity
            onPress={() => {
              setNickname('');
            }}
            style={styles.clearButton}
          >
            <Image
              source={require('../assets/ic_clear_x.png')}
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* 계정 정보 */}
      <View style={styles.inputSection}>
        <Text style={styles.label}>계정</Text>
        <View style={styles.accountRow}>
          <Image
            source={require('../assets/ic_kakao.png')}
            style={styles.kakaoIcon}
          />
          <Text style={styles.email}>{email || '이메일 없음'}</Text>  
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveNickname}>
        <Text style={styles.saveButtonText}>저장하기</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleWithdraw}>
        <Text style={styles.withdrawText}>회원탈퇴</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    paddingTop: 50,
  },
  topBackground: {
    position: 'absolute',
    width: '100%',
    height: 160, 
    resizeMode: 'cover',
    borderRadius: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 40,
    marginBottom: 16,
    position: 'relative',
  },
  backButton: {
    padding: 10,
  },
    backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  backText: {
    fontSize: 20,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSection: 
  { 
    alignItems: 'center', 
  },
  profileWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 50,
  },
  levelSection: {
    alignItems: 'center',
  },

  slogan: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
  },

  highlight: {
    color: Colors.mint,
    fontWeight: 'bold',
  },

  levelBox: {
    position: 'relative',
    width: 355,  
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,

  },

  treeImage: {
    position: 'relative',
    alignSelf: 'center',
    width: 180,                
    height: 180,             
    resizeMode: 'contain',
  },
  inputSection: 
  { 
    marginHorizontal: 20, 
    marginTop: 10, 
    marginBottom: 10,
  },
  label: 
  { 
    fontSize: 17, 
    marginBottom: 6 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 38,
    paddingHorizontal: 12,
    backgroundColor: '#fff'
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },

  clearButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -16 }],
    padding: 5,
  },

  clearIcon: {
    width: 24,
    height: 24,
    tintColor: '#B6B6B6',
  },

  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  kakaoIcon: 
  { 
    width: 36, 
    height: 36, 
    marginRight: 8 
  },
  email: { fontSize: 17 },
  saveButton: {
    marginTop: 30,
    backgroundColor: Colors.mint,
    borderRadius: 12,
    width: 314,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
        alignSelf: 'center',

  },
  saveButtonText: 
  { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  withdrawText: {
    textAlign: 'center',
    color: Colors.gray,
    fontSize: 15,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});
