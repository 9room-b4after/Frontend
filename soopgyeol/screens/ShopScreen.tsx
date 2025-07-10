import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ImageBackground, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../components/Colors';
import type { RootStackParamList } from '../types/navigation';  
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const TABS = ['하늘', '왼쪽 땅', '오른쪽 땅'];
const CATEGORY_MAP: { [key: string]: string } = {
  SKY: '하늘',
  LEFT_GROUND: '왼쪽 땅',
  RIGHT_GROUND: '오른쪽 땅',
};
const previewOverlays: { [key: string]: any } = {
  하늘: require('../assets/bg_store_high.png'),
  '왼쪽 땅': require('../assets/bg_store_left.png'),
  '오른쪽 땅': require('../assets/bg_store_right.png'),
};
const screenWidth = Dimensions.get('window').width;
const boxSize = (screenWidth - 20 * 2 - 12 * 2) / 3;

export default function ShopScreen() {
  const [selectedTab, setSelectedTab] = useState('오른쪽 땅');
  const [itemsByCategory, setItemsByCategory] = useState<{ [key: string]: any[] }>({});
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [userMoney, setUserMoney] = useState<number | null>(null); 
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [treeUrl, setTreeUrl] = useState<string | null>(null);
  
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

  const handleItemPress = (item: any) => {
    setSelectedItem((prev) => (prev?.id === item.id ? null : item));
  };
  useEffect(() => {
    const fetchItemsByCategory = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;
        const categoryKey = Object.entries(CATEGORY_MAP).find(([_, v]) => v === selectedTab)?.[0];
        if (!categoryKey) return;

        const res = await axios.get(`https://soopgyeol.site/items/category/${categoryKey}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItemsByCategory(prev => ({
          ...prev,
          [selectedTab]: res.data.data,
        }));
        setSelectedItem(null);
      } catch (err) {
    }
    };
    fetchItemsByCategory();
  }, [selectedTab]);

  const handlePurchase = async () => {
    if (!selectedItem) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
          console.log('[구매 요청] 아이템 ID:', selectedItem.id);

      const res = await axios.post(`https://soopgyeol.site/items/buy`,
        { itemId: selectedItem.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
       console.log('[구매 응답]', data);
      if (data && data.message) {
        
        alert(data.message);
        setSelectedItem(null);
        fetchUserMoney(); 
      } else {
        alert('알 수 없는 응답입니다.');
      }
    } catch (error) {
      console.error('구매 실패:', error);
      alert('구매 중 오류가 발생했습니다.');
    }
  };
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
        <Text style={styles.title}>미리보기</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.coinContainer}>
          <Image
            source={require('../assets/img_store_point.png')}
            style={styles.coinIcon}
            resizeMode='contain'
          />
        <Text style={styles.coinText}>
          {userMoney !== null ? `${userMoney}` : '-'}
        </Text>
        </View>
      </View>
    </View>
    <View style={styles.previewRow}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Inventory')}
        style={styles.inventoryFixedButton}  
      >
        <Image source={require('../assets/ic_inventory.png')} style={{ width: 30, height: 30 }} />
      </TouchableOpacity>

      <View style={styles.previewBox}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Inventory')}
            style={styles.sideButton}
          >
            <Image source={require('../assets/ic_inventory.png')} style={{ width: 28, height: 28 }} />
          </TouchableOpacity>
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
          style={[
            styles.overlayImage,
            selectedTab === '하늘' && { bottom: -95 },
          ]}
          resizeMode="contain"
        />
        {selectedItem && (
          <Image
            source={{ uri: selectedItem.url }}
            style={[
              styles.itemInPreview,
              selectedTab === '하늘'
                ? styles.skySize 
                : {},
              selectedTab === '하늘'
                ? styles.skyPosition
                : selectedTab === '왼쪽 땅'
                ? styles.leftPosition
                : styles.rightPosition,
            ]}
            resizeMode="contain"
          />
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.purchaseFixedButton,
          { opacity: selectedItem ? 1 : 0 } 
        ]}
        onPress={handlePurchase}
        disabled={!selectedItem}
      >
        <Text style={styles.purchaseButtonText}>
          구매
        </Text>
      </TouchableOpacity>
      </View>
      <ImageBackground
        source={require('../assets/bg_store_white.png')}
        style={styles.bottomSection}
        resizeMode="cover"
      >
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
        <View style={styles.itemGrid}>
          {currentItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemBox,
                selectedItem?.id === item.id && styles.itemBoxSelected,
                (index + 1) % 3 !== 0 ? { marginRight: 12 } : { marginRight: 0 },
              ]}
              onPress={() => handleItemPress(item)}
            >
              <Image
                source={{ uri: item.url }}
                style={{ width: '100%', height: '100%', borderRadius: 10 }}
                resizeMode="cover"
              />

              <View style={styles.coinOverlayAbsolute}>
                <View style={styles.coinBackground}>
                  <Image
                    source={require('../assets/ic_shop_price.png')}
                    style={styles.coinIconImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.coinPriceText}>{item.price}</Text>
                </View>
              </View>
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
  backText: {
    fontSize: 20,
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
    position: 'relative',
    width: 60,
  },
  coinIcon: {
    width: 80,
    height: 30,
    marginRight: 4,
  },
  coinText: {
    position: 'absolute',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
    color: Colors.yellow
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  purchaseFixedButton: {
    backgroundColor: Colors.mint,
    borderRadius: 20,
    width: 60,
    height: 38,
    marginLeft: 5,
    marginTop: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBox: {
    width: 220,
    height: 300,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative', 
  },
  previewImage: {
    width: '99%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    borderWidth: 3,         
    borderColor: '#000',      
    borderRadius: 19,       
  },
  overlayImage: {
    width: 213,
    height: 300,
    position: 'absolute',
    bottom: 0, 
  },
  bottomSection: {
    flex: 1,
    marginTop: 20,
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
    fontWeight: 'bold'
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
  sideButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inventoryFixedButton: {
    backgroundColor: Colors.mint,
    borderRadius: 10,
    width: 44,
    height: 44,
    marginTop: 250,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  purchaseButton: {
    backgroundColor: Colors.mint,
    width: 86,
    height: 38,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  itemInPreview: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  skySize: {
    width: 200,
    height: 100,
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
  coinBackground: {
    flexDirection: 'row',    
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    paddingHorizontal: 8,  
    paddingVertical: 4,      
  },

  coinIconImage: {
    width: 16,
    height: 16,
    marginRight: 4,  
  },

  coinPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  coinOverlayAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
