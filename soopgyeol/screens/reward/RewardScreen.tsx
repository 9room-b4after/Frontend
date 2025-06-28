import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground  } from 'react-native';
import Colors from '../../components/Colors';

const { width } = Dimensions.get('window');

export default function RewardScreen() {
return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/bg_profile_mint.png')}
        style={styles.topBackground}
      />
      {/* 상단 바 */}
      <View style={styles.header}>
        <Text style={styles.title}>오늘의 챌린지</Text>
          <View style={styles.subRow}>
            <View style={styles.coinWrapper}>
              <Image source={require('../../assets/ic_just_coin.png')} style={styles.coinImage} />
              <Text style={styles.coinText}>24</Text>
            </View>
            <TouchableOpacity style={styles.queryButton}>
              <Text style={styles.queryText}>조회</Text>
            </TouchableOpacity>
          </View>
      </View>

      {/* 카드 */}
      <View style={styles.card}>
        <ImageBackground
          source={require('../../assets/img_reward_item_bg.png')}
          style={styles.cardBackground}
          resizeMode="contain" >
          <Text style={styles.cardTitle}>다회용컵 사용 3회</Text>
          <Image source={require('../../assets/img_cup.png')} style={styles.cardImage} />
          <View style={styles.badgeRow}>
            <View style={styles.progressBadge}>
              <Text style={styles.progressText}>0 / 3</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>미완수</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* 버튼 */}
      <TouchableOpacity style={styles.rewardButton}>
        <Image source={require('../../assets/ic_just_coin.png')} style={styles.rewardCoinIcon} />
        <View style={styles.rewardTextContainer}>
          <Text style={styles.rewardPoint}>5</Text>
          <Text style={styles.rewardLabel}>포인트 받기</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center'
  },
  topBackground: {
    position: 'absolute',
    width: '100%',
    height: 160, 
    resizeMode: 'cover',
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    height: 40,
    marginBottom: 16,
    position: 'relative',
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subRow: {
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinWrapper: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 80,   
    height: 35, 
    justifyContent: 'center', 
  },
  coinImage: {
    marginLeft: 10,
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  coinText: {
    marginLeft: 40,
    position: 'absolute',
    fontWeight: 'bold',
    color: Colors.yellow,
    fontSize: 20,
  },
  queryButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 80,   
    height: 35, 
    justifyContent: 'center',
    alignItems: 'center', 
  },
  queryText: {
    color: Colors.mint,
    fontWeight: 'bold',
    fontSize: 20,
  },
  card: {
    width: '100%',
    height: 330,
    marginTop: 130,
  },
  cardBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 15,
  },
  cardImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginTop: 50,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
    alignSelf: 'center',
  },
  progressBadge: {
    borderWidth: 2,
    borderColor: Colors.mint,
    borderRadius: 20,
    width: 83,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 70,
  },

  progressText: {
    color: Colors.mint,
    fontWeight: 'bold',
    fontSize: 20,
  },

  statusBadge: {
    backgroundColor: Colors.mint,
    borderRadius: 20,
    width: 83,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  rewardButton: {
    flexDirection: 'row',
    borderWidth: 4,
    borderColor: Colors.mint,
    borderRadius: 16,
    height: 70,
    width: 310,
    marginTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardCoinIcon: {
    width: 25,
    height: 25,
    marginRight: 8,
  },
  rewardTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardPoint: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.yellow, 
    marginRight: 4,
  },

  rewardLabel: {
    fontSize: 20,
    color: Colors.mint,
    fontWeight: 'bold',
  },
});
