import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import colors from '../themes/colors';

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

type PublicationCardProps = {
  publication: Publication;
  onPress: () => void;
};

const PublicationCard: React.FC<PublicationCardProps> = ({ publication, onPress }) => {
  // Format the date to a readable format
  const formattedDate = publication.createdAt 
    ? format(new Date(publication.createdAt), 'MMM d, yyyy') 
    : '';

  // Truncate the content if it's too long
  const truncateContent = (content?: string) => {
    if (!content) return '';
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.author}>{publication.author.name}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      
      <Text style={styles.title}>{publication.title}</Text>
      <Text style={styles.content}>{truncateContent(publication.content)}</Text>
      
      <View style={styles.footer}>
        <View style={styles.stat}>
          <Ionicons name="heart-outline" size={16} color={colors.primary} />
          <Text style={styles.statText}>{publication.likes}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.primary} />
          <Text style={styles.statText}>{publication.comments.length}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  author: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  date: {
    fontSize: 12,
    color: colors.textOnSecondary,
    opacity: 0.7,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.textOnSecondary,
  },
  content: {
    fontSize: 14,
    color: colors.textOnSecondary,
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border.dark,
    paddingTop: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.textOnSecondary,
    opacity: 0.8,
  },
});

export default PublicationCard; 