import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Superhero } from '../interfaces/superhero';

type FavoritesContextType = {
  favorites: Superhero[];
  addFavorite: (hero: Superhero) => Promise<void>;
  removeFavorite: (heroId: number) => Promise<void>;
  isFavorite: (heroId: number) => boolean;
  isLoading: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = '@StarTrack/favorites';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Superhero[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorites', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const saveFavorites = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        } catch (error) {
          console.error('Failed to save favorites', error);
        }
      };

      saveFavorites();
    }
  }, [favorites, isLoading]);

  const addFavorite = useCallback(async (hero: Superhero) => {
    setFavorites(prevFavorites => {
      if (!prevFavorites.some(fav => fav.id === hero.id)) {
        return [...prevFavorites, hero];
      }
      return prevFavorites;
    });
  }, []);

  const removeFavorite = useCallback(async (heroId: number) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(hero => hero.id !== heroId)
    );
  }, []);

  const isFavorite = useCallback((heroId: number) => {
    return favorites.some(hero => hero.id === heroId);
  }, [favorites]);

  if (isLoading) {
    return null;
  }

  return (
    <FavoritesContext.Provider 
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
