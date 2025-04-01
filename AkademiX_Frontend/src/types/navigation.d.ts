// Type declarations for React Navigation modules
declare module '@react-navigation/native' {
  export function useNavigation(): any;
  export function NavigationContainer(props: any): JSX.Element;
  export type RouteProp<T, K extends keyof T> = {
    key: string;
    name: K;
    params: T[K];
  };
}

declare module '@react-navigation/stack' {
  export type StackNavigationProp<T, K extends keyof T> = any;
  export type StackNavigationOptions = any;
  export function createStackNavigator<T = Record<string, object>>(): {
    Navigator: React.ComponentType<any>;
    Screen: React.ComponentType<any>;
  };
}

declare module '@react-navigation/bottom-tabs' {
  export type BottomTabNavigationProp<T, K extends keyof T> = any;
  export type BottomTabNavigationOptions = any;
  export function createBottomTabNavigator<T = Record<string, object>>(): {
    Navigator: React.ComponentType<any>;
    Screen: React.ComponentType<any>;
  };
}

// Type declarations for Expo icons
declare module '@expo/vector-icons' {
  import React from 'react';
  import { TextStyle } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle;
  }

  export const Ionicons: React.ComponentType<IconProps>;
} 