import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { api, mockApi } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../themes/colors';

type RegisterScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Auth'>;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }: RegisterScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleRegister = async () => {
    try {
      if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !title.trim() || !institution.trim()) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      setLoading(true);

      // Use mockApi for local testing
      try {
        await mockApi.register({
          name,
          email,
          password,
          title,
          institution,
          bio: '',
          profileImage: 'https://via.placeholder.com/100',
        });
        
        Alert.alert(
          'Success',
          'Registration successful! You can now login.',
          [
            {
              text: 'OK',
              onPress: () => {
                const authNavigation = navigation as any;
                authNavigation.navigate('Login');
              }
            }
          ]
        );
      } catch (mockError) {
        Alert.alert('Error', 'Registration failed. This email might already be in use.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../../assets/icon.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerText}>Join AkademiX</Text>
          <Text style={styles.subHeaderText}>Create your academic profile</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          
          <TextInput
            style={[styles.input, nameError ? styles.inputError : null]}
            placeholder="Full Name"
            placeholderTextColor="#AAA"
            value={name}
            onChangeText={setName}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Email"
            placeholderTextColor="#AAA"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="Password"
            placeholderTextColor="#AAA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          
          <TextInput
            style={[styles.input, confirmPasswordError ? styles.inputError : null]}
            placeholder="Confirm Password"
            placeholderTextColor="#AAA"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          
          <TextInput
            style={styles.input}
            placeholder="Title (e.g., Professor, PhD Student)"
            placeholderTextColor="#AAA"
            value={title}
            onChangeText={setTitle}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Institution"
            placeholderTextColor="#AAA"
            value={institution}
            onChangeText={setInstitution}
          />
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: colors.secondaryDark,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: colors.textOnSecondary,
    opacity: 0.8,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border.dark,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: colors.secondaryLight,
    color: colors.textOnSecondary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: colors.primaryDark,
    opacity: 0.5,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
  },
});

export default RegisterScreen; 