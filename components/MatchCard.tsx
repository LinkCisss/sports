import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import CountryFlag from 'react-native-country-flag';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import { MatchOdds } from '@/lib/oddsApi';
import { checkIsFavorite, addFavorite, removeFavorite } from '@/lib/favorites';
import { useColorScheme } from '@/components/useColorScheme';
import { BlurView } from 'expo-blur';

interface MatchCardProps {
  matchData?: MatchOdds; // For saving favorites
  league: string;
  time: string;
  team1: { name: string; score: string | number; flagCode?: string };
  team2: { name: string; score: string | number; flagCode?: string };
  oddsList?: Array<{ providerName: string; team1: number; draw: number; team2: number }>;
}

export function MatchCard({ matchData, league, time, team1, team2, oddsList }: MatchCardProps) {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const isLive = time.includes('LIVE') || time.includes("'");
  const { t } = useTranslation();

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (matchData) {
      checkIsFavorite(matchData.id).then(setIsFavorite);
    }
  }, [matchData]);

  const toggleFavorite = async (e: any) => {
    // 阻止事件冒泡，防止点击红心时触发外层的页面跳转
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();

    if (!matchData) return;
    if (isFavorite) {
      setIsFavorite(false);
      await removeFavorite(matchData.id);
    } else {
      setIsFavorite(true);
      await addFavorite(matchData);
    }
  };

  return (
    <View style={[
      styles.card, 
      theme === 'light' ? styles.shadowLight : styles.shadowDark,
      { backgroundColor: colors.cardBackground, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }
    ]}>
      <BlurView
        tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'}
        intensity={60}
        style={StyleSheet.absoluteFill}
      />
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.leagueBadge, { backgroundColor: colors.accent + '20' }]}>
          <Text style={[styles.leagueText, { color: colors.accent }]}>{league}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={[styles.timeText, { color: isLive ? colors.accent : colors.textSecondary }]}>
            {time}
          </Text>
          {matchData && (
            <Pressable onPress={toggleFavorite} hitSlop={15}>
              <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={20} color={isFavorite ? colors.accent : colors.icon} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Teams and Scores */}
      <View style={styles.matchInfo}>
        <View style={styles.teamRow}>
          <View style={styles.teamLeft}>
            {team1.flagCode && (
              <CountryFlag isoCode={team1.flagCode} size={24} style={styles.flag} />
            )}
            <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={1}>
              {team1.name}
            </Text>
          </View>
          <Text style={[styles.score, { color: colors.text }]}>{team1.score}</Text>
        </View>

        <View style={styles.teamRow}>
          <View style={styles.teamLeft}>
            {team2.flagCode && (
              <CountryFlag isoCode={team2.flagCode} size={24} style={styles.flag} />
            )}
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
                <View style={[styles.oddBox, { backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.15)', borderWidth: 1, borderColor: colors.border }]}>
                  <Text style={[styles.oddLabel, { color: colors.textSecondary }]}>1</Text>
                  <Text style={[styles.oddValue, { color: colors.text }]}>{odds.team1.toFixed(2)}</Text>
                </View>
                <View style={[styles.oddBox, { backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.15)', borderWidth: 1, borderColor: colors.border }]}>
                  <Text style={[styles.oddLabel, { color: colors.textSecondary }]}>X</Text>
                  <Text style={[styles.oddValue, { color: colors.text }]}>{odds.draw.toFixed(2)}</Text>
                </View>
                <View style={[styles.oddBox, { backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.15)', borderWidth: 1, borderColor: colors.border }]}>
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
    borderRadius: 24, // High-end luxurious corner radius
    padding: 20, // Ample padding for breathing room
    marginVertical: 10,
    marginHorizontal: 16,
  },
  shadowLight: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  shadowDark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leagueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12, // Pill shape
  },
  leagueText: {
    ...Typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeText: {
    ...Typography.body,
    fontWeight: '700',
    fontSize: 15,
  },
  matchInfo: {
    gap: 20, // More breathing room between teams
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // Space between flag and name
    flex: 1,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  flag: {
    width: 32,
    height: 24,
    borderRadius: 4,
  },
  teamName: {
    ...Typography.teamName,
    flex: 1,
  },
  score: {
    ...Typography.scores,
    minWidth: 40,
    textAlign: 'right',
  },
  oddsContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  oddProviderContainer: {
    marginBottom: 12,
  },
  providerText: {
    ...Typography.caption,
    fontSize: 12,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1, // Elegant tracking
  },
  oddsBoxes: {
    flexDirection: 'row',
    gap: 10,
  },
  oddBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12, // Taller buttons for tap targets
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  oddLabel: {
    ...Typography.caption,
    opacity: 0.6,
  },
  oddValue: {
    ...Typography.body, // Slightly larger font for values
    fontWeight: '700',
    fontVariant: ['tabular-nums'], // Monospaced digits for perfect alignment
  },
});
