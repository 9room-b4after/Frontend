import React, { useState, useEffect, useCallback  } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, ActivityIndicator  } from 'react-native';
import Colors from '../../components/Colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function RewardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userMoney, setUserMoney] = useState<number | null>(null); 
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchUserMoney = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const res = await axios.get(`https://soopgyeol.site/api/v1/users/money-balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const money = res.data?.data?.moneyBalance;
      if (typeof money === 'number') {
        setUserMoney(money);
      }
    } catch (error) {
      console.error('잔액 조회 실패:', error);
    }
  };

  const fetchTodayChallenge = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('로그인이 필요합니다.');
        return;
      }

      const res = await axios.get('https://soopgyeol.site/challenges/today', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setChallenge(res.data.data);
    } catch (error) {
      console.error('챌린지 조회 실패:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      const fetchAll = async () => {
        setLoading(true); 

        await Promise.all([
          fetchUserMoney(),
          fetchTodayChallenge(),
        ]);

        setLoading(false); 
      };

      fetchAll();
    }, [])
  );

  const handleCompleteChallenge = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const payload = {
        dailyChallengeId: challenge.challengeId,
      };

      const res = await axios.post('https://soopgyeol.site/challenges/complete', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('챌린지 완료 응답:', res.data);

      if (res.data.success) {
        const reward = res.data.data.reward;
        const totalBalance = res.data.data.totalBalance;
        alert(`포인트 ${reward}점이 지급되었습니다!`);
        setUserMoney(totalBalance); 
        fetchTodayChallenge();     
      } else {
        alert(res.data.message || '포인트 지급에 실패했습니다.');
      }

    } catch (error) {
      console.error('챌린지 완료 실패:', error.response?.data || error.message);
      alert('이미 지급된 포인트입니다.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.mint} />
            </View>
          ) : (
      <>     
      <Image
        source={require('../../assets/bg_profile_mint.png')}
        style={styles.topBackground}
      />
      {/* 상단 바 */}
      <View style={styles.header}>
        <Text style={styles.title}>오늘의 챌린지</Text>
          <View style={styles.subRow}>
            <View style={styles.coinWrapper}>
              <Image source={require('../../assets/ic_just_coin.png')} style={styles.coinImage} />
              <Text style={styles.coinText}>
                {userMoney !== null ? `${userMoney}` : '-'}
              </Text>
            </View>
              <TouchableOpacity
                style={styles.queryButton}
                onPress={() => navigation.navigate('RewardList')}
              >
                <Text style={styles.queryText}>조회</Text>
              </TouchableOpacity>
          </View>
      </View>
      {challenge && (
        <View style={styles.card}>
          <ImageBackground
            source={require('../../assets/img_reward_item_bg.png')}
            style={styles.cardBackground}
            resizeMode="contain"
          >
            <TouchableOpacity onPress={() => navigation.navigate('RewardDetail', 
            { challengeId: challenge.challengeId,   
              keyword: challenge.carbonKeyword, 
              category: challenge.category  })}>
              <Text style={styles.cardTitle}>{challenge.title}</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: challenge.categoryImageUrl }}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <View style={styles.badgeRow}>
              <View style={styles.progressBadge}>
                <Text style={styles.progressText}>{`${challenge.progressCount} / ${challenge.goalCount}`}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{challenge.completed ? '완수' : '미완수'}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      )}
      {challenge && (
        <TouchableOpacity
          style={[
            styles.rewardButton,
            challenge.completed && { backgroundColor: Colors.mint },
            !challenge.completed && { backgroundColor: '#fff' },
          ]}
          disabled={!challenge.completed}
          onPress={handleCompleteChallenge}
        >
          <Image source={require('../../assets/ic_just_coin.png')} style={styles.rewardCoinIcon} />
          <View style={styles.rewardTextContainer}>
            <Text style={[
              styles.rewardPoint,
              { color: challenge.completed ? '#fff' : '#000' }
            ]}>
              {challenge.rewardMoney}
            </Text>
            <Text style={[
              styles.rewardLabel,
              { color: challenge.completed ? '#fff' : '#000' }
            ]}>
              포인트 받기
            </Text>
          </View>
        </TouchableOpacity>
        )}
      </>  
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#fff'
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
    paddingHorizontal: 30,
    height: 40,
    marginBottom: 16,
    position: 'relative',
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subRow: {
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinWrapper: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 80,   
    height: 35, 
    justifyContent: 'center', 
  },
  coinImage: {
    marginLeft: 10,
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  coinText: {
    marginLeft: 40,
    position: 'absolute',
    fontWeight: 'bold',
    color: Colors.yellow,
    fontSize: 20,
  },
  queryButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 80,   
    height: 35, 
    justifyContent: 'center',
    alignItems: 'center', 
  },
  queryText: {
    color: Colors.mint,
    fontWeight: 'bold',
    fontSize: 20,
  },
  card: {
    width: '100%',
    height: 330,
    marginTop: 130,
  },
  cardBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 15,
  },
  cardImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginTop: 50,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
    alignSelf: 'center',
  },
  progressBadge: {
    borderWidth: 2,
    borderColor: Colors.mint,
    borderRadius: 20,
    width: 83,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 70,
  },

  progressText: {
    color: Colors.mint,
    fontWeight: 'bold',
    fontSize: 20,
  },

  statusBadge: {
    backgroundColor: Colors.mint,
    borderRadius: 20,
    width: 83,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  rewardButton: {
    flexDirection: 'row',
    borderWidth: 4,
    borderColor: Colors.mint,
    borderRadius: 16,
    height: 70,
    width: 310,
    marginTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardCoinIcon: {
    width: 25,
    height: 25,
    marginRight: 8,
  },
  rewardTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardPoint: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.yellow, 
    marginRight: 4,
  },

  rewardLabel: {
    fontSize: 20,
    color: Colors.mint,
    fontWeight: 'bold',
  },
});