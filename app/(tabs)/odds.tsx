import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, ActivityIndicator, RefreshControl, Pressable, Platform } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MatchCard } from '@/components/MatchCard';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { fetchLiveMatchesWithOdds, MatchOdds } from '@/lib/oddsApi';
import { useTranslation } from 'react-i18next';
import { translateTeam, translateLeague } from '@/utils/translate';
import { formatMatchTime } from '@/utils/date';
import { getTeamFlagCode } from '@/utils/flags';
import dayjs from 'dayjs';
import { useColorScheme } from '@/components/useColorScheme';
import { LiquidBackground } from '@/components/LiquidBackground';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

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
  const insets = useSafeAreaInsets();

  const displayTeam = (name: string) => isZh ? translateTeam(name) : name;
  const displayLeague = (name: string) => isZh ? translateLeague(name) : name;

  const [selectedLeague, setSelectedLeague] = useState('soccer_fifa_world_cup');
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [matches, setMatches] = useState<MatchOdds[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 当联赛切换时，自动调整默认日期为今天
  const handleLeagueChange = (leagueKey: string) => {
    setSelectedLeague(leagueKey);
    setSelectedDate(dayjs().format('YYYY-MM-DD'));
  };

  // 生成顶部日期数据
  const dateOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i <= 14; i++) {
      const d = dayjs().add(i, 'day');
      let label = d.format('MM-DD');
      if (i === 0) label = isZh ? '今天' : 'Today';
      else if (i === 1) label = isZh ? '明天' : 'Tomorrow';
      options.push({ label, value: d.format('YYYY-MM-DD') });
    }
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

  const safeTop = insets.top > 0 ? insets.top : 28;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LiquidBackground />

      {/* Sticky Premium Glass Header containing Title and Switchers */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: safeTop + (Platform.OS === 'android' ? 12 : 8),
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        overflow: 'hidden',
        zIndex: 10,
      }}>
        <BlurView 
          tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} 
          intensity={85} 
          style={StyleSheet.absoluteFill} 
        />
        
        <View style={{ paddingHorizontal: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.dateText, { color: colors.text, marginBottom: 0 }]}>
            {isZh ? '赔率' : 'Odds'}
          </Text>
          <Pressable 
            onPress={onRefresh}
            style={[{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              paddingHorizontal: 10, 
              paddingVertical: 6, 
              borderRadius: 12, 
              backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' 
            }]}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={colors.text} style={{ transform: [{ scale: 0.7 }] }} />
            ) : (
              <FontAwesome name="refresh" size={11} color={colors.text} />
            )}
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text, marginLeft: 4 }}>
              {isZh ? '刷新' : 'Refresh'}
            </Text>
          </Pressable>
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
                  { borderWidth: 1, borderColor: colors.border },
                  isActive ? { backgroundColor: colors.accent } : { backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.15)' }
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setSelectedDate(dateOpt.value);
                }}
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
          style={[styles.switcher, { marginBottom: 14 }]} 
          contentContainerStyle={styles.switcherContent}
        >
          {LEAGUES.map(league => {
            const isActive = selectedLeague === league.key;
            return (
              <Pressable 
                key={league.key}
                style={[
                  styles.pill, 
                  { borderWidth: 1, borderColor: colors.border },
                  isActive ? { backgroundColor: colors.text } : { backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.15)' }
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  handleLeagueChange(league.key);
                }}
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
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingTop: safeTop + 185, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
      ) : matches.length > 0 ? (
        matches.map(match => (
          <Link 
            key={match.id} 
            href={{ pathname: '/match/[id]', params: { id: match.id, sportKey: match.sport_key } }} 
            asChild
          >
            <Pressable 
              style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              }}
            >
              <MatchCard
                matchData={match}
                league={displayLeague(match.sport_title)}
                time={formatMatchTime(match.commence_time, isZh)}
                team1={{ 
                  name: displayTeam(match.home_team), 
                  score: '-', 
                  flagCode: getTeamFlagCode(match.home_team) 
                }}
                team2={{ 
                  name: displayTeam(match.away_team), 
                  score: '-', 
                  flagCode: getTeamFlagCode(match.away_team) 
                }}
                oddsList={getOddsList(match)}
              />
            </Pressable>
          </Link>
        ))
      ) : (
        <View style={{ alignItems: 'center', marginTop: 80 }}>
          <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
            {isZh ? '暂无比赛\n点击上方切换其他日期' : 'No matches found\nSelect another date above'}
          </Text>
        </View>
      )}
      
      <View style={{ height: 100 }} />
      </ScrollView>
    </View>
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
