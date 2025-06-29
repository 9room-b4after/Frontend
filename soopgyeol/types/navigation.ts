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
  Main: {
    screen?: keyof TabParamList;
    params?: {
      newPost?: {
        id: number;
        name: string;
        time: string;
        content: string;
        image?: { uri: string };
        comments: number;
        likes: number;
        shares: number;
        profile: any;
      };
    };
  };  
  Home: undefined;
  Shop: undefined;
  Profile: undefined;
  SearchScreen: undefined;
  DetailScreen: { name: string; carbonGrams: number; category: string; explanation: string;
  };
};
