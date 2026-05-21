import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Text, useColorScheme, ActivityIndicator, RefreshControl } from 'react-native';
import { MatchCard } from '@/components/MatchCard';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { supabase } from '@/lib/supabase';
import { fetchLiveMatchesWithOdds, MatchOdds } from '@/lib/oddsApi';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { t } = useTranslation();

  const [predictions, setPredictions] = useState<any[]>([]);
  const [matches, setMatches] = useState<MatchOdds[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = async () => {
    const data = await fetchLiveMatchesWithOdds('soccer_epl'); // 测试时使用英超数据
    setMatches(data);
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await loadMatches();
      setLoading(false);
    };
    initData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  }, []);

  // 辅助函数：解析出给 MatchCard 使用的 oddsList (最多取3家平台对比)
  const getOddsList = (match: MatchOdds) => {
    if (!match.bookmakers || match.bookmakers.length === 0) return undefined;
    
    // 取前三家平台进行对比
    const topBookmakers = match.bookmakers.slice(0, 3);
    
    return topBookmakers.map(bookmaker => {
      const market = bookmaker.markets.find(m => m.key === 'h2h');
      const homeOutcome = market?.outcomes.find(o => o.name === match.home_team);
      const awayOutcome = market?.outcomes.find(o => o.name === match.away_team);
      const drawOutcome = market?.outcomes.find(o => o.name === 'Draw');

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
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
      ) : matches.length > 0 ? (
        matches.map(match => (
          <MatchCard
            key={match.id}
            league={match.sport_title}
            status={new Date(match.commence_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            team1={{ name: match.home_team, score: '-' }}
            team2={{ name: match.away_team, score: '-' }}
            oddsList={getOddsList(match)}
          />
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
});
