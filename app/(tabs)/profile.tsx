import React from 'react';
import { StyleSheet, ScrollView, View, Text, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function ProfileScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Profile</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]} />
        <Text style={[styles.userName, { color: colors.text }]}>Guest User</Text>
        <Text style={[styles.stats, { color: colors.textSecondary }]}>0 Predictions • 0 Points</Text>
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
});
