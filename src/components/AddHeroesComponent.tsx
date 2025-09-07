import React, { useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Superhero } from '../interfaces/superhero';
import Icon from '@react-native-vector-icons/ionicons';

export interface AddHeroComponentProps {
  data: Superhero[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  fromCache: boolean;
  onSelect?: (hero: Superhero) => void;
  selectedIds?: number[];
}

export default function AddHeroComponent({ data, loading, error, reload, fromCache, onSelect, selectedIds = [] }: AddHeroComponentProps) {
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(({ item }: { item: Superhero }) => {
    const stats = item.powerstats || ({} as Superhero['powerstats']);
    const values = [
      stats?.intelligence,
      stats?.strength,
      stats?.speed,
      stats?.durability,
      stats?.power,
      stats?.combat,
    ].filter((v): v is number => typeof v === 'number' && isFinite(v));
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const safePower = Math.max(0, Math.min(100, Math.round(avg)));

    const isSelected = selectedIds.includes(item.id);
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.images.md || item.images.sm }} style={styles.avatar} />

        <View style={styles.meta}>
          <Text style={styles.name}>{item.name}</Text>
          {!!item.biography?.fullName && (
            <Text style={styles.fullName}>{item.biography.fullName}</Text>
          )}

          <View style={styles.statRow}>
            <Icon name="fitness" size={16} color="#ffd54f" />
            <Text style={styles.statValue}>{safePower}</Text>
            <Text style={styles.statMax}>/ 100</Text>
          </View>
        </View>

        {onSelect && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.addBtnRight, isSelected && styles.removeBtn]}
            onPress={() => onSelect(item)}
          >
            <Icon name={isSelected ? 'remove' : 'add'} size={22} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [selectedIds, onSelect]);

  if (loading && data.length === 0) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}> 
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading heroes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}> 
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1}}>
      <FlatList
      showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        ListHeaderComponent={fromCache ? (
          <Text style={styles.cacheBanner}>Offline mode: showing cached data</Text>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { 
    alignItems: 'center', 
    paddingVertical: 24,
  },
  loadingText: { 
    marginTop: 8,
  },
  errorText: { 
    color: '#c00'
  },
  cacheBanner: {
    backgroundColor: '#fffbdd',
    padding: 8,
    borderRadius: 6,
    color: '#8a6d3b',
    marginBottom: 8,
  },
  card: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
  },
  avatar: { 
    width: 56,
    height: 56, 
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  meta: { 
    flex: 1,
  },
  name: { 
    fontWeight: 'bold', 
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
  },
  fullName: { 
    color: '#c7bedb', 
    fontSize: 13,
    opacity: 0.85,
    marginBottom: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    color: '#ffd54f',
    fontWeight: '700',
    fontSize: 14,
  },
  statMax: {
    color: '#c1b6d6',
    opacity: 0.6,
    fontSize: 13,
    marginLeft: 2,
  },
  addBtnRight: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7a5cff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    backgroundColor: '#c62828',
  },
});