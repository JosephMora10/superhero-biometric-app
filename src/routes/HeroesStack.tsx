import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HeroesScreen from '../screens/superheros/HeroesScreen';
import HeroScreen from '../screens/superhero/HeroScreen';

export type HeroesStackParams = {
  HeroesHome: undefined;
  Hero: { heroId: number };
};

const Stack = createNativeStackNavigator<HeroesStackParams>();

export default function HeroesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="HeroesHome" component={HeroesScreen} />
      <Stack.Screen name="Hero" component={HeroScreen} />
    </Stack.Navigator>
  );
}
