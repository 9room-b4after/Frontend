// screens/shop/ProfileScreen.tsx
import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../components/Colors';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('지지');
  const [editable, setEditable] = useState(false); 
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
          <TouchableOpacity style={styles.cameraIcon}>
            <Image
              source={require('../assets/ic_camera_white.png')}
              style={styles.cameraIconImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.levelSection}>
          <Text style={styles.slogan}>
            “ 환경 보호의 <Text style={styles.highlight}>첫 걸음</Text>을 내딘는 순수한 시작 ”
          </Text>

          <View style={styles.levelBox}>
            <Image
              source={require('../assets/bg_profile_level.png')}
              style={styles.levelBg}
            />
              <Image
              source={require('../assets/bg_profile_level_line.png')}
              style={styles.levelOverlay}
            />
            <Image
              source={require('../assets/ic_profile_level.png')}
              style={styles.levelIcon}
            />
            <Text style={styles.levelTextOverlay}>Lv.1 새싹지기</Text>
            <Image
              source={require('../assets/img_seed_first.png')}
              style={styles.treeImage}
            />  
          </View>
        </View>
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.label}>닉네임</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={nickname}
            editable={editable} 
            onChangeText={setNickname}
          />
          <TouchableOpacity
            onPress={() => {
              setNickname('');
              setEditable(true); 
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
          <Text style={styles.email}>KYR1234@gmail.com</Text>
        </View>
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>저장하기</Text>
      </TouchableOpacity>

      {/* 회원탈퇴 */}
      <TouchableOpacity>
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
    marginTop: 20 
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
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    backgroundColor: Colors.mint,
    borderRadius: 20,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraIconImage: {
    width: 27,
    height: 27,
    resizeMode: 'contain',
  },

  levelSection: {
    alignItems: 'center',
    marginTop: 24,
  },

  slogan: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold'
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
  levelBg: {
    width: '97%',
    height: '97%',
    resizeMode: 'contain',    
  },
  levelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',    
  },

  levelIcon: {
    position: 'absolute',
    top: 30, 
    alignSelf: 'center',
    width: 124,
    height: 32,
    resizeMode: 'contain', 
  },

  levelTextOverlay: {
   position: 'absolute',
    top: 35,               
    alignSelf: 'center',
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  treeImage: {
    position: 'absolute',     
    bottom: 40,              
    alignSelf: 'center',     
    width: 33,
    height: 38,
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
