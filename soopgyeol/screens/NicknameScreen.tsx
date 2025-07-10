// screens/NicknameScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, Alert, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NicknameScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [nickname, setNickname] = useState('');

    const handleSaveNickname = async () => {
      if (nickname.length < 2) {
        Alert.alert('닉네임은 최소 2글자 이상이어야 합니다.');
        return;
      }

      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('로그인이 필요합니다.');
          return;
        }

        await axios.patch(
          'https://soopgyeol.site/api/v1/users/me/nickname',
          { nickname },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        navigation.navigate('Main');
      } catch (err: any) {
        console.error('닉네임 저장 오류:', err);
        Alert.alert('닉네임 저장에 실패했습니다.');
      }
    };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>닉네임 설정</Text>
          <TextInput
            style={styles.input}
            placeholder="닉네임을 입력하세요"
            placeholderTextColor="#aaa"
            value={nickname}
            onChangeText={setNickname}
            maxLength={12}
          />
          <Text style={styles.guide}>(최소 2글자 최대 12글자)</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleSaveNickname}>
              <Text style={styles.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 290,
    height: 245,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
  },
  title: {
    marginTop: 14,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#C3EFEE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
    height: 41,
    width: 225,
  },
  guide: {
    fontSize: 15,
    color: '#B6B6B6',
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 50,
    height: 38,
    
  },
  cancelButton: {
    flex: 1,
    marginLeft: 15,
    backgroundColor: '#DDF9F4',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#B6B6B6',
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    marginRight: 15,
    backgroundColor: '#38CAC5',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
