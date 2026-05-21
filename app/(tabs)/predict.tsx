import React from 'react';
import { StyleSheet, ScrollView, View, Text, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function PredictScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Make a Prediction</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
          Prediction interface will go here.
        </Text>
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
    minHeight: 200,
  },
  placeholderText: {
    ...Typography.body,
    textAlign: 'center',
  },
});
