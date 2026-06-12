import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StyleSheet, Platform, View, Pressable, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

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
        tabBarButton: ({ onPress, children, style }: any) => (
          <Pressable
            style={style}
            onPress={(e) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              onPress?.(e);
            }}
          >
            {children}
          </Pressable>
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 30 : 20,
          left: 24,
          right: 24,
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
          <View style={{ 
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 24,
            right: 24,
            borderRadius: 33, 
            overflow: 'hidden', 
            backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)' 
          }}>
            <BlurView
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              intensity={20}
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFill}
            />
            {/* Glass border reflection */}
            <View style={[StyleSheet.absoluteFill, { 
              borderWidth: 1, 
              borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.35)', 
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
            intensity={45}
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
          title: t('tabs.schedule') || 'Schedule',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="odds"
        options={{
          title: t('tabs.scores') || 'Scores',
          tabBarIcon: ({ color }) => <TabBarIcon name="soccer-ball-o" color={color} />,
          headerShown: false,
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
          href: null,
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
