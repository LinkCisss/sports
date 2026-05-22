import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, useColorScheme, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { fetchEventOdds, MatchOdds, Bookmaker } from '@/lib/oddsApi';
import { useTranslation } from 'react-i18next';
import { translateTeam, translateLeague } from '@/utils/translate';
import { formatMatchTime } from '@/utils/date';
import { getTeamFlagCode } from '@/utils/flags';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CountryFlag from 'react-native-country-flag';
import * as WebBrowser from 'expo-web-browser';

const AFFILIATE_LINK = "https://reffpa.com/L?tag=d_5622403m_97c_&site=5622403&ad=97";

export default function MatchDetailScreen() {
  const { id, sportKey } = useLocalSearchParams<{ id: string; sportKey: string }>();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const insets = useSafeAreaInsets();

  const [matchData, setMatchData] = useState<MatchOdds | null>(null);
  const [loading, setLoading] = useState(true);

  const displayTeam = (name: string) => isZh ? translateTeam(name) : name;

  const handleBetNow = async () => {
    await WebBrowser.openBrowserAsync(AFFILIATE_LINK);
  };

  useEffect(() => {
    const loadMatch = async () => {
      if (id && sportKey) {
        setLoading(true);
        const data = await fetchEventOdds(sportKey, id);
        setMatchData(data);
        setLoading(false);
      }
    };
    loadMatch();
  }, [id, sportKey]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Loading...', headerTransparent: true }} />
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!matchData) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={{ color: colors.textSecondary }}>Failed to load match data.</Text>
      </View>
    );
  }

  const renderMarket = (bookmaker: Bookmaker, marketKey: string, title: string) => {
    const market = bookmaker.markets.find(m => m.key === marketKey);
    if (!market || !market.outcomes || market.outcomes.length === 0) return null;

    return (
      <View style={styles.marketContainer}>
        <Text style={[styles.marketTitle, { color: colors.textSecondary }]}>{title}</Text>
        <View style={styles.outcomesRow}>
          {market.outcomes.map((outcome, idx) => {
            let nameDisplay = displayTeam(outcome.name);
            // Translate Over/Under specifically if needed
            if (isZh) {
              if (nameDisplay.toLowerCase() === 'over') nameDisplay = '大';
              if (nameDisplay.toLowerCase() === 'under') nameDisplay = '小';
            }

            return (
              <View key={idx} style={[styles.outcomeBox, { backgroundColor: colors.background }]}>
                <Text style={[styles.outcomeName, { color: colors.textSecondary }]} numberOfLines={1}>
                  {nameDisplay}
                  {outcome.point !== undefined ? ` (${outcome.point > 0 ? '+' : ''}${outcome.point})` : ''}
                </Text>
                <Text style={[styles.outcomePrice, { color: colors.text }]}>
                  {outcome.price.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Absolute Top Header Area */}
      <View style={{ backgroundColor: colors.background, paddingTop: insets.top + (Platform.OS === 'android' ? 12 : 8), paddingBottom: 16, zIndex: 10 }}>
        
        {/* Title Bar */}
        <View style={styles.headerTopRow}>
          <Pressable 
            onPress={() => router.back()} 
            style={[styles.backButton, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
          >
            <FontAwesome name="chevron-left" size={16} color={colors.text} style={{ marginLeft: -2 }} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{isZh ? '比赛详情' : 'Match Details'}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hovering Capsule for Teams */}
        <View style={styles.capsuleContainer}>
          <View style={[styles.capsule, { backgroundColor: colors.cardBackground }, theme === 'dark' ? styles.shadowDark : styles.shadowLight]}>
            <View style={styles.horizontalTeams}>
              <View style={[styles.teamInline, { justifyContent: 'flex-end' }]}>
                <Text style={[styles.smallTeamName, { color: colors.text, textAlign: 'right' }]} numberOfLines={1}>
                  {displayTeam(matchData.home_team)}
                </Text>
                {getTeamFlagCode(matchData.home_team) && (
                  <CountryFlag isoCode={getTeamFlagCode(matchData.home_team)!} size={16} style={{ borderRadius: 2 }} />
                )}
              </View>
              <Text style={[styles.vs, { color: colors.accent }]}>vs</Text>
              <View style={[styles.teamInline, { justifyContent: 'flex-start' }]}>
                {getTeamFlagCode(matchData.away_team) && (
                  <CountryFlag isoCode={getTeamFlagCode(matchData.away_team)!} size={16} style={{ borderRadius: 2 }} />
                )}
                <Text style={[styles.smallTeamName, { color: colors.text, textAlign: 'left' }]} numberOfLines={1}>
                  {displayTeam(matchData.away_team)}
                </Text>
              </View>
            </View>
            <Text style={[styles.time, { color: colors.textSecondary, marginTop: 4 }]}>
              {formatMatchTime(matchData.commence_time, isZh)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Bookmakers List */}
        {matchData.bookmakers.length === 0 ? (
          <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 40 }}>
            No odds data available for this match yet.
          </Text>
        ) : (
          matchData.bookmakers.map(bookmaker => (
            <View key={bookmaker.key} style={[styles.bookmakerCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.bookmakerTitle, { color: colors.text }]}>{bookmaker.title}</Text>
              
              {renderMarket(bookmaker, 'h2h', isZh ? '胜平负 (Moneyline)' : 'Moneyline (H2H)')}
              {renderMarket(bookmaker, 'spreads', isZh ? '让分 (Spreads)' : 'Spreads')}
              {renderMarket(bookmaker, 'totals', isZh ? '大小球 (Totals)' : 'Totals')}
              
            </View>
          ))
        )}

      </ScrollView>

      {/* Floating Action Button (Affiliate) */}
      <View style={[styles.fabContainer, { backgroundColor: colors.background + 'F0' }]}>
        <Pressable 
          style={({ pressed }) => [
            styles.fabButton, 
            { backgroundColor: colors.accent, transform: [{ scale: pressed ? 0.98 : 1 }] },
            theme === 'light' ? styles.shadowLight : styles.shadowDark
          ]}
          onPress={handleBetNow}
        >
          <Text style={styles.fabText}>{isZh ? '去 1xBet 投注' : 'Bet at 1xBet'}</Text>
          <FontAwesome name="external-link" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  headerTopRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 8, // Give it some breathing room from the top safe area
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.header,
  },
  capsuleContainer: {
    paddingHorizontal: 20, // More side margin (not touching edges)
    paddingTop: 8,
    paddingBottom: 8,
  },
  capsule: {
    borderRadius: 100, // Pill shape
    paddingVertical: 18, // Make it taller
    paddingHorizontal: 24, // Wider internal padding
    alignItems: 'center',
    width: '100%',
  },
  horizontalTeams: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  teamInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  smallTeamName: {
    ...Typography.body,
    fontWeight: '700',
    flexShrink: 1,
  },
  time: {
    ...Typography.caption,
    fontWeight: '600',
  },
  vs: {
    ...Typography.caption,
    fontWeight: '700',
  },
  bookmakerCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bookmakerTitle: {
    ...Typography.body,
    fontWeight: '700',
    marginBottom: 12,
  },
  marketContainer: {
    marginBottom: 16,
  },
  marketTitle: {
    ...Typography.caption,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  outcomesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  outcomeBox: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  outcomeName: {
    ...Typography.caption,
    marginBottom: 4,
  },
  outcomePrice: {
    ...Typography.body,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  fabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 30, // Safe area + padding
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.1)',
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 100, // Pill shape
  },
  fabText: {
    ...Typography.teamName, // Use large bold font
    color: '#FFFFFF',
  },
  shadowLight: {
    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  shadowDark: {
    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
});
