import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/AppNavigator';
import { api, mockApi } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import PublicationCard from '../../components/PublicationCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API'den gelen User tipini içe aktarın
import type { User as ApiUser } from '../../services/api';

type ProfileScreenProps = {
  navigation: BottomTabNavigationProp<MainTabParamList, 'Profile'>;
};

// Profile için kendi tipimiz (API'den gelenin genişletilmiş hali)
interface ProfileUser {
  id: number;
  name: string;
  email: string;
  title?: string;
  institution?: string;
  avatar?: string; 
  bio?: string;
  profileImage?: string;
  publications: number;
  followers: number;
  following: number;
}

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

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [userPublications, setUserPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Fetching user data...');
      
      // Get the currently logged in user from AsyncStorage (try both keys)
      let userData = await AsyncStorage.getItem('user');
      if (!userData) {
        userData = await AsyncStorage.getItem('currentUser');
      }
      
      if (!userData) {
        throw new Error('Kullanıcı bulunamadı');
      }
      
      console.log('User data found in storage');
      const currentUser = JSON.parse(userData);
      
      // İlk olarak mock veriyi başlatalım
      await mockApi.initMockData();
      console.log('Mock data initialized');
        
      try {
        // Use mockApi for local testing
        console.log('Fetching user profile for ID:', currentUser.id);
        const userResponse = await mockApi.getUserProfile(currentUser.id);
        
        if (userResponse && userResponse.data) {
          console.log('Profile fetched successfully:', userResponse.data);
          // API User tipinden ProfileUser tipine dönüştür
          const user: ProfileUser = {
            ...userResponse.data,
            avatar: userResponse.data.profileImage,
            // API'den gelen istatistik alanlarını direkt kullan, yoksa 0 ver
            publications: userResponse.data.publications ?? 0,
            followers: userResponse.data.followers ?? 0,
            following: userResponse.data.following ?? 0
          };
          setUser(user);
        
          console.log('Fetching user publications');
          const publicationsResponse = await mockApi.getUserPublications(currentUser.id);
          
          if (publicationsResponse && publicationsResponse.data) {
            console.log('Publications fetched:', publicationsResponse.data.length);
            // Transform the publications to match expected format
            const transformedPublications = publicationsResponse.data.map((pub: any) => ({
              ...pub,
              comments: Array.isArray(pub.comments) ? pub.comments : []
            }));
            setUserPublications(transformedPublications);
          } else {
            console.log('No publications data received');
            setUserPublications([]);
          }
        } else {
          console.log('No user profile data received');
          throw new Error('Profil verileri alınamadı');
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        // Use the current user data as fallback
        setUser({
          ...currentUser,
          avatar: currentUser.profileImage,
          publications: currentUser.publications ?? 0,
          followers: currentUser.followers ?? 0,
          following: currentUser.following ?? 0
        });
        setUserPublications([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Profil verilerini yüklerken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Clear user session
              await AsyncStorage.removeItem('user');
              await AsyncStorage.removeItem('token');
              // Navigate to login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handlePublicationPress = (publicationId: number) => {
    navigation.navigate('PublicationDetail', { publicationId });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'User not found'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetters}>
                {user.name?.split(' ').map(part => part[0]).join('').toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userTitle}>{user.title}</Text>
          <Text style={styles.userInstitution}>{user.institution}</Text>
          {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.publications}</Text>
          <Text style={styles.statLabel}>Publications</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
      
      <View style={styles.publicationsContainer}>
        <Text style={styles.sectionTitle}>My Publications</Text>
        
        {userPublications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't published anything yet.</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => navigation.navigate('CreatePublication')}
            >
              <Text style={styles.createButtonText}>Create Publication</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={userPublications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PublicationCard
                publication={item}
                onPress={() => handlePublicationPress(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
  },
  profileHeader: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    position: 'relative',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetters: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  userInstitution: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  userBio: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  publicationsContainer: {
    flex: 1,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default ProfileScreen; 