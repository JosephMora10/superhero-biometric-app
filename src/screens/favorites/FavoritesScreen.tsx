import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useFavorites } from '../../context/FavoritesContext';
import HeroesComponent from '../../components/HeroesComponent';
import Icon from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const { favorites, isLoading } = useFavorites();
  const insets = useSafeAreaInsets();

  const renderEmpty = useCallback(() => (
    <View style={[styles.emptyContainer, { paddingBottom: insets.bottom }]}>
      <Text style={styles.emptyText}>No favorite heroes yet</Text>
    </View>
  ), [insets]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: insets.top, backgroundColor: '#725b75' }} />
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <Text style={styles.title}>Favorites</Text>
        
        {favorites.length === 0 ? (
          renderEmpty()
        ) : (
          <HeroesComponent
            data={favorites}
            loading={false}
            error={null}
            reload={() => {}}
            fromCache={false}
          />
        )}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 12,
    paddingHorizontal: 8,
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: -40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#fff',
  },
});
