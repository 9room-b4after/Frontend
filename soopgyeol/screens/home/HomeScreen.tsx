// screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, SafeAreaView } from 'react-native';
import { Feather, MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import Colors from '../../components/Colors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import TopHeader from '../../components/TopHeader';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const [selectedTopIcon, setSelectedTopIcon] = useState<'shop' | 'profile' | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <TopHeader selected={selectedTopIcon} onSelect={setSelectedTopIcon} />
      {/* 제목 및 설명 */}
      <View style={styles.textBox}>
        <Text style={styles.title}>
          오늘은 <Text style={styles.highlight}>나무</Text>가{'\n'}얼마나 자랐을까요?
        </Text>
        <Text style={styles.subtitle}>
          <Text style={styles.grade}>-</Text> 단계군요! 금방 <Text style={styles.nextgrade}>싹</Text>이 틀 거예요.
        </Text>
      </View>

      {/* 배경 위에 씨앗 이미지 겹치기 */}
      <ImageBackground
        source={require('../../assets/img_home_main.png')}
        style={styles.backgroundImage}
        imageStyle={{ borderRadius: 20 }}
      >
        <Image
          source={require('../../assets/img_seed_first.png')}
          style={styles.seedImage}
          resizeMode="contain"
        />
      </ImageBackground>
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
  },
  subtitle: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: '600',
  },
  grade: {
    color: Colors.mint,
  },
  nextgrade: {
    color: Colors.mint,
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
  seedImage: {
    width: '100%',
    height: 30,
    position: 'absolute', 
    bottom: 35,     
  },
});
