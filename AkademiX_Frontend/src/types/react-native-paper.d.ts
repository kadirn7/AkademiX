declare module 'react-native-paper' {
  import * as React from 'react';
  import { StyleProp, TextStyle, ViewStyle } from 'react-native';

  export interface FABProps {
    icon: string;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
  }

  export interface ButtonProps {
    mode?: 'text' | 'outlined' | 'contained';
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    color?: string;
    disabled?: boolean;
    loading?: boolean;
  }

  export const FAB: React.ComponentClass<FABProps>;
  export const Button: React.ComponentClass<ButtonProps>;
} 