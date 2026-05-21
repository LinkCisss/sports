import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, useColorScheme, ActivityIndicator, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { MatchCard } from '@/components/MatchCard';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useTranslation } from 'react-i18next';
import { fetchLiveMatchesWithOdds, MatchOdds } from '@/lib/oddsApi';
import { translateTeam, translateLeague } from '@/utils/translate';
import { formatMatchTime } from '@/utils/date';

export default function CompareScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const displayTeam = (name: string) => isZh ? translateTeam(name) : name;
  const displayLeague = (name: string) => isZh ? translateLeague(name) : name;

  const [matches, setMatches] = useState<MatchOdds[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const data = await fetchLiveMatchesWithOdds('soccer_fifa_world_cup'); // 对比页默认看世界杯或热门
      setMatches(data);
      setLoading(false);
    };
    initData();
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('compare.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('compare.subtitle')}
        </Text>
      </View>

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
                // 对比页的列表可以不用展示 oddsList，因为点进去才有
              />
            </Pressable>
          </Link>
        ))
      ) : (
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            {t('home.no_matches')}
          </Text>
        </View>
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
    padding: 16,
  },
  title: {
    ...Typography.header,
  },
  subtitle: {
    ...Typography.body,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  placeholderText: {
    ...Typography.body,
    textAlign: 'center',
  },
});
