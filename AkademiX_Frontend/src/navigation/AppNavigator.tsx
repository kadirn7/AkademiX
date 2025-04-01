import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcons';
import colors from '../themes/colors';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main screens
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PublicationDetailScreen from '../screens/main/PublicationDetailScreen';
import CreatePublicationScreen from '../screens/main/CreatePublicationScreen';

// Define the param list for the Auth Stack
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Define the param list for the stack navigator
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  PublicationDetail: { publicationId: number };
  CreatePublication: undefined;
};

// Define the param list for the bottom tab navigator
export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Auth Stack component
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }: { route: { name: string } }) => ({
      tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
        let iconName: string = 'home';

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <TabBarIcon name={iconName} focused={focused} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textOnSecondary,
      tabBarStyle: {
        backgroundColor: colors.secondary,
        borderTopColor: colors.border.dark,
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
        paddingBottom: 5,
      },
      headerStyle: {
        backgroundColor: colors.secondary,
        shadowColor: colors.shadow.gold,
        elevation: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.dark,
      },
      headerTintColor: colors.primary,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{
        title: "AkademiX",
        headerShown: true,
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        title: "My Profile",
        headerShown: true,
      }}
    />
  </Tab.Navigator>
);

// Define our own Theme interface that matches what the NavigationContainer expects
interface NavigationTheme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
}

// Main App Navigator
const AppNavigator = () => {
  // Custom NavigationTheme
  const NavigationTheme: NavigationTheme = {
    dark: true,
    colors: {
      primary: colors.primary,
      background: colors.background.dark,
      card: colors.secondary,
      text: colors.textOnSecondary,
      border: colors.border.dark,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={NavigationTheme}>
      <Stack.Navigator 
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: colors.secondary,
            shadowColor: colors.shadow.gold,
            elevation: 5,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen 
          name="PublicationDetail" 
          component={PublicationDetailScreen} 
          options={{
            headerShown: true,
            title: 'Publication Details',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen 
          name="CreatePublication" 
          component={CreatePublicationScreen} 
          options={{
            headerShown: true,
            title: 'Create Publication',
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 