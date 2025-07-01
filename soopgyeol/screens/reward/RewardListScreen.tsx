import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';

const DATA = [
  {
    id: '1',
    title: '다회용컵 사용 3회',
    status: '완수',
    date: '5/22',
  },
];

export default function RewardListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const renderItem = ({ item }: { item: typeof DATA[0] }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemStatus}>{item.status}</Text>
      </View>
      <Text style={styles.itemDate}>{item.date}</Text>
    </View>
  );

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
      </View>
      {/* 리스트 */}
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  itemContainer: {
    backgroundColor: '#EDEDEF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemStatus: {
    fontSize: 15,
  },
  itemDate: {
    fontSize: 13,
    color: '#7F7F7F80',
  },
});