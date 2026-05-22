import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Text, useColorScheme, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { MatchCard } from '@/components/MatchCard';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useTranslation } from 'react-i18next';
import { translateTeam, translateLeague } from '@/utils/translate';
import { formatMatchTime } from '@/utils/date';
import { getTeamFlagCode } from '@/utils/flags';
import { MatchOdds } from '@/lib/oddsApi';
import { getFavorites } from '@/lib/favorites';

export default function FavoritesScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const displayTeam = (name: string) => isZh ? translateTeam(name) : name;
  const displayLeague = (name: string) => isZh ? translateLeague(name) : name;

  const [matches, setMatches] = useState<MatchOdds[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    const data = await getFavorites();
    setMatches(data);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadFavorites().then(() => setLoading(false));
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      <View style={styles.header}>
        <Text style={[styles.titleText, { color: colors.text }]}>{t('tabs.favorites') || 'Favorites'}</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
      ) : matches.length > 0 ? (
        matches.map(match => (
          <Link key={match.id} href={{ pathname: '/match/[id]', params: { id: match.id, sportKey: match.sport_key } }} asChild>
            <Pressable style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
              <MatchCard
                matchData={match}
                league={displayLeague(match.sport_title)}
                time={formatMatchTime(match.commence_time, isZh)}
                team1={{ name: displayTeam(match.home_team), score: '-', flagCode: getTeamFlagCode(match.home_team) }}
                team2={{ name: displayTeam(match.away_team), score: '-', flagCode: getTeamFlagCode(match.away_team) }}
              />
            </Pressable>
          </Link>
        ))
      ) : (
        <View style={{ alignItems: 'center', marginTop: 80 }}>
          <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
            {isZh ? '暂无收藏\n点击卡片右上角收藏比赛' : 'No favorites yet\nTap the heart icon on a match to save it'}
          </Text>
        </View>
      )}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  titleText: { ...Typography.header },
  noDataText: { ...Typography.body, textAlign: 'center', marginTop: 40, lineHeight: 24 },
});
