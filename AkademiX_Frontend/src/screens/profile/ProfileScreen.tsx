import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/AppNavigator';
import { api, mockApi } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import PublicationCard from '../../components/PublicationCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../themes/colors';

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
        <ActivityIndicator size="large" color={colors.primary} />
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
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
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
            contentContainerStyle={styles.publicationsList}
          />
        )}
      </View>
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
    backgroundColor: colors.secondary,
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.secondaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.dark,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarLetters: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.textOnSecondary,
  },
  userTitle: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 2,
  },
  userInstitution: {
    fontSize: 14,
    color: colors.textOnSecondary,
    opacity: 0.8,
    marginBottom: 5,
  },
  userBio: {
    fontSize: 14,
    color: colors.textOnSecondary,
    opacity: 0.7,
    lineHeight: 20,
  },
  logoutButton: {
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: colors.secondaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.dark,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textOnSecondary,
    opacity: 0.8,
    marginTop: 2,
  },
  publicationsContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textOnSecondary,
    opacity: 0.7,
    marginBottom: 20,
    textAlign: 'center',
  },
  publicationsList: {
    paddingBottom: 20,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 