// screens/reward/RewardDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RewardDetailScreen() {
  return (
    <View style={styles.container}>
      <Text>리워드 상세</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
