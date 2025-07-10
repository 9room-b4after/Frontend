// screens/HomeScreen.tsx
import React, { useState, useEffect  } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, SafeAreaView, ActivityIndicator  } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Colors from '../../components/Colors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import TopHeader from '../../components/TopHeader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;


export default function HomeScreen() {
  const [selectedTopIcon, setSelectedTopIcon] = useState<'shop' | 'profile' | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [treeData, setTreeData] = useState<{ treeName: string; treeUrl: string; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayItems, setDisplayItems] = useState({
    SKY: null,
    LEFT_GROUND: null,
    RIGHT_GROUND: null,
  });

  const getNextGradeParts = (treeName?: string) => {
    switch (treeName) {
      case '씨앗':
        return { textBefore: '금방 ', highlight: '싹', textAfter: '이 돋을 거예요' };
      case '새싹':
        return { textBefore: '금방 ', highlight: '나무', textAfter: '가 될 거예요' };
      case '작은 나무':
        return { textBefore: '', highlight: '어디까지 커질까요?', textAfter: '' };
      case '나무':
        return { textBefore: '', highlight: '지구를 지켰습니다!', textAfter: '' };
      default:
        return { textBefore: '', highlight: '...', textAfter: '' };
    }
  };
  const getHighlightColor = (treeName?: string) => {
    if (treeName === '씨앗' || treeName === '새싹') return Colors.mint;
    return '#000';
  };
  
  const { textBefore, highlight, textAfter } = getNextGradeParts(treeData?.treeName);
  const highlightColor = getHighlightColor(treeData?.treeName);

  useEffect(() => {
    const fetchTreeStage = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.warn('토큰이 없습니다. 로그인 필요');
          return;
        }

        const response = await axios.get('https://soopgyeol.site/tree-stage', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.success) {
          setTreeData(response.data.data);
        } else {
          console.warn('나무 단계 정보 없음');
        }
      } catch (error) {
        console.error('나무 단계 API 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreeStage();
  }, 
  []);
  useEffect(() => {
  const fetchDisplayedItems = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const res = await axios.get('https://soopgyeol.site/items/displayed', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const items = res.data.data;

        const categorized = {
          SKY: items.find(item => item.category === 'SKY') || null,
          LEFT_GROUND: items.find(item => item.category === 'LEFT_GROUND') || null,
          RIGHT_GROUND: items.find(item => item.category === 'RIGHT_GROUND') || null,
        };

        setDisplayItems(categorized);
      }
    } catch (error) {
      console.error('전시 아이템 조회 실패:', error);
    }
  };

  fetchDisplayedItems();
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <TopHeader selected={selectedTopIcon} onSelect={setSelectedTopIcon} />

      <View style={styles.textBox}>
        <Text style={styles.title}>
          오늘은 <Text style={styles.highlight}>나무</Text>가{'\n'}얼마나 자랐을까요?
        </Text>
      <Text style={styles.subtitle}>
        <Text style={styles.grade}>{treeData?.treeName ?? '-'}</Text> 단계군요! {textBefore}
        <Text style={[styles.nextgrade, { color: highlightColor }]}>{highlight}</Text>
        {textAfter}
      </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.mint} style={{ marginTop: 40 }} />
      ) : (
        <ImageBackground
          source={
            treeData?.treeUrl
              ? { uri: treeData.treeUrl }
              : require('../../assets/img_home_main.png')
          }
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 20 }}
          >
          <View style={styles.skyPosition}>
            {displayItems.SKY && (
              <Image source={{ uri: displayItems.SKY.url }} style={styles.displayedItemImage} resizeMode="contain" />
            )}
          </View>
          <View style={styles.leftPosition}>
            {displayItems.LEFT_GROUND && (
              <Image source={{ uri: displayItems.LEFT_GROUND.url }} style={styles.displayedItemImage} resizeMode="contain" />
            )}
          </View>

          <View style={styles.rightPosition}>
            {displayItems.RIGHT_GROUND && (
              <Image source={{ uri: displayItems.RIGHT_GROUND.url }} style={styles.displayedItemImage} resizeMode="contain" />
            )}
          </View>
        </ImageBackground>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  topBar: {
    height: 48,
    marginTop: 18,
    justifyContent: 'center',
  },
  shopButton: {
    position: 'absolute',
    left:50,
    top: 0,
    padding: 10,
  },

  profileButton: {
    position: 'absolute',
    right: 50,
    top: 0,
    padding: 10,
  },
  logoButton: {
    alignSelf: 'center',
  },
  logo: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  textBox: {
    marginTop: 33,
    marginLeft: 33,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  highlight: {
    color: Colors.mint,
    fontWeight: 'bold'
  },
  subtitle: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold'
  },
  grade: {
    color: Colors.mint,
    fontWeight: 'bold'
  },
  nextgrade: {
    color: Colors.mint,
    fontWeight: 'bold'
  },
  backgroundImage: {
    width: screenWidth - 54,
    height: 450,
    marginTop: 33,
    marginBottom: 109,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', 
  },
  skyPosition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320,
    alignItems: 'center',  
    justifyContent: 'center',
  },

  leftPosition: {
    position: 'absolute',
    top: 320,
    left: 0,
    width: '50%',
    bottom: 0,
    alignItems: 'center',  
    justifyContent: 'center',
  },

  rightPosition: {
    position: 'absolute',
    top: 320,
    right: 0,
    width: '50%',
    bottom: 0,
    alignItems: 'center',  
    justifyContent: 'center',
  },
  displayedItemImage: {
    width: 130,
    height: 130,
  },

});
