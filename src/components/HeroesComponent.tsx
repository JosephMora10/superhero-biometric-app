import React, { useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Superhero } from '../interfaces/superhero';
import Icon from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext';

export interface HeroesComponentProps {
  data: Superhero[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  fromCache: boolean;
  onSelect?: (hero: Superhero) => void;
  selectedIds?: number[];
  addIconName?: string; 
  removeIconName?: string;
  style?: any;
}

export default function HeroesComponent({ 
  data, 
  loading, 
  error, 
  reload, 
  fromCache, 
  onSelect, 
  selectedIds = [], 
  addIconName = 'heart-outline', 
  removeIconName = 'heart',
  style,
}: HeroesComponentProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  const handleFavoritePress = useCallback((hero: Superhero) => {
    if (onSelect) {
      onSelect(hero);
    } else {
      if (isFavorite(hero.id)) {
        removeFavorite(hero.id);
      } else {
        addFavorite(hero);
      }
    }
  }, [addFavorite, removeFavorite, isFavorite, onSelect]);

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
    const onPressCard = () => {
      navigation.navigate('Heroes' as never, {
        screen: 'Hero',
        params: { heroId: item.id },
      } as never);
    };

    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPressCard} style={styles.card}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.images.md || item.images.sm }} style={styles.avatar} />
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.favBtn} 
            onPress={() => handleFavoritePress(item)}
          >
            <Icon 
              name={isFavorite(item.id) ? removeIconName as any : addIconName as any} 
              size={24} 
              color={isFavorite(item.id) ? "#ff3e3e" : "#ffffff"} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.meta}>
          <Text style={styles.name}>{item.name}</Text>
          {!!item.biography?.fullName && (
            <Text style={styles.fullName}>{item.biography.fullName}</Text>
          )}

          <View style={styles.statRow}>
            {safePower > 50 ? (
              <Icon name="thumbs-up-sharp" size={18} color="#ffd54f" />
            ) : (
              <Icon name="thumbs-down-sharp" size={18} color="#ffd54f" />
            )}
            <Text style={styles.statValue}>{safePower}</Text>
            <Text style={styles.statMax}>/ 100</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [selectedIds, onSelect]);

  if (loading) {
    return (
      <View style={[styles.center, { paddingVertical: 24 }, style]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { padding: 16 }, style]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={reload} style={styles.retryButton}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={[styles.listContent, style]}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reload} />
      }
      ListEmptyComponent={
        <View style={[styles.center, style]}>
          <Text>No heroes found</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { 
    alignItems: 'center', 
    paddingVertical: 24,
  },
  listContent: {
    paddingBottom: 16,
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
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
    marginVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    backgroundColor: '#2a1f39',
    overflow: 'hidden',
  },
  imageWrap: {
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  avatar: { 
    width: 185,
    height: 185, 
    backgroundColor: '#eee',
    position: 'relative',
  },
  favBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7a5cff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { 
    flex: 1,
  },
  name: { 
    fontWeight: 'bold', 
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 4,
  },
  fullName: { 
    color: '#b7a9c9', 
    fontSize: 14,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: '#ffd54f',
    fontWeight: '700',
    fontSize: 14,
  },
  statMax: {
    color: '#c1b6d6',
    opacity: 0.7,
    fontSize: 14,
  }
});