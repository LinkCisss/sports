import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Text, useColorScheme, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { MatchCard } from '@/components/MatchCard';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { supabase } from '@/lib/supabase';
import { fetchLiveMatchesWithOdds, MatchOdds } from '@/lib/oddsApi';
import { useTranslation } from 'react-i18next';
import { translateTeam, translateLeague } from '@/utils/translate';
import { formatMatchTime } from '@/utils/date';

const LEAGUES = [
  { key: 'soccer_epl', label: 'EPL' },
  { key: 'soccer_fifa_world_cup', label: 'World Cup' },
  { key: 'soccer_uefa_champs_league', label: 'Champions League' },
  { key: 'soccer_spain_la_liga', label: 'La Liga' },
];

export default function HomeScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const displayTeam = (name: string) => isZh ? translateTeam(name) : name;
  const displayLeague = (name: string) => isZh ? translateLeague(name) : name;

  const [selectedLeague, setSelectedLeague] = useState(LEAGUES[0].key);
  const [matches, setMatches] = useState<MatchOdds[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = async (leagueKey: string) => {
    const data = await fetchLiveMatchesWithOdds(leagueKey);
    setMatches(data);
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await loadMatches(selectedLeague);
      setLoading(false);
    };
    initData();
  }, [selectedLeague]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMatches(selectedLeague);
    setRefreshing(false);
  }, [selectedLeague]);

  // 取前三家平台进行 h2h 对比（首页保持简洁）
  const getOddsList = (match: MatchOdds) => {
    if (!match.bookmakers || match.bookmakers.length === 0) return undefined;
    
    const topBookmakers = match.bookmakers.slice(0, 3);
    
    return topBookmakers.map(bookmaker => {
      const market = bookmaker.markets.find(m => m.key === 'h2h');
      const homeOutcome = market?.outcomes.find(o => o.name === match.home_team);
      const awayOutcome = market?.outcomes.find(o => o.name === match.away_team);
      const drawOutcome = market?.outcomes.find(o => o.name === 'Draw' || o.name === '平局');

      return {
        providerName: bookmaker.title,
        team1: homeOutcome?.price || 0,
        draw: drawOutcome?.price || 0,
        team2: awayOutcome?.price || 0,
      };
    }).filter(odds => odds.team1 > 0);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.dateText, { color: colors.text }]}>{t('home.today')}</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.leagueSwitcher} 
        contentContainerStyle={styles.leagueSwitcherContent}
      >
        {LEAGUES.map(league => {
          const isActive = selectedLeague === league.key;
          return (
            <Pressable 
              key={league.key}
              style={[
                styles.leaguePill, 
                { borderColor: colors.border },
                isActive && { backgroundColor: colors.accent, borderColor: colors.accent }
              ]}
              onPress={() => setSelectedLeague(league.key)}
            >
              <Text style={[
                styles.leaguePillText, 
                { color: isActive ? '#fff' : colors.textSecondary }
              ]}>
                {displayLeague(league.label)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
      ) : matches.length > 0 ? (
        matches.map(match => (
          <Link 
            key={match.id} 
            href={{ pathname: '/match/[id]', params: { id: match.id, sportKey: match.sport_key } }} 
            asChild
          >
            <Pressable>
              <MatchCard
                league={displayLeague(match.sport_title)}
                time={formatMatchTime(match.commence_time, isZh)}
                team1={{ name: displayTeam(match.home_team), score: '-' }}
                team2={{ name: displayTeam(match.away_team), score: '-' }}
                oddsList={getOddsList(match)}
              />
            </Pressable>
          </Link>
        ))
      ) : (
        <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
          {t('home.no_matches')}
        </Text>
      )}
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dateText: {
    ...Typography.header,
  },
  noDataText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 40,
  },
  leagueSwitcher: {
    maxHeight: 40,
    marginBottom: 8,
  },
  leagueSwitcherContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  leaguePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaguePillText: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
