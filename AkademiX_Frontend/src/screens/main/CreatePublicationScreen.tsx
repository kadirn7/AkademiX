import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { api, mockApi } from '../../services/api';
import colors from '../../themes/colors';

type CreatePublicationScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CreatePublication'>;
};

const CreatePublicationScreen: React.FC<CreatePublicationScreenProps> = ({ navigation }: CreatePublicationScreenProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.trim().length < 50) {
      newErrors.content = 'Content should be at least 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Use mockApi for local testing
      await mockApi.createPublication({
        title: title.trim(),
        content: content.trim()
      });
      
      Alert.alert(
        'Success',
        'Your publication has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      console.error('Error creating publication:', error);
      Alert.alert('Error', 'Failed to create publication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.screenTitle}>Create Publication</Text>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={[styles.input, errors.title ? styles.inputError : null]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter a title for your publication"
              maxLength={100}
            />
            {errors.title ? (
              <Text style={styles.errorText}>{errors.title}</Text>
            ) : null}
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={[styles.textArea, errors.content ? styles.inputError : null]}
              value={content}
              onChangeText={setContent}
              placeholder="Write your publication content here..."
              multiline
              textAlignVertical="top"
            />
            {errors.content ? (
              <Text style={styles.errorText}>{errors.content}</Text>
            ) : null}
          </View>
          
          <TouchableOpacity
            style={[styles.submitButton, loading ? styles.submitButtonDisabled : null]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Publish</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  scrollContainer: {
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: colors.textOnSecondary,
  },
  formField: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.primary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: colors.secondaryLight,
    color: colors.textOnSecondary,
  },
  textArea: {
    height: 200,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
    backgroundColor: colors.secondaryLight,
    color: colors.textOnSecondary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: colors.primaryDark,
    opacity: 0.5,
  },
  submitButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border.medium,
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 16,
  },
});

export default CreatePublicationScreen; 