import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation,NavigationProp  } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import Colors from '../../components/Colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, 'Detail'>>();
  const { name, carbonGrams, categoryKorean, explanation, carbonItemId, categoryImageUrl  } = route.params;
  const [quantity, setQuantity] = useState(1);     
  
  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await axios.post(
        'https://soopgyeol.site/carbon/log',
        {
          carbonItemId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('저장 성공:', response.data);
      alert('탄소 소비 기록이 저장되었습니다!');
      
      navigation.navigate('Main', { screen: 'Calendar' });

    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };
  useEffect(() => {
    console.log('받은 carbonItemId:', carbonItemId);
  }, []);

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <Image source={require('../../assets/ic_back_arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.imageBox}>
          {categoryImageUrl ? (
            <Image
              source={{ uri: categoryImageUrl }}
              style={styles.imageInner}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../assets/img_category_sample.png')}
              style={styles.imageInner}
              resizeMode="contain"
            />
          )}
        </View>
      </View>
      {/* 정보들 */}
      <View style={styles.infoSection}>
        <View style={styles.dividerBlock}>
          <Text style={styles.name}>{name}</Text>
        </View>

        <View style={styles.dividerBlock}>
          <Text style={styles.label}>분류: <Text style={styles.value}>{categoryKorean}</Text></Text>
        </View>
        <View style={styles.dividerBlock}>
          <Text style={styles.label}>탄소량: <Text style={styles.valueHighlight}>{carbonGrams.toFixed(1)}g</Text></Text>
        </View>
        <View style={styles.dividerBlock}>
          <Text style={styles.label}>점수: <Text style={styles.valueHighlight}>{Math.round(carbonGrams / 5)}점</Text></Text>
        </View>

        <View style={styles.dividerBlock}>
          <Text style={styles.description}>{explanation}</Text>
        </View>
        {/* 수량 조절 */}
        <View style={styles.counterBox}>
          <TouchableOpacity onPress={handleMinus}>
            <Text style={styles.counterButton}>－</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{quantity}</Text>
          <TouchableOpacity onPress={handlePlus}>
            <Text style={styles.counterButton}>＋</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 하단 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>탄소 소비 추가하기</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingTop: 70,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    position: 'relative',
    marginTop: 12,
  },

  imageBox: {
    width: 332,
    height: 200,
    borderRadius: 20,
    backgroundColor: '#fff',  
    overflow: 'hidden',       
    justifyContent: 'center',  
    alignItems: 'center',      
  },

  imageInner: {
    width: '100%',
    height: '100%',
  },

  infoSection: {
    paddingHorizontal: 30,
    marginTop: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,  
  },
  value: {
    fontSize: 20,
    color: Colors.mint,
  },
  valueHighlight: {
    fontSize: 20,
    color: Colors.mint,
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dividerBlock: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#B6B6B6',
    paddingVertical: 12,
  },
  counterBox: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 20,
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  counterButton: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#444',
    marginHorizontal: 10,
  },
  counterValue: {
    fontSize: 17,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.mint,
    width: 314,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
