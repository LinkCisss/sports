import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, useColorScheme } from 'react-native';
import { MatchCard } from '@/components/MatchCard';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { supabase } from '@/lib/supabase';

const MOCK_MATCHES = [
  {
    id: '1',
    league: 'World Cup 2026 - Group A',
    status: "LIVE 73'",
    team1: { name: 'Brazil', score: 2 },
    team2: { name: 'France', score: 1 },
    odds: { team1: 1.15, draw: 5.50, team2: 12.00 },
  },
  {
    id: '2',
    league: 'World Cup 2026 - Group B',
    status: "14:00",
    team1: { name: 'Argentina', score: '-' },
    team2: { name: 'Germany', score: '-' },
    odds: { team1: 2.10, draw: 3.20, team2: 3.50 },
  },
  {
    id: '3',
    league: 'World Cup 2026 - Group C',
    status: "FT",
    team1: { name: 'Spain', score: 3 },
    team2: { name: 'Portugal', score: 3 },
  }
];

export default function HomeScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const [predictions, setPredictions] = useState<any[]>([]);

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
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.dateText, { color: colors.text }]}>Today</Text>
      </View>
      
      {MOCK_MATCHES.map(match => (
        <MatchCard
          key={match.id}
          league={match.league}
          status={match.status}
          team1={match.team1}
          team2={match.team2}
          odds={match.odds}
        />
      ))}
      <View style={{ height: 40 }} />
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
});
