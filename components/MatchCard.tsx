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
import { getTeamColors } from '@/utils/teamColors';
import * as Haptics from 'expo-haptics';

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
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (matchData) {
      checkIsFavorite(matchData.id).then(setIsFavorite);
    }
  }, [matchData]);

  const toggleFavorite = async (e: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    if (!matchData) return;
    if (isFavorite) {
      setIsFavorite(false);
      await removeFavorite(matchData.id);
    } else {
      setIsFavorite(true);
      await addFavorite(matchData);
    }
  };

  const primaryOdds = oddsList && oddsList.length > 0 ? oddsList[0] : null;

  // Dueling team colors for liquid glass background
  const homeColors = getTeamColors(matchData?.home_team || team1.name);
  const awayColors = getTeamColors(matchData?.away_team || team2.name);
  const leftColor = homeColors[0];
  const rightColor = awayColors[0];

  return (
    <View style={[
      styles.card, 
      theme === 'light' ? styles.shadowLight : styles.shadowDark,
      { 
        backgroundColor: colors.cardBackground, 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: theme === 'light' ? 'rgba(255, 255, 255, 0.55)' : 'rgba(255, 255, 255, 0.15)' 
      }
    ]}>
      {/* Liquid Glass Background Blobs */}
      <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
        <View style={{
          position: 'absolute',
          left: -30,
          top: -20,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: leftColor,
          opacity: theme === 'dark' ? 0.28 : 0.16,
        }} />
        <View style={{
          position: 'absolute',
          right: -30,
          bottom: -20,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: rightColor,
          opacity: theme === 'dark' ? 0.28 : 0.16,
        }} />
      </View>

      <BlurView
        tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'}
        intensity={85}
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
              <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={18} color={isFavorite ? colors.accent : colors.icon} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Teams and Scores PK Layout */}
      <View style={styles.matchInfoHorizontal}>
        {/* Left Team (Home) */}
        <View style={styles.teamHome}>
          {team1.flagCode ? (
            <CountryFlag isoCode={team1.flagCode} size={22} style={styles.flag} />
          ) : (
            <View style={[styles.flagPlaceholder, { backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)' }]} />
          )}
          <Text style={[styles.teamNameHorizontal, { color: colors.text, textAlign: 'left' }]} numberOfLines={1}>
            {team1.name}
          </Text>
          <FontAwesome name="home" size={12} color={colors.accent} style={{ marginLeft: 4, opacity: 0.85 }} />
        </View>

        {/* VS Separator */}
        <View style={styles.vsContainer}>
          <Text style={[styles.vsText, { color: colors.accent }]}>VS</Text>
        </View>

        {/* Right Team (Away) */}
        <View style={styles.teamAway}>
          <Text style={[styles.teamNameHorizontal, { color: colors.text, textAlign: 'right' }]} numberOfLines={1}>
            {team2.name}
          </Text>
          {team2.flagCode ? (
            <CountryFlag isoCode={team2.flagCode} size={22} style={styles.flag} />
          ) : (
            <View style={[styles.flagPlaceholder, { backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)' }]} />
          )}
        </View>
      </View>

      {/* Odds */}
      {primaryOdds && (
        <View style={[styles.oddsContainer, { borderTopColor: colors.border }]}>
          <View style={styles.oddProviderContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={[styles.providerText, { color: colors.textSecondary }]}>
                {primaryOdds.providerName} {isZh ? '赔率' : 'Odds'}
              </Text>
              {oddsList && oddsList.length > 1 && (
                <Text style={{ fontSize: 11, color: colors.accent, fontWeight: '600' }}>
                  {isZh ? `+${oddsList.length - 1} 更多平台` : `+${oddsList.length - 1} more`}
                </Text>
              )}
            </View>
            <View style={styles.oddsBoxes}>
              <View style={[styles.oddBox, { backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.15)', borderWidth: 1, borderColor: colors.border }]}>
                <Text style={[styles.oddLabel, { color: colors.textSecondary }]}>{isZh ? '主胜' : 'Home'}</Text>
                <Text style={[styles.oddValue, { color: colors.text }]}>{primaryOdds.team1.toFixed(2)}</Text>
              </View>
              <View style={[styles.oddBox, { backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.15)', borderWidth: 1, borderColor: colors.border }]}>
                <Text style={[styles.oddLabel, { color: colors.textSecondary }]}>{isZh ? '平局' : 'Draw'}</Text>
                <Text style={[styles.oddValue, { color: colors.text }]}>{primaryOdds.draw.toFixed(2)}</Text>
              </View>
              <View style={[styles.oddBox, { backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.15)', borderWidth: 1, borderColor: colors.border }]}>
                <Text style={[styles.oddLabel, { color: colors.textSecondary }]}>{isZh ? '客胜' : 'Away'}</Text>
                <Text style={[styles.oddValue, { color: colors.text }]}>{primaryOdds.team2.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  shadowLight: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  shadowDark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leagueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  leagueText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  matchInfoHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  teamHome: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  teamAway: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  vsContainer: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    fontSize: 14,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  teamNameHorizontal: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
    maxWidth: '70%',
  },
  flag: {
    width: 24,
    height: 16,
    borderRadius: 2,
  },
  flagPlaceholder: {
    width: 24,
    height: 16,
    borderRadius: 2,
  },
  homeBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  oddsContainer: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  oddProviderContainer: {
    marginBottom: 2,
  },
  providerText: {
    fontSize: 11,
    fontWeight: '700',
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
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  oddLabel: {
    fontSize: 11,
    opacity: 0.7,
  },
  oddValue: {
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
