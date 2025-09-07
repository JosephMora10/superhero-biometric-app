import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/ionicons';
import { useTeams } from '../../hooks/useTeams';
import { useNavigation } from '@react-navigation/native';
import { useBiometricAuth } from '../../hooks/useBiometricAuth';
import { Alert } from 'react-native';

export default function TeamsScreen() {
  const insets = useSafeAreaInsets();
  const { teams, loading, createTeam } = useTeams();
  const navigation = useNavigation();

  const [createVisible, setCreateVisible] = useState(false);
  const [teamName, setTeamName] = useState('');

  const { authenticate } = useBiometricAuth();

  const onAddTeam = useCallback(async () => {
    try {
      const isAuthenticated = await authenticate('Authenticate to create a new team');
      if (isAuthenticated) {
        setTeamName('');
        setCreateVisible(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'Authentication failed. Please try again.');
    }
  }, [authenticate]);

  const submitCreate = useCallback(async () => {
    const name = teamName.trim();
    if (!name) return;
    
    try {
      await createTeam(name);
      setCreateVisible(false);
      setTeamName('');
    } catch (error) {
      console.error('Error creating team:', error);
      Alert.alert('Error', 'Failed to create team. Please try again.');
    }
  }, [createTeam, teamName, authenticate]);

  const openTeam = useCallback((teamId: string) => {
    // @ts-ignore route exists in TeamsStack
    navigation.navigate('TeamDetail' as never, { teamId } as never);
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#725b75' }}>
      <View style={{ paddingTop: insets.top, backgroundColor: '#725b75' }} />
      <View style={[styles.container]}>
        <Text style={styles.title}>Teams</Text>
        <TouchableOpacity style={styles.addBtnTop} onPress={onAddTeam}>
          <Icon name="add-sharp" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.teamsList}>
          {loading ? (
            <Text style={styles.emptyText}>Loading teams...</Text>
          ) : teams.length === 0 ? (
            <View style={styles.centerEmpty}>
              <Icon name="people-outline" size={100} color="#fff" />
              <Text style={styles.emptyText}>Create Your First Team</Text>
              <TouchableOpacity style={styles.addBtnCenter} onPress={onAddTeam}>
                <Icon name="add-sharp" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={teams}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openTeam(item.id)} activeOpacity={0.8}>
                  <View style={styles.teamItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.teamName}>{item.name}</Text>
                      <Text style={styles.teamMeta}>{item.memberIds.length} members</Text>
                    </View>
                    <Icon name="arrow-forward-sharp" size={22} color="#fff" />
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>

      {/* Create Team Modal */}
      <Modal visible={createVisible} animationType="fade" transparent onRequestClose={() => setCreateVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Team</Text>
            <View style={styles.modalInputRow}>
              <TextInput
                placeholder="Team name"
                placeholderTextColor="#e9e0f0"
                value={teamName}
                onChangeText={setTeamName}
                style={styles.modalInput}
                autoFocus
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalCancel]} onPress={() => setCreateVisible(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalPrimary, !teamName.trim() && { opacity: 0.6 }]}
                onPress={submitCreate}
                disabled={!teamName.trim()}
              >
                <Text style={styles.modalBtnText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    color: '#322030',
  },
  addBtnTop: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#322030',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamsList: {
    flex: 1,
    paddingVertical: 16,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#876f8a',
    padding: 16,
    borderRadius: 15,
  },
  teamName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  teamMeta: {
    color: '#e9e0f0',
    fontSize: 14,
    opacity: 0.85,
  },
  centerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  addBtnCenter: {
    position: 'relative',
    top: 10,
    backgroundColor: '#322030',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#876f8a',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 12,
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9a829f',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  modalInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalCancel: {
    backgroundColor: '#6d5a72',
  },
  modalPrimary: {
    backgroundColor: '#322030',
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
