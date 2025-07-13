import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../components/Colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; 

const TABS = ['하늘', '왼쪽 땅', '오른쪽 땅'];
const CATEGORY_MAP = {
  SKY: '하늘',
  LEFT_GROUND: '왼쪽 땅',
  RIGHT_GROUND: '오른쪽 땅',
};

const previewOverlays = {
  하늘: require('../assets/bg_store_high.png'),
  '왼쪽 땅': require('../assets/bg_store_left.png'),
  '오른쪽 땅': require('../assets/bg_store_right.png'),
};

const screenWidth = Dimensions.get('window').width;
const boxSize = (screenWidth - 20 * 2 - 12 * 2) / 3;

export default function InventoryScreen() {
  const [selectedTab, setSelectedTab] = useState('하늘');
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [userMoney, setUserMoney] = useState<number | null>(null); 
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [treeUrl, setTreeUrl] = useState<string | null>(null);

  const handleItemPress = (item) => {
    setSelectedItem((prev) => (prev?.id === item.id ? null : item));
  };
  const handleConfirm = async () => {
    if (!selectedItem) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
      const currentCategoryItems = itemsByCategory[selectedTab] || [];
      const isAnotherItemDisplayed = currentCategoryItems.some(
        (item) => item.display === true && item.id !== selectedItem.id
      );

      if (isAnotherItemDisplayed) {
        alert('다른 아이템이 전시되어있습니다.');
        return;
      }

      const res = await axios.patch(
        `https://soopgyeol.site/items/item/${selectedItem.id}/display`,
        { display: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = res.data;
      if (result.success) {
        setSelectedItem(null);
        navigation.navigate('Main');
      } else {
        alert(result.message || '전시 상태 변경에 실패했습니다.');
      }

    } catch (error) {
      console.error('전시 상태 변경 실패:', error);
      alert('오류가 발생했습니다.');
    }
  };

  const handleCancel = async () => {
    if (!selectedItem) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const res = await axios.patch(
        `https://soopgyeol.site/items/item/${selectedItem.id}/display`,
        { display: false }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = res.data;
      if (result.success) {
        setSelectedItem(null);
        navigation.navigate('Main');
      } else {
        alert(result.message || '전시 취소에 실패했습니다.');
      }

    } catch (error) {
      console.error('전시 취소 실패:', error);
      alert('오류가 발생했습니다.');
    }
  };
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
  useEffect(() => {
    fetchUserMoney();
  }, []);

  useEffect(() => {
  const fetchInventoryItems = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const category = Object.entries(CATEGORY_MAP).find(([_, v]) => v === selectedTab)?.[0];
      if (!category) return;
      const res = await axios.get(`https://soopgyeol.site/items/inventory/category/${category}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('서버에서 받은 아이템 목록:', res.data.data);
      setItemsByCategory(prev => ({
        ...prev,
        [selectedTab]: res.data.data,
        
      }));

    } catch (err) {
      console.error('인벤토리 불러오기 실패:', err);
    }
    };
    fetchInventoryItems();
  }, [selectedTab]);

  useEffect(() => {
    const fetchTreeStage = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;

        const response = await axios.get('https://soopgyeol.site/tree-stage', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const url = response.data?.data?.treeUrl;
        if (url) setTreeUrl(url);
      } catch (error) {
        console.error('나무 단계 조회 실패:', error);
      }
    };

    fetchTreeStage();
  }, []);
  const currentItems = itemsByCategory[selectedTab] || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image source={require('../assets/ic_back_arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.title}>인벤토리</Text>

        <View style={styles.coinContainer}>
          <Image source={require('../assets/img_store_point.png')} style={styles.coinIcon} resizeMode='contain' />
          <Text style={styles.coinText}>
            {userMoney !== null ? `${userMoney}` : '-'}
          </Text>
        </View>
      </View>
      <View style={styles.previewRow}>
        <TouchableOpacity
          style={[
            styles.purchaseFixedButton,
            { opacity: selectedItem && selectedItem.display === false ? 1 : 0 }
          ]}
          onPress={handleConfirm}
          disabled={!selectedItem || selectedItem.display === true}  
        >
          <Text style={styles.purchaseButtonText}>확정</Text>
        </TouchableOpacity>
        <View style={styles.previewBox}>
            {treeUrl && (
              <Image
                source={{ uri: treeUrl }}
                style={styles.previewImage} 
                resizeMode="contain"
              />
            )}
          <Image
            key={selectedTab}
            source={previewOverlays[selectedTab]}
            style={[styles.overlayImage, selectedTab === '하늘' && { bottom: -95 }]}
            resizeMode="contain"
          />
          {selectedItem && (
            <Image
              source={{ uri: selectedItem.url }}
              style={[
                styles.itemInPreview,
                selectedTab === '하늘' ? styles.skyPosition : selectedTab === '왼쪽 땅' ? styles.leftPosition : styles.rightPosition,
              ]}
              resizeMode="contain"
            />
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.purchaseFixedButton,
            { opacity: selectedItem && selectedItem.display === true ? 1 : 0 } 
          ]}
          onPress={handleCancel}
          disabled={!selectedItem || selectedItem.display === false} 
        >
          <Text style={styles.purchaseButtonText}>취소</Text>
        </TouchableOpacity>
      </View>
      <ImageBackground source={require('../assets/bg_store_white.png')} style={styles.bottomSection} resizeMode="cover">
        <View style={styles.tabContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                setSelectedTab(tab);
                setSelectedItem(null);  
              }}
              style={[styles.tabButton, selectedTab === tab && styles.tabButtonActive]}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.itemGrid}>
          {currentItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemBox, selectedItem?.id === item.id && styles.itemBoxSelected,
              (index + 1) % 3 !== 0 ? { marginRight: 12 } : { marginRight: 0 },
              ]}
              onPress={() => handleItemPress(item)}
            >
              <Image source={{ uri: item.url }} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C9EBF9',
    paddingTop: 50,
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
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  coinIcon: {
    width: 90,
    height: 30,
    marginRight: 4,
  },
  coinText: {
    position: 'absolute',
    fontSize: 18,
    marginLeft: 14,
    fontWeight: 'bold',
    color: Colors.yellow
  },
  previewBox: {
    width: 220,
    height: 300,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '96%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    borderWidth: 3,         
    borderColor: '#000',      
    borderRadius: 19,       
  },
  overlayImage: {
    width: 212,
    height: 300,
    position: 'absolute',
    bottom: 0,
  },
  bottomSection: {
    flex: 1,
    marginTop: 40,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tabButton: {
    marginHorizontal: 20,
    width: 70,
    height: 34,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: Colors.mint,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  itemBox: {
    width: boxSize,
    height: boxSize,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderRadius: 10,
  },
  itemBoxSelected: {
    borderWidth: 2,
    borderColor: Colors.mint,
  },
  itemInPreview: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  skyPosition: {
    top: 20,
    alignSelf: 'center',
  },
  leftPosition: {
    bottom: 15,
    left: 20,
  },
  rightPosition: {
    bottom: 15,
    right: 20,
  },
  cancelButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.mint,
    width: 86,
    height: 38,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },

  confirmButton: {
    backgroundColor: Colors.mint,
    borderRadius: 20,
    width: 120,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  purchaseFixedButton: {
    backgroundColor: Colors.mint,
    borderRadius: 20,
    width: 60,
    height: 38,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
    
  },
  treeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
