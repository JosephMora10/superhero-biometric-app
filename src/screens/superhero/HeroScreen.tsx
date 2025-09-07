import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { HeroesStackParams } from '../../routes/HeroesStack';
import { useHeroes } from '../../hooks/useHeroes';
import { useFavorites } from '../../context/FavoritesContext';
import { useCallback } from 'react';
import { Superhero } from '../../interfaces/superhero';

export default function HeroScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<HeroesStackParams, 'Hero'>>();
  const navigation = useNavigation();
  const { heroes } = useHeroes();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const heroId = route.params?.heroId;
  const hero = useMemo(() => heroes.find(h => h.id === heroId), [heroes, heroId]);

  const handleFavoritePress = useCallback((hero: Superhero) => {
      if (isFavorite(hero.id)) {
        removeFavorite(hero.id);
      } else {
          addFavorite(hero);
        }
    }, [addFavorite, removeFavorite, isFavorite]);

  if (!hero) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TouchableOpacity style={[styles.circleBtn, styles.backBtn]} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  const stats = hero.powerstats || {};
  const values = ['intelligence','strength','speed','durability','power','combat']
    .map(k => Number((stats as any)[k]) || 0);
  const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

  return (
    <View style={[styles.screen, { backgroundColor: '#322030' }]}>

      <View style={styles.headerImageWrap}>
        <Image
          source={{ uri: hero.images?.lg || hero.images?.md || hero.images?.sm }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={[styles.headerActions, { top: 12 + insets.top }]}>
          <TouchableOpacity style={[styles.circleBtn, styles.backBtn]} onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.circleBtn, styles.favBtn]} activeOpacity={0.85}
            onPress={() => {
              handleFavoritePress(hero);
            }}
          >
            <Icon name={isFavorite(hero.id) ? 'heart' : 'heart-outline'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        scrollEnabled={false}
        style={styles.contentScroll}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentCard}>
          <Text style={styles.heroName}>{hero.name}</Text>

          <View style={{ marginTop: 6 }}>
            {!!hero.biography?.fullName && (
              <Text style={styles.bioLine}>
                <Text style={styles.bioLabel}>Real Name: </Text>
                <Text style={styles.bioStrong}>{hero.biography.fullName}</Text>
              </Text>
            )}
            {!!hero.biography?.alterEgos && (
              <Text style={styles.bioLine}>
                <Text style={styles.bioLabel}>Alter egos: </Text>
                <Text style={styles.bioStrong}>{hero.biography.alterEgos}</Text>
              </Text>
            )}
          </View>

          <View style={styles.statsList}>
            {[
              { key: 'Intelligence', value: stats.intelligence },
              { key: 'Strength', value: stats.strength },
              { key: 'Speed', value: stats.speed },
              { key: 'Durability', value: stats.durability },
              { key: 'Power', value: stats.power },
              { key: 'Combat', value: stats.combat },
            ].map(row => (
              <View key={row.key} style={styles.statRow}>
                <Text style={styles.statKey} numberOfLines={1} ellipsizeMode="tail">{row.key}</Text>
                <Text style={styles.statValue}>{typeof row.value === 'number' ? row.value : Number(row.value) || 0}</Text>
                <View style={styles.statSpacer} />
              </View>
            ))}
          </View>

          <View style={styles.avgRow}>
            <Icon name="fitness" size={16} color="#ffd54f" />
            <Text style={styles.avgLabel}>Avg. Score:</Text>
            <Text style={styles.avgValue}>{avg}</Text>
            <Text style={styles.avgMax}>/ 100</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImageWrap: {
    width: '100%',
    aspectRatio: 1.1,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerActions: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    backgroundColor: '#322030',
  },
  favBtn: {
    backgroundColor: '#322030',
  },
  contentScroll: {
    flex: 1,
  },
  contentCard: {
    backgroundColor: '#322030',
    padding: 16,
  },
  heroName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
  },
  bioLine: {
    color: '#c7bedb',
    marginTop: 6,
  },
  bioLabel: {
    color: '#c7bedb',
  },
  bioStrong: {
    color: '#fff',
    fontWeight: '700',
  },
  statsList: {
    marginTop: 14,
    borderTopColor: '#c1a2a0',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#c1a2a0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statKey: {
    color: '#c7bedb',
    fontSize: 14,
    flex: 1,
  },
  statValue: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    width: 100,
    fontVariant: ['tabular-nums'],
    fontSize: 15,
  },
  statSpacer: {
    width: 150,
  },
  avgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 6,
  },
  avgLabel: {
    color: '#c7bedb',
    marginLeft: 4,
    width: 125,
  },
  avgValue: {
    color: '#fff',
    fontWeight: '800',
  },
  avgMax: {
    color: '#c7bedb',
    opacity: 0.7,
  },
});