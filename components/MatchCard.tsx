import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface MatchCardProps {
  league: string;
  status: string;
  team1: { name: string; score: string | number };
  team2: { name: string; score: string | number };
  odds?: { team1: number; draw: number; team2: number };
}

export function MatchCard({ league, status, team1, team2, odds }: MatchCardProps) {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const isLive = status.includes('LIVE') || status.includes("'");

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.leagueText, { color: colors.textSecondary }]}>{league}</Text>
        <Text style={[styles.statusText, { color: isLive ? colors.accent : colors.textSecondary }]}>
          {status}
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
      {odds && (
        <View style={[styles.oddsContainer, { borderTopColor: colors.border }]}>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leagueText: {
    ...Typography.caption,
    textTransform: 'uppercase',
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '700',
  },
  matchInfo: {
    gap: 12,
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
    width: 28,
    height: 28,
    borderRadius: 14,
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
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  oddBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  oddLabel: {
    ...Typography.caption,
  },
  oddValue: {
    ...Typography.caption,
    fontWeight: '700',
  },
});
