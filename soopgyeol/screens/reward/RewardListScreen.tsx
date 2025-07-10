import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

export default function RewardListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [challengeList, setChallengeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChallengeHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('로그인이 필요합니다.');
        return;
      }

      const res = await axios.get('https://soopgyeol.site/challenges/history', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });


      const formattedData = res.data.data.map((item: any, index: number) => ({
        id: index.toString(),
        title: item.title || '-',
        status: item.completed ? '완수' : '미완수',
        date: dayjs(item.createdAt).format('M/D'),
      }));

      setChallengeList(formattedData);
    } catch (error) {
      console.error('챌린지 내역 조회 실패:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeHistory();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemStatus}>{item.status}</Text>
      </View>
      <Text style={styles.itemDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상단바 */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image source={require('../../assets/ic_back_arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      {/* 리스트 */}
      <FlatList
        data={challengeList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={!loading && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>진행한 챌린지가 없습니다.</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  itemContainer: {
    backgroundColor: '#EDEDEF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemStatus: {
    fontSize: 15,
  },
  itemDate: {
    fontSize: 13,
    color: '#7F7F7F80',
  },
});