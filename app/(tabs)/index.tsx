import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import dayjs from 'dayjs';

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
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [matches, setMatches] = useState<MatchOdds[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 生成顶部日期数据
  const dateOptions = useMemo(() => {
    const options = [];
    for (let i = -1; i <= 7; i++) {
      const d = dayjs().add(i, 'day');
      let label = d.format('MM-DD');
      if (i === 0) label = isZh ? '今天' : 'Today';
      else if (i === -1) label = isZh ? '昨天' : 'Yesterday';
      else if (i === 1) label = isZh ? '明天' : 'Tomorrow';
      options.push({ label, value: d.format('YYYY-MM-DD') });
    }
    // 特别为测试添加世界杯开幕日
    options.push({ label: isZh ? 'WC 开幕' : 'WC Start', value: '2026-06-11' });
    return options;
  }, [isZh]);

  const loadMatches = async (leagueKey: string, dateStr: string) => {
    const data = await fetchLiveMatchesWithOdds(leagueKey, dateStr);
    setMatches(data);
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await loadMatches(selectedLeague, selectedDate);
      setLoading(false);
    };
    initData();
  }, [selectedLeague, selectedDate]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMatches(selectedLeague, selectedDate);
    setRefreshing(false);
  }, [selectedLeague, selectedDate]);

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

      {/* Date Switcher */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.switcher} 
        contentContainerStyle={styles.switcherContent}
      >
        {dateOptions.map(dateOpt => {
          const isActive = selectedDate === dateOpt.value;
          return (
            <Pressable 
              key={dateOpt.value}
              style={[
                styles.pill, 
                isActive ? { backgroundColor: colors.accent } : { backgroundColor: colors.cardBackground }
              ]}
              onPress={() => setSelectedDate(dateOpt.value)}
            >
              <Text style={[
                styles.pillText, 
                { color: isActive ? '#fff' : colors.text }
              ]}>
                {dateOpt.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* League Switcher */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.switcher} 
        contentContainerStyle={styles.switcherContent}
      >
        {LEAGUES.map(league => {
          const isActive = selectedLeague === league.key;
          return (
            <Pressable 
              key={league.key}
              style={[
                styles.pill, 
                { borderColor: colors.border, borderWidth: isActive ? 0 : 1 },
                isActive ? { backgroundColor: colors.text } : { backgroundColor: 'transparent' }
              ]}
              onPress={() => setSelectedLeague(league.key)}
            >
              <Text style={[
                styles.pillText, 
                { color: isActive ? colors.background : colors.textSecondary }
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
  switcher: {
    maxHeight: 40,
    marginBottom: 12,
  },
  switcherContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillText: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
