import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { useTeams } from '../../hooks/useTeams';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useBiometricAuth } from '../../hooks/useBiometricAuth';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { TeamsStackParamList } from '../../routes/types';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeroes } from '../../hooks/useHeroes';
import HeroesComponent from '../../components/HeroesComponent';

export interface TeamDetailScreenProps {
  teamId?: string;
  onBack?: () => void;
}

export default function TeamDetailScreen(props: TeamDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<TeamsStackParamList, 'TeamDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<TeamsStackParamList, 'TeamDetail'>>();
  const teamId = props.teamId ?? route?.params?.teamId;
  const handleBack = useCallback(() => {
    if (props.onBack) { 
      props.onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('TeamsHome');
    }
  }, [navigation, props.onBack]);
  const { teams, reload } = useTeams();
  const { authenticate, isAuthenticating } = useBiometricAuth();
  const { heroes } = useHeroes();
  const team = useMemo(() => teams.find(t => t.id === teamId) || null, [teams, teamId]);
  const memberHeroes = useMemo(() => {
    if (!team) return [] as typeof heroes;
    return heroes.filter(h => team.memberIds.includes(h.id));
  }, [heroes, team]);

  const onAddMember = useCallback(async () => {
    if (!teamId) {
      Alert.alert('Error', 'Team ID is missing');
      return;
    }
    
    try {
      const isAuthenticated = await authenticate('Authenticate to add team members');
      if (isAuthenticated) {
        navigation.navigate('AddTeamMember', { teamId });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'Authentication failed. Please try again.');
    }
  }, [navigation, teamId, authenticate]);

  useFocusEffect(
    useCallback(() => {
      reload();
      return () => { };
    }, [reload])
  );

  if (!team) {
    return (
      <View style={styles.detailContainer}>
        <Text style={styles.emptyText}>Team not found</Text>
        <TouchableOpacity 
          style={[styles.modalBtn, styles.modalPrimary]} 
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
        >
          <Text style={styles.modalBtnText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#725b75' }}>
      <View style={[styles.detailHeader, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
        >
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>{team.name}</Text>
        <TouchableOpacity style={styles.addBtnTop} onPress={onAddMember}>
          <Icon name="add-sharp" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {team.memberIds.length === 0 ? (
          <View style={styles.centerEmpty}>
            <Text style={styles.emptyText}>No Team Members</Text>
          </View>
        ) : (
          <View style={styles.detailContainer}>
            <HeroesComponent
              data={memberHeroes}
              loading={false}
              error={null}
              reload={() => {}}
              fromCache={false}
            />
          </View>
        )}
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#725b75',
  },
  detailContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#725b75',
    paddingTop: 0,
  },
  emptyText: {
    fontSize: 23,
    color: '#fff',
    textAlign: 'center',
  },
  centerEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalPrimary: {
    backgroundColor: '#322030',
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#725b75',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#322030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnTop: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#322030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  detailSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9a829f',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  detailSearchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  heroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#876f8a',
    padding: 12,
    borderRadius: 12,
  },
  teamIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#322030',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  heroActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroActionAdd: {
    backgroundColor: '#2e7d32',
  },
  heroActionRemove: {
    backgroundColor: '#c62828',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#876f8a',
    padding: 12,
    borderRadius: 12,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  memberName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
