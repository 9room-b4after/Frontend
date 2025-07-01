import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Colors from '../../components/Colors';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Image } from 'react-native';
import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

dayjs.locale('ko');

type CarbonRecord = {
  product: string;
  quantity: number;
  carbon: number;
  recordedAt: string;
};

export default function CalendarScreen({ calendarRef }: { calendarRef: React.RefObject<{ goToToday: () => void }> }) {
  const [selectedDate, setSelectedDate] = useState('2025-03-07');
  const calendarCompRef = useRef<any>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [records, setRecords] = useState<CarbonRecord[]>([]);

  const userId: number = 1;

  useFocusEffect(
    React.useCallback(() => {
      const fetchRecords = async () => {
        try {
            const response = await axios.get('https://soopgyeol.site/carbon/log', {
            params: {
              userId: userId 
            }
          });
          console.log('전체 응답:', JSON.stringify(response.data, null, 2));

          setRecords(response.data.data); 
        } catch (error) {
          console.error('탄소 기록 조회 실패:', error);
        }
      };

      fetchRecords();
    }, [])
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
      <View style={{ flex: 1 }}>
        <FlatList
          data={records}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.recordItem}>
              <Image source={require('../../assets/ic_mint_circle.png')} style={styles.bulletIcon} />
              <Text style={styles.title}>{item.product}</Text>
              <Text style={styles.detail}>
                {item.quantity}개 / {item.carbon}g / {dayjs(item.recordedAt).format('YYYY.MM.DD')}
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
    marginRight: 18
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