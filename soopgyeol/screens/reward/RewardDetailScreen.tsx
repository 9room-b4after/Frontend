import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator  } from 'react-native';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import Colors from '../../components/Colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RewardDetailScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RewardDetail'>>();
  const { challengeId, keyword, category } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarbonData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          alert('로그인이 필요합니다.');
          return;
        }

        const payload = { 
          challengeId,
          keyword, 
          category 
        };
        const res = await axios.post('https://soopgyeol.site/carbon/analyze/keyword', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('탄소 분석 결과:', res.data.data);

        if (res.data.success) {
          setData(res.data.data);
        } else {
          alert(res.data.message || '데이터 조회에 실패했습니다.');
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error.response?.data || error.message);
        alert('서버 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarbonData();
  }, [challengeId]);
  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  const handleSave = async () => {
    if (!data) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const payload = {
        carbonItemId: data.challengeId,  
        quantity: quantity,
        dailyChallengeId: data.challengeId, 
      };
    console.log('탄소 소비 기록 요청 payload:', payload);

      const res = await axios.post(
        'https://soopgyeol.site/carbon/log',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      
      console.log('탄소 소비 기록 성공:', res.data);
      console.log('isFromChallenge:', res.data.data?.isFromChallenge);

      if (quantity >= data.goalCount) {
        alert('챌린지를 완수했습니다!');
      } else {
        alert('탄소 소비가 추가되었습니다.');
      }

      navigation.goBack();

    } catch (error) {
      console.error('탄소 소비 추가 실패:', error.response?.data || error.message);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color= {Colors.mint} />
        </View>
      ) : (
        <>
          <View style={styles.imageContainer}>
            <View style={styles.imageBox}>
              {data?.categoryImageUrl ? (
                <Image
                  source={{ uri: data.categoryImageUrl }}
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
      {data && (
      <View style={styles.infoSection}>
        <View style={styles.dividerBlock}>
          <Text style={styles.name}>{data?.name ?? '-'}</Text>
        </View>

        <View style={styles.dividerBlock}>
          <Text style={styles.label}>분류: <Text style={styles.value}>{data?.categoryKorean ?? '-'}</Text></Text>
        </View>

        <View style={styles.dividerBlock}>
          <Text style={styles.label}>탄소량: <Text style={styles.valueHighlight}>{data.carbonGrams ?? 0}g</Text></Text>
        </View>

        <View style={styles.dividerBlock}>
          <Text style={styles.label}>점수: <Text style={styles.valueHighlight}>{data?.rewardMoney ?? 0}</Text></Text>
        </View>

        <View style={styles.dividerBlock}>
          <Text style={styles.description}>{data.explanation ?? '-'}</Text>
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
    )}
      {/* 하단 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>탄소 소비 추가하기</Text>
      </TouchableOpacity>
      </>
      )}
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
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
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
  dividerBlock: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#B6B6B6',
    paddingVertical: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
