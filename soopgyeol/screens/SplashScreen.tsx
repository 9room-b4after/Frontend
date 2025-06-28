import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation'; 
import Colors from '../components/Colors';

const seedImages = [
  { source: require('../assets/img_seed_first.png'), width: 50, height: 61 },
  { source: require('../assets/img_seed_second.png'), width: 138, height: 103 },
  { source: require('../assets/img_seed_third.png'), width: 236, height: 194 },
  { source: require('../assets/img_seed_fourth.png'), width: 257, height: 222 },
];

export default function SplashScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fullText = '숲으로 산책가는 중...';
    const [displayedText, setDisplayedText] = useState('');
    const [seedIndex, setSeedIndex] = useState(0);
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const animateSeed = () => {
    scaleAnim.setValue(0.7);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  };
    useEffect(() => {
        const timer = setTimeout(() => {
        navigation.navigate('Login'); 
        }, 4000); 

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let currentIndex = 0;

        const interval = setInterval(() => {
            setDisplayedText(fullText.slice(0, currentIndex + 1));
            currentIndex++;

            if (currentIndex === fullText.length) {
            currentIndex = 0;
            setDisplayedText('');
            }
        }, 100); // 글자 간 시간 (ms)

        return () => clearInterval(interval);
    }, []);
     
    useEffect(() => {
      animateSeed(); 
      const growInterval = setInterval(() => {
        setSeedIndex(prev => {
          const next = prev < seedImages.length - 1 ? prev + 1 : prev;
          if (next !== prev) animateSeed(); 
          return next;
        });
      }, 1000);

      return () => clearInterval(growInterval);
    }, []);

    const currentSeed = seedImages[seedIndex];

    return (
    <View style={styles.container}>
        {/* 상단 박스 */}
        <View style={styles.topBox}>
        <Image source={require('../assets/ic_start_logo.png')} style={styles.logo} />
        <Text style={styles.title}>
            더 나은 {'\n'}
            <Text style={styles.highlight}>지구</Text>를 위해
        </Text>
        </View>

        {/* 중앙 박스 */}
        <View style={styles.centerBox}>
            <View style={styles.earthWrapper}>
                <Image source={require('../assets/img_earth.png')} style={styles.earth}/>
                  <Animated.Image
                    source={currentSeed.source}
                    style={[
                      styles.seed,
                      {
                        width: currentSeed.width,
                        height: currentSeed.height,
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                      },
                    ]}
                  />
                <View style={styles.loadingBox}>
                    <Text style={styles.loadingText}>{displayedText}</Text>
                </View>
            </View>

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    },
  topBox: {
    marginTop: 100,
    marginLeft: 20,
    paddingHorizontal: 20,
    },

  logo: {
    width: 60,
    height: 60,
    marginBottom: 40,
    },

  title: {
    fontSize: 65,
    fontWeight: 'bold',
    },

  highlight: {
    color: Colors.greeen,
    },

  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    },

  earthWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'flex-end',
    },

  earth: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    },

  seed: {
    position: 'absolute',
    bottom: '100%', 
    width: 120,
    height: 103,
    resizeMode: 'contain',
    marginBottom: -10,
    },

  loadingBox: {
    backgroundColor: '#fff',
    position: 'absolute', 
    bottom: 70, 
    height: 70,
    width: 280,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 28,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    },

  loadingText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',   
    alignSelf: 'center'
    },
});
