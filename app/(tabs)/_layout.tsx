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
          left: 36,
          right: 36,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          height: 66,
          borderRadius: 33,
          paddingBottom: 0,
          shadowColor: colorScheme === 'dark' ? '#000' : '#8A99AD',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: colorScheme === 'dark' ? 0.35 : 0.15,
          shadowRadius: 20,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          paddingBottom: 6,
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, borderRadius: 33, overflow: 'hidden' }}>
            <BlurView
              tint={colorScheme === 'dark' ? 'systemMaterialDark' : 'systemMaterialLight'}
              intensity={80}
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFill}
            />
            {/* Glass border reflection */}
            <View style={[StyleSheet.absoluteFill, { 
              borderWidth: 1, 
              borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', 
              borderRadius: 33 
            }]} />
          </View>
        ),
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerBackground: () => (
          <BlurView
            tint={colorScheme === 'dark' ? 'systemMaterialDark' : 'systemMaterialLight'}
            intensity={80}
            style={StyleSheet.absoluteFill}
          />
        ),
        headerTransparent: true,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
          letterSpacing: 0.3,
        },
        headerTintColor: Colors[colorScheme].text,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.scores') || 'Scores',
          tabBarIcon: ({ color }) => <TabBarIcon name="soccer-ball-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: t('tabs.schedule') || 'Schedule',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: t('tabs.compare') || 'Compare',
          tabBarIcon: ({ color }) => <TabBarIcon name="exchange" color={color} />,
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
