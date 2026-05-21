import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, useColorScheme, ActivityIndicator } from 'react-native';
import { MatchCard } from '@/components/MatchCard';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { supabase } from '@/lib/supabase';
import { fetchLiveMatchesWithOdds, MatchOdds } from '@/lib/oddsApi';

export default function HomeScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const [predictions, setPredictions] = useState<any[]>([]);
  const [matches, setMatches] = useState<MatchOdds[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 示例：获取 Supabase 中 predictions 表的数据
    const fetchPredictions = async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .limit(5);

      if (error) {
        console.error('Error fetching predictions:', error);
      } else if (data) {
        setPredictions(data);
        console.log('Fetched predictions:', data);
      }
    };

    // 取消注释以启用真实请求（确保你在 lib/supabase.ts 填入了真实的 URL 和 Key）
    // fetchPredictions();

    // 示例：获取 The Odds API 赛事数据
    const loadMatches = async () => {
      setLoading(true);
      const data = await fetchLiveMatchesWithOdds('soccer_epl'); // 测试时使用英超数据
      setMatches(data);
      setLoading(false);
    };

    loadMatches();
  }, []);

  // 辅助函数：解析出给 MatchCard 使用的 odds 对象
  const getOdds = (match: MatchOdds) => {
    if (!match.bookmakers || match.bookmakers.length === 0) return undefined;
    const bookmaker = match.bookmakers[0]; // 首页优先展示第一家平台的赔率
    const market = bookmaker.markets.find(m => m.key === 'h2h');
    if (!market || !market.outcomes) return undefined;

    const homeOutcome = market.outcomes.find(o => o.name === match.home_team);
    const awayOutcome = market.outcomes.find(o => o.name === match.away_team);
    const drawOutcome = market.outcomes.find(o => o.name === 'Draw');

    return {
      providerName: bookmaker.title,
      team1: homeOutcome?.price || 0,
      draw: drawOutcome?.price || 0,
      team2: awayOutcome?.price || 0,
    };
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.dateText, { color: colors.text }]}>Today</Text>
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
            odds={getOdds(match)}
          />
        ))
      ) : (
        <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
          No matches found right now.
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
