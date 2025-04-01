import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, mockApi } from '../../services/api';

type IconName = 'heart' | 'heart-outline';

type Comment = {
  id: number;
  content?: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
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
  liked?: boolean;
  comments: Comment[];
};

type PublicationDetailScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'PublicationDetail'>;
  route: RouteProp<RootStackParamList, 'PublicationDetail'>;
};

const PublicationDetailScreen: React.FC<PublicationDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { publicationId } = route.params;
  
  const [publication, setPublication] = useState<Publication | null>(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    loadPublicationDetails();
  }, [publicationId]);

  const loadPublicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mockApi for local testing
      const response = await mockApi.getPublicationById(publicationId);
      setPublication(response.data);
    } catch (error) {
      console.error('Error fetching publication details:', error);
      setError('Failed to load publication details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePress = async () => {
    if (!publication) return;
    
    try {
      if (publication.liked) {
        // Use mockApi for local testing
        await mockApi.unlikePublication(publication.id);
      } else {
        // Use mockApi for local testing
        await mockApi.likePublication(publication.id);
      }
      
      // Refresh publication details
      loadPublicationDetails();
    } catch (error) {
      console.error('Error updating like status:', error);
      Alert.alert('Error', 'Failed to update like status. Please try again.');
    }
  };

  const handleCommentSubmit = async () => {
    if (!publication || !commentText.trim()) return;
    
    try {
      setSubmitting(true);
      
      // Use mockApi for local testing
      await mockApi.createComment({
        publicationId: publication.id,
        content: commentText.trim()
      });
      
      // Clear comment text and refresh publication details
      setCommentText('');
      loadPublicationDetails();
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Error', 'Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy - h:mm a');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading publication...</Text>
      </View>
    );
  }

  if (error || !publication) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Publication not found'}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={loadPublicationDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{publication.title}</Text>
          <View style={styles.authorContainer}>
            <Text style={styles.author}>By {publication.author.name}</Text>
            <Text style={styles.date}>{formatDate(publication.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.content}>{publication.content}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleLikePress}
          >
            <Ionicons 
              name={publication.liked ? "heart" : "heart-outline"} 
              size={24} 
              color={publication.liked ? "#FF3B30" : "#666"}
            />
            <Text style={styles.actionText}>{publication.likes} Likes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>Comments ({publication.comments.length})</Text>
          
          {loadingComments ? (
            <ActivityIndicator style={styles.commentsLoading} size="small" color="#007AFF" />
          ) : (
            <>
              {publication.comments.length === 0 ? (
                <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
              ) : (
                publication.comments.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.author.name}</Text>
                      <Text style={styles.commentDate}>
                        {formatDate(comment.createdAt)}
                      </Text>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </View>
                ))
              )}
            </>
          )}
          
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!commentText.trim() || submitting) && styles.submitButtonDisabled
              ]}
              onPress={handleCommentSubmit}
              disabled={!commentText.trim() || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
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
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  author: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  commentsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  commentsLoading: {
    marginVertical: 20,
  },
  noCommentsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  commentItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  addCommentContainer: {
    marginTop: 16,
    flexDirection: 'row',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    maxHeight: 100,
  },
  submitButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default PublicationDetailScreen; 