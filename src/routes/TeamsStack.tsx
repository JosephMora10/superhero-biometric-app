import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import TeamsScreen from '../screens/teams/TeamsScreen';
import TeamDetailScreen from '../screens/teams/TeamDetailScreen';
import AddTeamMemberScreen from '../screens/teams/AddTeamMemberScreen';

// Re-export the params type for use in other files
export type TeamsStackParamList = {
  TeamsHome: undefined;
  TeamDetail: { teamId: string };
  AddTeamMember: { teamId: string };
};

const Stack = createNativeStackNavigator<TeamsStackParamList>();

export default function TeamsStack() {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
        headerBackTitle: '',
        animation: Platform.OS === 'ios' ? 'default' : 'fade',
      }}
    >
      <Stack.Screen 
        name="TeamsHome" 
        component={TeamsScreen} 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="TeamDetail" 
        component={TeamDetailScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="AddTeamMember" 
        component={AddTeamMemberScreen}
        options={{
          headerShown: false,
          presentation: Platform.OS === 'ios' ? 'modal' : 'card',
        }}
      />
    </Stack.Navigator>
  );
}
