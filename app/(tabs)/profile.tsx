import React from 'react';
import { StyleSheet, ScrollView, View, Text, useColorScheme, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { t, i18n } = useTranslation();

  const toggleLanguage = async () => {
    const nextLang = i18n.language === 'zh' ? 'en' : 'zh';
    await i18n.changeLanguage(nextLang);
    await AsyncStorage.setItem('app_language', nextLang);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('profile.title')}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]} />
        <Text style={[styles.userName, { color: colors.text }]}>{t('profile.guest_user')}</Text>
        <Text style={[styles.stats, { color: colors.textSecondary }]}>{t('profile.stats')}</Text>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('profile.settings')}</Text>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>{t('profile.language')}</Text>
          <Pressable onPress={toggleLanguage} style={[styles.button, { backgroundColor: colors.background }]}>
            <Text style={[styles.buttonText, { color: colors.text }]}>
              {i18n.language === 'zh' ? t('profile.chinese') : t('profile.english')}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    ...Typography.header,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
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
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    ...Typography.caption,
    fontWeight: '700',
  },
});
