// SearchScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../components/Colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import axios from 'axios';

type CarbonItem = {
  name: string;
  carbonGrams: number;
  category: string;
  explanation: string;
};

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async () => {
    if (!searchText.trim()) return;

    try {
      const response = await axios.post('https://soopgyeol.site/carbon/analyze', {
        userInput: searchText.trim(),
      });
    console.log('API 응답:', response.data); 

    const data: CarbonItem = response.data.data;

    if (!data || !data.name) {
      setNotFound(true);
      return;
    }

    setNotFound(false);

      navigation.navigate('DetailScreen', {
        name: data.name,
        carbonGrams: data.carbonGrams,
        category: data.category,
        explanation: data.explanation,
      });
    } catch (error) {
      console.error('API 호출 오류:', error);
    }
  };

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
        <Text style={styles.headerText}>탄소 소비 기록하기</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 검색창 */}
      <View style={styles.searchBox}>
        <Image
          source={require('../../assets/ic_search.png')}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="제품 검색"
          placeholderTextColor="#B6B6B6"
          style={[
            styles.searchInput,
            { color: searchText.trim() === '' ? '#B6B6B6' : 'black' },
          ]}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
        />
      </View>

      {/* 안내 메시지 */}
      {searchText.trim() === '' && (
        <View style={styles.placeholderContainer}>
          <Image
            source={require('../../assets/ic_search_gray.png')}
            style={styles.largeSearchIcon}
          />
          <Text style={styles.placeholderText}>검색어를 입력해주세요</Text>
        </View>
      )}

      {/* 결과 없음 안내 */}
      {notFound && (
        <View style={styles.noResultContainer}>
          <Image
            source={require('../../assets/ic_no_search_item.png')}
            style={styles.noResultIcon}
          />
          <Text style={styles.noResultTextTitle}>결과를 찾을 수 없습니다</Text>
          <Text style={styles.noResultTextSub}>검색어를 다시 입력해주세요</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
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
  searchBox: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    marginTop: 24,
    borderRadius: 24,
    paddingHorizontal: 16,
    width: 314,
    height: 60,
    marginBottom: 40,
  },
  searchIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    marginLeft: 24,
  },
  placeholderContainer: {
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeSearchIcon: {
    width: 92,
    height: 92,
    resizeMode: 'contain',
  },
  placeholderText: {
    fontSize: 30,
    color: Colors.gray,
    marginTop: 50,
    fontWeight: 'bold',
  },
  noResultContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100
  },
  noResultIcon: {
    width: 126,
    height: 126,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  noResultTextTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noResultTextSub: {
    fontSize: 30,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 315,
    height: 102,
    borderRadius: 16,
    padding: 19,
    marginBottom: 14,
    elevation: 2,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 16,
  },
  resultName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultVolume: {
    fontSize: 15,
  },
  badgeButton: {
    position: 'absolute',
    right: 19,
    bottom: 19,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
