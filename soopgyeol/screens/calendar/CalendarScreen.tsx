import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Colors from '../../components/Colors';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Image } from 'react-native';
import React, { useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

dayjs.locale('ko');
type CarbonRecord = {
  product: string;
  growthPoint: number;
};

export default function CalendarScreen({ calendarRef }: { calendarRef: React.RefObject<{ goToToday: () => void }> }) {
  const today = new Date().toISOString().split('T')[0]; 
  const [selectedDate, setSelectedDate] = useState(today);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [records, setRecords] = useState<CarbonRecord[]>([]);
  const [totalGrowthPoint, setTotalGrowthPoint] = useState<number>(0); 
  const [challengeText, setChallengeText] = useState<string>('기록 없음');
  const [challengeList, setChallengeList] = useState<any[]>([]);

  const fetchDailyRecords = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');          
      if (!token) {
        console.warn('토큰이 없습니다. 로그인 후 이용해주세요.');          
        return;
      }
      const response = await axios.get('https://soopgyeol.site/carbon/log/daily', {
        params: { date: selectedDate },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setRecords(response.data.data.logs);
      setTotalGrowthPoint(response.data.data.totalGrowthPoint || 0);
    } catch (error) {                  
      console.error('일일 탄소 기록 조회 실패:', error);
    }
  };
  const fetchChallengeHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const response = await axios.get('https://soopgyeol.site/challenges/history', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const history = response.data.data || [];
      setChallengeList(history);
      const selectedChallenge = history.find(challenge => {
        const challengeDate = challenge.createdAt?.split('T')[0];
        return challengeDate === selectedDate;
      });

      if (selectedChallenge) {
        const { title, progressCount } = selectedChallenge;
        const text = `${title || '제목 없음'} ${progressCount ?? 0}회`;
        setChallengeText(text);
      } else {
        setChallengeText('기록 없음');
      }

    } catch (error) {
      console.error('챌린지 내역 조회 실패:', error);
      setChallengeText('기록 없음');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchAll = async () => {
        await fetchDailyRecords();
        await fetchChallengeHistory(); 
      };

      fetchAll();
    }, [selectedDate])
  );

  return (
    <View style={styles.container}>
      <Calendar
        key={selectedDate}
        style={{ width: '100%', alignSelf: 'center' }}
        hideDayNames={true} 
        hideArrows={true} 
        enableSwipeMonths={true}
        
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: Colors.mint,
          },
        }}
        
        renderHeader={(date) => (
          <View style={styles.customHeader}>
            <Text style={styles.headerText}>{dayjs(date).format('YYYY년 M월')}</Text>
            <View style={styles.koreanWeekRow}>
              {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                <Text key={idx} style={styles.koreanWeekday}>
                  {day}
                </Text>
              ))}
            </View>
          </View>
        )}

        theme={{
          selectedDayBackgroundColor: Colors.mint,
          todayTextColor: Colors.mint,
          textDayFontSize: 15,          // 날짜 숫자 크기 증가
          textMonthFontSize: 20,        // 상단 월/년도 크기 증가
          textDayHeaderFontSize: 15,    // 요일 텍스트 크기 증가
        }}
      />
      <View style={styles.challengeBox}>
        <Text style={styles.challengeLabel}>오늘의 챌린지 :</Text>
        <Text style={styles.challengeText}>{challengeText}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.recordItem}>
          <Image source={require('../../assets/ic_mint_circle.png')} style={styles.bulletIcon} />
          <Text style={styles.title}>총 점수</Text>
          <Text style={styles.detail}>{totalGrowthPoint}점</Text>
        </View>
        <FlatList
          data={records}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.recordItem}>
              <Image source={require('../../assets/ic_mint_circle.png')} style={styles.bulletIcon} />
              <Text style={styles.title}>{item.product}</Text>
              <Text style={styles.detail}>
                {item.growthPoint}점
              </Text>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Search')}
        >
        <Text style={styles.buttonText}>탄소 소비 기록하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin:-12,
    marginTop: 50,
    backgroundColor: '#fff',

  },
  customHeader: {
    backgroundColor: Colors.mint,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 92,
    width: '100%',         
    alignItems: 'center',
    paddingHorizontal: 0, 
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 18,
  },
  koreanWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 12,
  },
  koreanWeekday: {
    width: 50,
    textAlign: 'center',
    fontSize: 15,
    paddingTop: 10,
    color: '#fff',
  },
  challengeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFC30080',
    width: 370,
    height: 50,
    marginTop: 12,
    borderWidth: 3,
    borderColor: '#FFC300', 
  },
  challengeLabel: {
    fontSize: 17,
    marginLeft: 20,
  },
  challengeText: {
    fontSize: 17,
    marginRight: 20,
  },
  recordList: {
    position: 'absolute',
    top: 350,
    paddingHorizontal: 20,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginLeft: 12,
    marginRight: 12,
    borderBottomColor: '#E8E8E8',
  },
  bulletIcon: {
    width: 16,
    height: 16,
    marginLeft: 15,
    marginRight: 16,
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    fontSize: 17,
  },
  detail: {
    fontSize: 17,
    marginRight: 25
  },
  button: {
    backgroundColor: Colors.mint,
    width: 314,
    height: 70,
    borderRadius: 20,
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

});