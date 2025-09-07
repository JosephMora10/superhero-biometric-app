import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { TeamsStackParamList } from '../../routes/TeamsStack';
import { useTeams } from '../../hooks/useTeams';
import { useHeroes } from '../../hooks/useHeroes';
import AddHeroComponent from '../../components/AddHeroesComponent';

export default function AddTeamMemberScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<TeamsStackParamList, 'AddTeamMember'>>();
  const navigation = useNavigation();
  const teamId = route.params.teamId;

  const { teams, addMember, removeMember } = useTeams();
  const { filtered, loading, error, reload, fromCache, query, setQuery } = useHeroes();

  const team = teams.find(t => t.id === teamId);
  const selectedIds = team?.memberIds ?? [];

  const onSelect = useCallback(
    (hero: { id: number }) => {
      if (!team) return;
      const isMember = selectedIds.includes(hero.id);
      if (isMember) {
        removeMember(teamId, hero.id);
      } else {
        addMember(teamId, hero.id);
      }
    },
    [team, teamId, selectedIds, addMember, removeMember]
  );

  if (!team) {
    return (
      <View style={{ flex: 1, backgroundColor: '#725b75' }} />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#725b75' }}>
      <View style={{ paddingTop: insets.top, backgroundColor: '#725b75' }} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Members</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.searchRow}>
        <Icon name="search" size={18} color="#fff" />
        <TextInput
          placeholder="Search Heroes"
          placeholderTextColor="#fff"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          autoCapitalize="none"
        />
      </View>

      <AddHeroComponent
        data={filtered}
        loading={loading}
        error={error}
        reload={reload}
        fromCache={fromCache}
        onSelect={onSelect}
        selectedIds={selectedIds}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 0,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#322030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9a829f',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
});