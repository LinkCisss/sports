import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StyleSheet, Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tabIconSelected,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 30 : 20,
          left: 36, // Increased from 20 to make the pill shorter horizontally
          right: 36, // Increased from 20 to make the pill shorter horizontally
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          height: 66, // Sleeker height
          borderRadius: 33, // Match height / 2
          paddingBottom: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
        },
        tabBarItemStyle: {
          paddingVertical: 8, // Gentle centering
          paddingBottom: 6, // Slight push up
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, borderRadius: 33, overflow: 'hidden' }}>
            <BlurView
              tint="systemMaterialDark"
              intensity={80}
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFill}
            />
            {/* Dark theme border reflection */}
            <View style={[StyleSheet.absoluteFill, { 
              borderWidth: 1, 
              borderColor: 'rgba(255,255,255,0.1)', 
              borderRadius: 33 
            }]} />
          </View>
        ),
        headerStyle: {
          backgroundColor: Colors[colorScheme].background,
          shadowOpacity: 0,
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerTintColor: Colors[colorScheme].text,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.scores'),
          tabBarIcon: ({ color }) => <TabBarIcon name="futbol-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: t('tabs.compare'),
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('tabs.favorites') || 'Favorites',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
