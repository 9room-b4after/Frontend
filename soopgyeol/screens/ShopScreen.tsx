import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'react-native';
import Colors from '../components/Colors';


const TABS = ['하늘', '왼쪽 땅', '오른쪽 땅'];
const previewOverlays: { [key: string]: any } = {
  하늘: require('../assets/bg_store_high.png'),
  '왼쪽 땅': require('../assets/bg_store_left.png'),
  '오른쪽 땅': require('../assets/bg_store_right.png'),
};
const screenWidth = Dimensions.get('window').width;
const boxSize = (screenWidth - 20 * 2 - 12 * 2) / 3;

export default function ShopScreen() {
  const [selectedTab, setSelectedTab] = useState('오른쪽 땅');
  const navigation = useNavigation();
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const handleItemPress = (index: number) => {
    setSelectedItemIndex(prev => (prev === index ? null : index)); // toggle
  };

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image source={require('../assets/ic_back_arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>미리보기</Text>
        <View style={styles.coinContainer}>
          <Image
            source={require('../assets/img_store_point.png')}
            style={styles.coinIcon}
            resizeMode='contain'
          />
          <Text style={styles.coinText}>-</Text>
        </View>
      </View>

      {/* 프리뷰 이미지 */}
      <View style={styles.previewBox}>
        <Image
          source={require('../assets/img_store_preview.png')} 
          style={styles.previewImage}
          resizeMode='contain'
        />
        <Image
          key={selectedTab} // 이걸로 React가 제대로 리렌더함
          source={previewOverlays[selectedTab]}
          style={[
            styles.overlayImage,
            selectedTab === '하늘' && { bottom: -95 },
          ]}
          resizeMode="contain"
        />
        {/* 하늘 아이템 */}
{selectedTab === '하늘' && selectedItemIndex !== null && (
  <Image
    source={require('../assets/img_item_sample.png')} // 아가씨의 아이템 이미지로 교체
    style={[styles.itemInPreview, styles.skyPosition]}
    resizeMode="contain"
  />
)}

{/* 왼쪽 땅 아이템 */}
{selectedTab === '왼쪽 땅' && selectedItemIndex !== null && (
  <Image
    source={require('../assets/img_item_sample.png')}
    style={[styles.itemInPreview, styles.leftPosition]}
    resizeMode="contain"
  />
)}

{/* 오른쪽 땅 아이템 */}
{selectedTab === '오른쪽 땅' && selectedItemIndex !== null && (
  <Image
    source={require('../assets/img_item_sample.png')}
    style={[styles.itemInPreview, styles.rightPosition]}
    resizeMode="contain"
  />
)}

      </View>
    <ImageBackground
      source={require('../assets/bg_store_white.png')}
      style={styles.bottomSection}
      resizeMode="cover" // 필요에 따라 contain/cover로 조절
    >
    {/* 탭 버튼 */}
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
    {/* 아이템 그리드 */}
      <View style={styles.itemGrid}>
          {[...Array(6)].map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.itemBox,
                selectedItemIndex === index && styles.itemBoxSelected,
              ]}
              onPress={() => handleItemPress(index)}
            />
          ))}
        </View>
      </ImageBackground>

      {/* 구매 버튼 */}
      {selectedItemIndex !== null && (
        <View style={styles.purchaseButtonContainer}>
          <TouchableOpacity style={styles.purchaseButton}>
            <Text style={styles.purchaseButtonText}>구매하기</Text>
          </TouchableOpacity>
        </View>
      )}
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
  previewBox: {
    width: 220,
    height: 300,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative', 
  },
  previewImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0, 
  },
  overlayImage: {
    width: 213,
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
    fontWeight: 'bold'
  },
  tabTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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

  purchaseButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
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
  },

  skyPosition: {
    top: 70,
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

});
