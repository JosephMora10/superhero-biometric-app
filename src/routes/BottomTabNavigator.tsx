import React from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HeroesStack from './HeroesStack';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import TeamsStack from './TeamsStack';
import Icon from '@react-native-vector-icons/ionicons';

export type BottomTabsParams = {
  Heroes: undefined;
  Teams: undefined;
  Favorites: undefined;
}

const Tab = createBottomTabNavigator<BottomTabsParams>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      animation: 'fade',
      tabBarActiveTintColor: '#322030',
      tabBarInactiveTintColor: '#c1a2a0',
      tabBarStyle:{
        backgroundColor:'#725b75',
    },
    tabBarIcon: (  { color, focused } : any ) => {
      let iconName :any = '';
      switch (route.name) {
        case 'Heroes':
          iconName=focused
          ? 'person'
          : 'person-sharp'
        break;

        case 'Teams':
          iconName=focused
          ? 'people'
          : 'people-sharp'
        break;

        case 'Favorites':
          iconName=focused
          ? 'heart'
          : 'heart-sharp'
        break;
      }
      return <Icon name={ iconName } size={ 25 } color={color} />
  }
    })}>
      <Tab.Screen 
        name="Heroes"
        component={ HeroesStack }
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'HeroesHome';
          return {
            title: 'Heroes',
            tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
            tabBarStyle: {
              backgroundColor: '#725b75',
              display: routeName === 'Hero' ? 'none' : 'flex',
            },
          };
        }}
      />
      <Tab.Screen options={{ title: 'Teams', tabBarLabelStyle: { fontSize: 14, fontWeight: '600' } }} name="Teams" component={ TeamsStack } />
      <Tab.Screen options={{ title: 'Favorites', tabBarLabelStyle: { fontSize: 14, fontWeight: '600' } }} name="Favorites" component={ FavoritesScreen } />
    </Tab.Navigator>
  );
}