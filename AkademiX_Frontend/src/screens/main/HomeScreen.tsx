import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text, ActivityIndicator } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { MainTabParamList, RootStackParamList } from '../../navigation/AppNavigator';
import { api, mockApi } from '../../services/api';
import PublicationCard from '../../components/PublicationCard';
import { FAB } from 'react-native-paper';
import colors from '../../themes/colors';

type HomeScreenProps = {
  navigation: BottomTabNavigationProp<MainTabParamList, 'Home'>;
};

type Publication = {
  id: number;
  title?: string;
  content?: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
  likes: number;
  comments: any[];
};

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const fetchPublications = async () => {
    try {
      setError(null);
      // Use mockApi for local testing
      const response = await mockApi.getPublications();
      setPublications(response.data);
    } catch (error) {
      console.error('Error fetching publications:', error);
      setError('Failed to load publications. Pull down to refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPublications();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handlePublicationPress = (publicationId: number) => {
    navigation.navigate('PublicationDetail', { publicationId });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading publications...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {publications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No publications found.</Text>
          <Text style={styles.emptySubText}>Create your first publication by tapping the + button.</Text>
        </View>
      ) : (
        <FlatList
          data={publications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PublicationCard
              publication={item}
              onPress={() => handlePublicationPress(item.id)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('CreatePublication')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textOnSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textOnSecondary,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textOnSecondary,
    opacity: 0.7,
    textAlign: 'center',
  },
  listContent: {
    padding: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default HomeScreen; 