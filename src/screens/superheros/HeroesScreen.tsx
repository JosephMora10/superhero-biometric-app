import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useHeroes } from '../../hooks/useHeroes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeroesComponent from '../../components/HeroesComponent';
import Icon from '@react-native-vector-icons/ionicons';

export default function HeroesScreen() {
  const { filtered, loading, error, query, setQuery, reload, fromCache } = useHeroes();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#725b75' }}>
      <View style={{ paddingTop: insets.top, backgroundColor: '#725b75' }} />
      <View style={[styles.container]}>
        <Text style={styles.title}>Superheroes</Text>
        <View style={styles.searchRow}>
          <Icon name="search" size={20} color="#fff" />
          <TextInput
            placeholder="Search"
            value={query}
            placeholderTextColor="#fff"
            onChangeText={setQuery}
            style={styles.searchInput}
            autoCapitalize="none"
          />
        </View>

        <HeroesComponent
          data={filtered}
          loading={loading}
          error={error}
          reload={reload}
          fromCache={fromCache}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#725b75',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#fff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c1a2a0',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
});
