import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import Colors from '../../components/Colors';
import axios from 'axios';

export default function DetailScreen() {
  const navigation = useNavigation();

  const route = useRoute<RouteProp<RootStackParamList, 'DetailScreen'>>();
  const { name, carbonGrams, category, explanation } = route.params;
  const [quantity, setQuantity] = useState(1);
  const userId = 1;       
  const carbonItemId = 1;

  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('https://soopgyeol.site/carbon/log', {
        userId,
        carbonItemId,
        quantity,
      });

      console.log('저장 성공:', response.data);

      alert('탄소 소비 기록이 저장되었습니다!');
      navigation.goBack();
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };
  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image source={require('../../assets/ic_back_arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      {/* 이미지 박스 */}
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/img_category_sample.png')} style={styles.imageBox} />
      </View>

      {/* 정보들 */}
      <View style={styles.infoSection}>
        <View style={styles.dividerBlock}>
          <Text style={styles.name}>{name}</Text>
        </View>

        <View style={styles.dividerBlock}>
          <Text style={styles.label}>분류: <Text style={styles.value}>{category}</Text></Text>
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
    padding: 10,
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
