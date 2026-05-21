import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

import { useTranslation } from 'react-i18next';

interface MatchCardProps {
  league: string;
  time: string;
  team1: { name: string; score: string | number };
  team2: { name: string; score: string | number };
  oddsList?: Array<{ providerName: string; team1: number; draw: number; team2: number }>;
}

export function MatchCard({ league, time, team1, team2, oddsList }: MatchCardProps) {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const isLive = time.includes('LIVE') || time.includes("'");
  const { t } = useTranslation();

  return (
    <View style={[
      styles.card, 
      { backgroundColor: colors.cardBackground },
      theme === 'light' && styles.shadow
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.leagueBadge, { backgroundColor: colors.accent + '15' }]}>
          <Text style={[styles.leagueText, { color: colors.accent }]}>{league}</Text>
        </View>
        <Text style={[styles.timeText, { color: isLive ? colors.accent : colors.textSecondary }]}>
          {time}
        </Text>
      </View>

      {/* Teams and Scores */}
      <View style={styles.matchInfo}>
        <View style={styles.teamRow}>
          <View style={styles.teamLeft}>
            <View style={[styles.logoPlaceholder, { backgroundColor: colors.border }]} />
            <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={1}>
              {team1.name}
            </Text>
          </View>
          <Text style={[styles.score, { color: colors.text }]}>{team1.score}</Text>
        </View>

        <View style={styles.teamRow}>
          <View style={styles.teamLeft}>
            <View style={[styles.logoPlaceholder, { backgroundColor: colors.border }]} />
            <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={1}>
              {team2.name}
            </Text>
          </View>
          <Text style={[styles.score, { color: colors.text }]}>{team2.score}</Text>
        </View>
      </View>

      {/* Odds */}
      {oddsList && oddsList.length > 0 && (
        <View style={[styles.oddsContainer, { borderTopColor: colors.border }]}>
          {oddsList.map((odds, index) => (
            <View key={index} style={styles.oddProviderContainer}>
              <Text style={[styles.providerText, { color: colors.textSecondary }]}>
                {t('home.odds_by')}{odds.providerName}
              </Text>
              <View style={styles.oddsBoxes}>
                <View style={[styles.oddBox, { backgroundColor: colors.background }]}>
                  <Text style={[styles.oddLabel, { color: colors.textSecondary }]}>1</Text>
                  <Text style={[styles.oddValue, { color: colors.text }]}>{odds.team1.toFixed(2)}</Text>
                </View>
                <View style={[styles.oddBox, { backgroundColor: colors.background }]}>
                  <Text style={[styles.oddLabel, { color: colors.textSecondary }]}>X</Text>
                  <Text style={[styles.oddValue, { color: colors.text }]}>{odds.draw.toFixed(2)}</Text>
                </View>
                <View style={[styles.oddBox, { backgroundColor: colors.background }]}>
                  <Text style={[styles.oddLabel, { color: colors.textSecondary }]}>2</Text>
                  <Text style={[styles.oddValue, { color: colors.text }]}>{odds.team2.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leagueBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  leagueText: {
    ...Typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timeText: {
    ...Typography.body,
    fontWeight: '600',
    fontSize: 14,
  },
  matchInfo: {
    gap: 16,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  teamName: {
    ...Typography.teamName,
    flex: 1,
  },
  score: {
    ...Typography.scores,
    minWidth: 32,
    textAlign: 'right',
  },
  oddsContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  oddProviderContainer: {
    marginBottom: 12,
  },
  providerText: {
    ...Typography.caption,
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  oddsBoxes: {
    flexDirection: 'row',
    gap: 8,
  },
  oddBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  oddLabel: {
    ...Typography.caption,
    opacity: 0.7,
  },
  oddValue: {
    ...Typography.caption,
    fontWeight: '700',
  },
});
