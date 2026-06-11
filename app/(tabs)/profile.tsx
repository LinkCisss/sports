import React from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme, useAppTheme } from '@/components/useColorScheme';
import { LiquidBackground } from '@/components/LiquidBackground';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ProfileScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { themeMode, setThemeMode } = useAppTheme();
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const toggleLanguage = async () => {
    const nextLang = i18n.language === 'zh' ? 'en' : 'zh';
    await i18n.changeLanguage(nextLang);
    await AsyncStorage.setItem('app_language', nextLang);
  };

  return (
    <View style={{ flex: 1 }}>
      <LiquidBackground />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingTop: 96 }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('profile.title')}</Text>
        </View>

        {/* User Stats Card */}
        <View style={[
          styles.card, 
          { backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border }
        ]}>
          <BlurView 
            tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} 
            intensity={60} 
            style={StyleSheet.absoluteFill} 
          />
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)' }]} />
          <Text style={[styles.userName, { color: colors.text }]}>{t('profile.guest_user')}</Text>
          <Text style={[styles.stats, { color: colors.textSecondary }]}>{t('profile.stats')}</Text>
        </View>

        {/* Features Card */}
        <View style={[
          styles.settingsCard, 
          { backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border }
        ]}>
          <BlurView 
            tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} 
            intensity={60} 
            style={StyleSheet.absoluteFill} 
          />
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{isZh ? '常用功能' : 'Features'}</Text>
          
          {/* Favorites Link */}
          <Pressable 
            onPress={() => router.push('/(tabs)/favorites')} 
            style={({ pressed }) => [
              styles.featureItem,
              pressed && { opacity: 0.7 }
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome name="heart" size={16} color={colors.accent || '#FF6B6B'} style={{ marginRight: 12 }} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>{isZh ? '我的收藏' : 'My Favorites'}</Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Settings Card */}
        <View style={[
          styles.settingsCard, 
          { backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border }
        ]}>
          <BlurView 
            tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} 
            intensity={60} 
            style={StyleSheet.absoluteFill} 
          />
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('profile.settings')}</Text>
          
          {/* Language Setting */}
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>{t('profile.language')}</Text>
            <Pressable 
              onPress={toggleLanguage} 
              style={[
                styles.button, 
                { 
                  backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.15)', 
                  borderWidth: 1, 
                  borderColor: colors.border 
                }
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>
                {i18n.language === 'zh' ? t('profile.chinese') : t('profile.english')}
              </Text>
            </Pressable>
          </View>

          {/* Theme Mode Setting */}
          <View style={[styles.settingItem, { marginTop: 20 }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>{isZh ? '主题设置' : 'Theme'}</Text>
            <View 
              style={[
                styles.themeSelector, 
                { 
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                  borderColor: colors.border
                }
              ]}
            >
              {(['light', 'dark', 'auto'] as const).map((mode) => {
                const isActive = themeMode === mode;
                const modeLabel = {
                  light: isZh ? '浅色' : 'Light',
                  dark: isZh ? '深色' : 'Dark',
                  auto: isZh ? '自动' : 'Auto',
                }[mode];

                return (
                  <Pressable
                    key={mode}
                    onPress={() => setThemeMode(mode)}
                    style={[
                      styles.themeTab,
                      isActive ? { backgroundColor: colors.accent } : { backgroundColor: 'transparent' }
                    ]}
                  >
                    <Text
                      style={[
                        styles.themeTabText,
                        { color: isActive ? '#FFFFFF' : colors.textSecondary }
                      ]}
                    >
                      {modeLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
        
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    ...Typography.header,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  userName: {
    ...Typography.teamName,
    marginBottom: 4,
  },
  stats: {
    ...Typography.body,
  },
  settingsCard: {
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    ...Typography.caption,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    ...Typography.body,
    fontWeight: '600',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  buttonText: {
    ...Typography.caption,
    fontWeight: '700',
  },
  themeSelector: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 2,
    borderWidth: 1,
  },
  themeTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeTabText: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 12,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
});
