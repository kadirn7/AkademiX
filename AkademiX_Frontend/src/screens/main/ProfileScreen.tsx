import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainTabParamList, RootStackParamList } from '../../navigation/AppNavigator';
import { AuthService } from '../../services/auth.service';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';
import PublicationCard from '../../components/PublicationCard';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../themes/colors';

type ProfileScreenProps = {
  navigation: BottomTabNavigationProp<MainTabParamList, 'Profile'>;
};

type User = {
  id: number;
  name: string;
  email: string;
  title: string;
  institution: string;
  bio: string;
  profileImage: string;
};

type Publication = {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
  likes: number;
  comments: any[];
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }: ProfileScreenProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    institution: '',
    bio: '',
  });

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to load user profile');
    }
  };

  const fetchUserPublications = async () => {
    try {
      const response = await api.get('/users/publications');
      setPublications(response.data);
    } catch (error) {
      console.error('Error fetching user publications:', error);
      Alert.alert('Error', 'Failed to load user publications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserPublications();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      await AsyncStorage.removeItem('token');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const handlePublicationPress = (publicationId: number) => {
    navigation.navigate('PublicationDetail', { publicationId });
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = await UserService.updateUser(formData);
      if (updatedUser) {
        setUser({
          ...updatedUser,
          name: updatedUser.fullName || '',
          email: updatedUser.email || '',
          title: updatedUser.title || '',
          institution: updatedUser.institution || '',
          bio: updatedUser.bio || '',
          profileImage: updatedUser.profileImage || '',
          id: updatedUser.id || 0
        });
      }
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={
            user.profileImage
              ? { uri: user.profileImage }
              : { uri: 'https://via.placeholder.com/100' }
          }
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userTitle}>{user.title} at {user.institution}</Text>
        {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}
      </View>
      
      <View style={styles.publicationsSection}>
        <Text style={styles.sectionTitle}>My Publications</Text>
        {publications.length === 0 ? (
          <Text style={styles.emptyText}>You haven't published any articles yet.</Text>
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
          />
        )}
      </View>
      
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreatePublication')}
          style={styles.createButton}
        >
          Create New Publication
        </Button>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  profileHeader: {
    backgroundColor: colors.secondaryLight,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.dark,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.textOnSecondary,
  },
  userTitle: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
  },
  userBio: {
    fontSize: 14,
    color: colors.textOnSecondary,
    opacity: 0.8,
    textAlign: 'center',
  },
  publicationsSection: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textOnSecondary,
    opacity: 0.7,
    marginTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.dark,
    backgroundColor: colors.secondaryLight,
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
  },
  actionButtons: {
    padding: 15,
  },
  createButton: {
    marginBottom: 10,
    backgroundColor: colors.primary,
  },
  createButtonText: {
    color: colors.textOnPrimary,
  },
  logoutButton: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  logoutButtonText: {
    color: colors.error,
  },
});

export default ProfileScreen; 