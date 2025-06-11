import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { TaskManagerScreen } from './src/screens/TaskManagerScreen';
import { TaskSummaryScreen } from './src/screens/TaskSummaryScreen';
import { colors } from './src/styles/colors';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.borderLight,
            paddingTop: 8,
            paddingBottom: 8,
            height: 60,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>🏠</Text>
            ),
          }}
        />
        <Tab.Screen
          name="TaskManager"
          component={TaskManagerScreen}
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>📋</Text>
            ),
          }}
        />
        <Tab.Screen
          name="TaskSummary"
          component={TaskSummaryScreen}
          options={{
            title: 'Summary',
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>📊</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}