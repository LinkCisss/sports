import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, useColorScheme, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { fetchEventOdds, MatchOdds, Bookmaker } from '@/lib/oddsApi';
import { useTranslation } from 'react-i18next';
import { translateTeam, translateLeague } from '@/utils/translate';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MatchDetailScreen() {
  const { id, sportKey } = useLocalSearchParams<{ id: string; sportKey: string }>();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const [matchData, setMatchData] = useState<MatchOdds | null>(null);
  const [loading, setLoading] = useState(true);

  const displayTeam = (name: string) => isZh ? translateTeam(name) : name;

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
      <Stack.Screen 
        options={{ 
          title: t('compare.title') || 'Compare', 
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
              <FontAwesome name="chevron-left" size={20} color={colors.text} />
            </Pressable>
          ),
        }} 
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Match Header */}
        <View style={styles.matchHeader}>
          <Text style={[styles.time, { color: colors.accent }]}>
            {new Date(matchData.commence_time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </Text>
          <View style={styles.teamsRow}>
            <Text style={[styles.teamName, { color: colors.text }]}>{displayTeam(matchData.home_team)}</Text>
            <Text style={[styles.vs, { color: colors.textSecondary }]}>vs</Text>
            <Text style={[styles.teamName, { color: colors.text }]}>{displayTeam(matchData.away_team)}</Text>
          </View>
        </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  matchHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  time: {
    ...Typography.caption,
    fontWeight: '700',
    marginBottom: 8,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  teamName: {
    ...Typography.header,
    flex: 1,
    textAlign: 'center',
  },
  vs: {
    ...Typography.body,
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
  },
});
