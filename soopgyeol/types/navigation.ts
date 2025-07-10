// types/navigation.ts
export type TabParamList = {
  Home: undefined;
  Calendar: undefined;
  Reward: undefined;
  Shop: undefined;
  Profile: undefined;
};
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Nickname: undefined;
  RewardList: undefined;
  Reward: undefined;
  RewardDetail: { challengeId: number; keyword: string; category: string; };
  Inventory: undefined;
  Main: { screen: keyof TabParamList;  };
  Home: undefined;
  Shop: undefined;
  Profile: undefined;
  Search: undefined;
  Detail: { name: string; carbonGrams: number; categoryKorean: string; explanation: string; carbonItemId: number; categoryImageUrl: string; };
};
