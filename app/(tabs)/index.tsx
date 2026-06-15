import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, ActivityIndicator, Pressable, Platform, Dimensions, Modal, RefreshControl, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/components/useColorScheme';
import { LiquidBackground } from '@/components/LiquidBackground';
import { BlurView } from 'expo-blur';
import CountryFlag from 'react-native-country-flag';
import { getTeamFlagCode } from '@/utils/flags';
import { translateTeam, translatePlayer } from '@/utils/translate';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { fetchWorldCupStandings, fetchWorldCupMatches, FootballDataMatch, GroupStanding } from '@/lib/footballDataApi';
import { fetchLiveMatchesWithOdds } from '@/lib/oddsApi';
import { fetchCsgoMatches, CsgoMatch } from '@/lib/csgoDataApi';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { getMatchLineup } from '@/lib/lineupGenerator';
import { TacticalPitch } from '@/components/TacticalPitch';
import * as Haptics from 'expo-haptics';

let LiveActivities: any = null;
try {
  LiveActivities = require('react-native-live-activities').default;
} catch (e) {
  console.log('react-native-live-activities not installed yet');
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Knockout matches mock database matching the tournament format
const KNOCKOUT_MATCHES_BY_STAGE: Record<string, any[]> = {
  ROUND_OF_32: [
    { id: 3201, date: '2026-06-27T03:00:00Z', home: '1A', away: '2B', odds: '1A 1.85' },
    { id: 3202, date: '2026-06-27T09:00:00Z', home: '1C', away: '2D', odds: '1C 1.72' },
    { id: 3203, date: '2026-06-29T03:00:00Z', home: '2A', away: '2B', odds: '2A 2.10' },
    { id: 3204, date: '2026-06-30T04:30:00Z', home: '1E', away: '3A/B/C/D/F', odds: '1E 1.55' },
    { id: 3205, date: '2026-06-30T09:00:00Z', home: '1F', away: '2C', odds: '1F 1.95' },
    { id: 3206, date: '2026-07-01T05:00:00Z', home: '1I', away: '3C/D/F/G/H', odds: '1I 1.62' },
    { id: 3207, date: '2026-07-02T20:00:00Z', home: '1D', away: '3B/E/F/I/J', odds: '1D 1.80' },
    { id: 3208, date: '2026-07-03T03:00:00Z', home: '1H', away: '2J', odds: '1H 1.75' },
    { id: 3209, date: '2026-07-03T07:00:00Z', home: '2K', away: '2L', odds: '2K 2.30' },
  ],
  ROUND_OF_16: [
    { id: 1601, date: '2026-07-04T18:00:00Z', home: 'W65', away: 'W66', odds: 'W65 1.90' },
    { id: 1602, date: '2026-07-05T21:00:00Z', home: 'W67', away: 'W68', odds: 'W67 1.70' },
    { id: 1603, date: '2026-07-06T18:00:00Z', home: 'W69', away: 'W70', odds: 'W70 2.05' },
    { id: 1604, date: '2026-07-07T21:00:00Z', home: 'W71', away: 'W72', odds: 'W71 1.80' },
  ],
  QUARTER_FINALS: [
    { id: 801, date: '2026-07-10T18:00:00Z', home: 'W81', away: 'W82', odds: 'W81 1.78' },
    { id: 802, date: '2026-07-10T21:00:00Z', home: 'W83', away: 'W84', odds: 'W83 1.95' },
    { id: 803, date: '2026-07-11T18:00:00Z', home: 'W85', away: 'W86', odds: 'W86 2.15' },
    { id: 804, date: '2026-07-11T21:00:00Z', home: 'W87', away: 'W88', odds: 'W87 1.65' },
  ],
  SEMI_FINALS: [
    { id: 401, date: '2026-07-14T20:00:00Z', home: 'W97', away: 'W98', odds: 'W97 1.85' },
    { id: 402, date: '2026-07-15T20:00:00Z', home: 'W99', away: 'W100', odds: 'W99 1.70' },
  ],
  FINAL: [
    { id: 201, date: '2026-07-19T20:00:00Z', home: 'W101', away: 'W102', odds: 'W101 1.80' },
  ]
};

const STAGES = [
  { key: 'GROUP_STAGE', labelZh: '小组赛', labelEn: 'Groups' },
  { key: 'ROUND_OF_32', labelZh: '32强', labelEn: 'R32' },
  { key: 'ROUND_OF_16', labelZh: '16强', labelEn: 'R16' },
  { key: 'QUARTER_FINALS', labelZh: '四分之一决赛', labelEn: 'Quarter-finals' },
  { key: 'SEMI_FINALS', labelZh: '半决赛', labelEn: 'Semi-finals' },
  { key: 'FINAL', labelZh: '决赛', labelEn: 'Final' },
];

// CSGO stages are dynamic

const TEAM_FLAG_COLORS: Record<string, string[]> = {
  "Mexico": ["#006847", "#CE1126"],
  "South Africa": ["#007C3F", "#FFB612"],
  "South Korea": ["#CD2E3A", "#0047A0"],
  "Czech Republic": ["#11457E", "#D7141A"],
  "Czech Rep": ["#11457E", "#D7141A"],
  "Canada": ["#FF0000", "#FFFFFF"],
  "Bosnia and Herzegovina": ["#002F6C", "#FEC524"],
  "Bosnia": ["#002F6C", "#FEC524"],
  "USA": ["#B22234", "#3C3B6E"],
  "Paraguay": ["#D52B1E", "#0038A8"],
  "Switzerland": ["#FF0000", "#FFFFFF"],
  "Qatar": ["#8A1538", "#FFFFFF"],
  "Turkey": ["#E30A17", "#FFFFFF"],
  "Brazil": ["#009739", "#FEDF00"],
  "Argentina": ["#74ACDF", "#F6B40E"],
  "Germany": ["#FFCE00", "#DD0000"],
  "France": ["#002395", "#ED2939"],
  "England": ["#CE1126", "#FFFFFF"],
  "Spain": ["#C60B1E", "#FFC400"],
  "Portugal": ["#006600", "#FF0000"],
  "Italy": ["#009246", "#CE2B37"],
  "Japan": ["#BC002D", "#FFFFFF"],
  "Australia": ["#00008B", "#FF0000"],
};

const CSGO_TEAM_COLORS: Record<string, string[]> = {
  "G2 Esports": ["#3E3E3E", "#FFFFFF"],
  "Natus Vincere": ["#FFF200", "#000000"],
  "Team Vitality": ["#FFE500", "#1A1A1A"],
  "FaZe Clan": ["#E50000", "#000000"],
  "MOUZ": ["#C8102E", "#000000"],
  "Astralis": ["#EF3E42", "#FFFFFF"],
  "Team Liquid": ["#0F2537", "#FFFFFF"],
  "Virtus.pro": ["#FF5E00", "#000000"],
};

const getTeamAbbreviation = (name: string, tla: string): string => {
  if (name.includes('G2')) return 'G2';
  if (name.includes('Natus') || name.includes('Navi')) return 'NaVi';
  if (name.includes('Vitality')) return 'Vitality';
  if (name.includes('FaZe')) return 'FaZe';
  if (name.includes('MOUZ') || name.includes('Mouz')) return 'MOUZ';
  if (name.includes('Astralis')) return 'Astralis';
  if (name.includes('Liquid')) return 'Liquid';
  if (name.includes('Virtus')) return 'VP';
  return tla;
};

const renderTeamEmblem = (teamName: string, size: number = 20, isFinished: boolean = false, logoUrl?: string) => {
  if (logoUrl) {
    return (
      <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: size > 30 ? 3 : 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
        opacity: isFinished ? 0.7 : 1,
      }}>
        <Image source={{ uri: logoUrl }} style={{ width: size > 30 ? '80%' : '100%', height: size > 30 ? '80%' : '100%', resizeMode: 'contain' }} />
      </View>
    );
  }

  const tColors = CSGO_TEAM_COLORS[teamName] || ['#3A86FF', '#8338EC'];
  let initials = '';
  if (teamName.includes('G2')) {
    initials = 'G2';
  } else if (teamName.includes('Natus') || teamName.includes('Navi')) {
    initials = 'NV';
  } else if (teamName.includes('Virtus')) {
    initials = 'VP';
  } else {
    initials = teamName.split(' ')[0].substring(0, size > 30 ? 2 : 1).toUpperCase();
  }
  
  return (
    <View style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: tColors[0],
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: size > 30 ? 3 : 1.5,
      borderColor: 'rgba(255,255,255,0.2)',
      opacity: isFinished ? 0.7 : 1,
    }}>
      <Text style={{
        color: tColors[1] === '#000000' || tColors[1] === '#1A1A1A' ? '#FFFFFF' : tColors[1],
        fontSize: size > 30 ? 18 : 9,
        fontWeight: '900',
      }}>
        {initials}
      </Text>
    </View>
  );
};

const getTeamColors = (teamName: string): string[] => {
  return TEAM_FLAG_COLORS[teamName] || ['#3A86FF', '#8338EC'];
};

export default function ScheduleScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const [currentSport, setCurrentSport] = useState<'world_cup' | 'csgo' | 'nba'>('world_cup');
  const [showMenu, setShowMenu] = useState(false);
  const [csgoMatches, setCsgoMatches] = useState<CsgoMatch[]>([]);
  const [csgoLoading, setCsgoLoading] = useState(false);
  const [csgoSelectedTournament, setCsgoSelectedTournament] = useState<string>('');
  const [csgoSelectedSubStage, setCsgoSelectedSubStage] = useState<string>('');
  const [selectedCsgoDetailMatch, setSelectedCsgoDetailMatch] = useState<CsgoMatch | null>(null);

  const [selectedStage, setSelectedStage] = useState('GROUP_STAGE');
  const groupScrollRef = React.useRef<ScrollView>(null);
  const dateLayouts = React.useRef<Record<string, number>>({});
  const [groupSubTab, setGroupSubTab] = useState<'standings' | 'matches'>('matches'); // Standings vs Match Schedule
  const [showStandingsModal, setShowStandingsModal] = useState(false); // Standings Overlay
  const [selectedDetailMatch, setSelectedDetailMatch] = useState<FootballDataMatch | null>(null); // Interactive Match Detail
  const [realOdds, setRealOdds] = useState<{ homeOdds: string; drawOdds: string; awayOdds: string } | null>(null);
  const [loadingOdds, setLoadingOdds] = useState(false);

  const [standings, setStandings] = useState<GroupStanding[]>([]);
  const [groupMatches, setGroupMatches] = useState<FootballDataMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Shared values for modal PK background blobs
  const pkScale1 = useSharedValue(1);
  const pkTx1 = useSharedValue(0);
  const pkTy1 = useSharedValue(0);

  const pkScale2 = useSharedValue(1);
  const pkTx2 = useSharedValue(0);
  const pkTy2 = useSharedValue(0);

  const pkAnimatedBlob1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: pkTx1.value },
      { translateY: pkTy1.value },
      { scale: pkScale1.value }
    ],
  }));

  const pkAnimatedBlob2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: pkTx2.value },
      { translateY: pkTy2.value },
      { scale: pkScale2.value }
    ],
  }));

  // Helper to determine the active tournament stage based on dates
  const determineActiveStage = (matches: FootballDataMatch[]) => {
    if (!matches || matches.length === 0) return 'GROUP_STAGE';
    const now = dayjs();
    let closestMatch: FootballDataMatch | null = null;
    let minDiff = Infinity;
    
    matches.forEach(m => {
      const diff = Math.abs(dayjs(m.utcDate).diff(now));
      if (diff < minDiff) {
        minDiff = diff;
        closestMatch = m;
      }
    });
    
    if (closestMatch) {
      const stage = (closestMatch as FootballDataMatch).stage;
      if (stage === 'GROUP_STAGE') return 'GROUP_STAGE';
      if (stage === 'LAST_32' || stage === 'ROUND_OF_32') return 'ROUND_OF_32';
      if (stage === 'LAST_16' || stage === 'ROUND_OF_16') return 'ROUND_OF_16';
      if (stage === 'QUARTER_FINALS') return 'QUARTER_FINALS';
      if (stage === 'SEMI_FINALS') return 'SEMI_FINALS';
      if (stage === 'FINAL') return 'FINAL';
    }
    return 'GROUP_STAGE';
  };

  const loadData = async (showLoadingIndicator = true, forceRefresh = false) => {
    if (showLoadingIndicator) setLoading(true);
    try {
      const standingsRes = await fetchWorldCupStandings(forceRefresh);
      const matchesRes = await fetchWorldCupMatches(forceRefresh);
      
      if (standingsRes?.standings) {
        setStandings(standingsRes.standings);
      }
      if (matchesRes?.matches) {
        // Filter out group stage matches specifically
        const groupFixtures = matchesRes.matches.filter(m => m.stage === 'GROUP_STAGE');
        setGroupMatches(groupFixtures);
        
        // Auto-select the active stage based on tournament progression dates
        const active = determineActiveStage(matchesRes.matches);
        setSelectedStage(active);
      }
    } catch (err) {
      console.error('Error loading schedule data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCsgoData = async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setCsgoLoading(true);
    try {
      const res = await fetchCsgoMatches();
      setCsgoMatches(res);
      if (res.length > 0) {
        const tourneyScores: Record<string, number> = {};
        res.forEach(m => {
          if (m.status === 'IN_PLAY') tourneyScores[m.tournamentName] = 10000000000000;
          else {
            const time = new Date(m.utcDate).getTime();
            if (!tourneyScores[m.tournamentName] || time > tourneyScores[m.tournamentName]) {
              tourneyScores[m.tournamentName] = time;
            }
          }
        });
        const tournaments = Array.from(new Set(res.map(m => m.tournamentName))).sort((a, b) => (tourneyScores[b] || 0) - (tourneyScores[a] || 0));
        
        const liveMatch = res.find(m => m.status === 'IN_PLAY');
        
        let targetTourney = tournaments[0];
        if (liveMatch) targetTourney = liveMatch.tournamentName;

        setCsgoSelectedTournament(prevTourney => {
          const activeTourney = tournaments.includes(prevTourney) ? prevTourney : targetTourney;
          
          setCsgoSelectedSubStage(prevStage => {
            const matchesInTourney = res.filter(m => m.tournamentName === activeTourney);
            const stagesInTourney = Array.from(new Set(matchesInTourney.map(m => m.stage)));
            if (stagesInTourney.includes(prevStage)) return prevStage;
            const liveSubMatch = matchesInTourney.find(m => m.status === 'IN_PLAY');
            if (liveSubMatch) return liveSubMatch.stage;
            return stagesInTourney[stagesInTourney.length - 1] || '';
          });
          
          return activeTourney;
        });
      }
    } catch (err) {
      console.error('Error loading CS:GO data:', err);
    } finally {
      setCsgoLoading(false);
    }
  };

  useEffect(() => {
    if (currentSport === 'csgo' && csgoMatches.length === 0) {
      loadCsgoData(true);
    }
  }, [currentSport]);

  useEffect(() => {
    loadData(true, false);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    if (currentSport === 'world_cup') {
      await loadData(false, true);
    } else if (currentSport === 'csgo') {
      await loadCsgoData(false);
    }
    setRefreshing(false);
  };

  // Animate PK details screen blobs when match is selected & load real odds
  useEffect(() => {
    if (selectedDetailMatch || selectedCsgoDetailMatch) {
      pkScale1.value = 1;
      pkTx1.value = 0;
      pkTy1.value = 0;
      pkScale2.value = 1;
      pkTx2.value = 0;
      pkTy2.value = 0;

      pkScale1.value = withRepeat(withTiming(1.35, { duration: 6500 }), -1, true);
      pkTx1.value = withRepeat(withTiming(SCREEN_WIDTH * 0.18, { duration: 8000 }), -1, true);
      pkTy1.value = withRepeat(withTiming(SCREEN_HEIGHT * 0.08, { duration: 9000 }), -1, true);

      pkScale2.value = withRepeat(withTiming(1.28, { duration: 6000 }), -1, true);
      pkTx2.value = withRepeat(withTiming(-SCREEN_WIDTH * 0.18, { duration: 7500 }), -1, true);
      pkTy2.value = withRepeat(withTiming(-SCREEN_HEIGHT * 0.08, { duration: 8500 }), -1, true);

      if (selectedDetailMatch) {
        // Fetch real odds dynamically
        const loadRealOdds = async () => {
          setLoadingOdds(true);
          setRealOdds(null);
          try {
            const homeName = selectedDetailMatch.homeTeam.name.toLowerCase();
            const awayName = selectedDetailMatch.awayTeam.name.toLowerCase();

            // Fetch matches from The Odds API for FIFA World Cup
            const oddsEvents = await fetchLiveMatchesWithOdds('soccer_fifa_world_cup');
            
            // Find matching event
            const matched = oddsEvents.find(o => {
              const apiHome = o.home_team.toLowerCase();
              const apiAway = o.away_team.toLowerCase();
              
              return (
                (apiHome.includes(homeName) || homeName.includes(apiHome)) &&
                (apiAway.includes(awayName) || awayName.includes(apiAway))
              ) || (
                (apiHome.includes(awayName) || awayName.includes(apiHome)) &&
                (apiAway.includes(homeName) || homeName.includes(apiAway))
              );
            });

            if (matched && matched.bookmakers && matched.bookmakers.length > 0) {
              // Find first bookmaker with h2h market
              const bookmaker = matched.bookmakers[0];
              const market = bookmaker.markets.find(m => m.key === 'h2h');
              if (market && market.outcomes) {
                const homeOutcome = market.outcomes.find(o => o.name.toLowerCase() === matched.home_team.toLowerCase());
                const awayOutcome = market.outcomes.find(o => o.name.toLowerCase() === matched.away_team.toLowerCase());
                const drawOutcome = market.outcomes.find(o => o.name.toLowerCase() === 'draw' || o.name.toLowerCase() === '平局');

                if (homeOutcome && awayOutcome) {
                  const homeTla = selectedDetailMatch.homeTeam.tla || homeOutcome.name.substring(0, 3).toUpperCase();
                  const awayTla = selectedDetailMatch.awayTeam.tla || awayOutcome.name.substring(0, 3).toUpperCase();
                  
                  setRealOdds({
                    homeOdds: `${homeTla} ${homeOutcome.price.toFixed(2)}`,
                    drawOdds: isZh ? `平局 ${drawOutcome ? drawOutcome.price.toFixed(2) : '-'}` : `Draw ${drawOutcome ? drawOutcome.price.toFixed(2) : '-'}`,
                    awayOdds: `${awayTla} ${awayOutcome.price.toFixed(2)}`
                  });
                }
              }
            }
          } catch (err) {
            console.error('Error matching real odds:', err);
          } finally {
            setLoadingOdds(false);
          }
        };
        loadRealOdds();
      }
    } else {
      setRealOdds(null);
    }
  }, [selectedDetailMatch, selectedCsgoDetailMatch]);

  // Format date and time (FORCED TO CHINA STANDARD TIME / UTC+8)
  const formatUtcDate = (utcDate: string) => {
    const d = dayjs(utcDate).utcOffset(8);
    if (isZh) {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return `${d.month() + 1}月${d.date()}日 ${weekdays[d.day()]}`;
    }
    return d.format('ddd, MMM DD');
  };

  const formatUtcTime = (utcDate: string) => {
    const d = dayjs(utcDate).utcOffset(8);
    const hour = d.hour();
    const minute = d.minute().toString().padStart(2, '0');
    if (isZh) {
      let period = '';
      if (hour >= 0 && hour < 5) period = '凌晨';
      else if (hour >= 5 && hour < 12) period = '上午';
      else if (hour >= 12 && hour < 13) period = '中午';
      else if (hour >= 13 && hour < 18) period = '下午';
      else period = '晚上';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      return `${period}${displayHour}:${minute}`;
    }
    return d.format('h:mm A');
  };

  // Group matches by date
  const groupMatchesByDate = (matchesList: FootballDataMatch[]) => {
    const map: Record<string, FootballDataMatch[]> = {};
    matchesList.forEach(m => {
      const dateStr = formatUtcDate(m.utcDate);
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(m);
    });
    return Object.keys(map).map(date => ({ date, data: map[date] }));
  };

  const groupedFixtures = groupMatchesByDate(groupMatches);

  const filteredCsgoMatches = csgoMatches.filter(m => m.tournamentName === csgoSelectedTournament && m.stage === csgoSelectedSubStage);
  const groupCsgoMatchesByDate = (list: CsgoMatch[]) => {
    const map: Record<string, CsgoMatch[]> = {};
    list.forEach(m => {
      const dateStr = formatUtcDate(m.utcDate);
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(m);
    });
    return Object.keys(map).map(date => ({ date, data: map[date] }));
  };
  const groupedCsgoFixtures = groupCsgoMatchesByDate(filteredCsgoMatches);

  // Group names formatting
  const getGroupName = (groupKey: string) => {
    const letter = groupKey.replace('GROUP_', '');
    return isZh ? `${letter}组` : `Group ${letter}`;
  };

  const getStageText = (stage: string) => {
    if (stage === 'GROUP_STAGE') return isZh ? '小组赛 · 第1场' : 'Group Stage · Match 1';
    if (stage === 'ROUND_OF_32') return isZh ? '32强淘汰赛' : 'Round of 32';
    if (stage === 'ROUND_OF_16') return isZh ? '16强淘汰赛' : 'Round of 16';
    if (stage === 'QUARTER_FINALS') return isZh ? '1/4 决赛' : 'Quarter-finals';
    if (stage === 'SEMI_FINALS') return isZh ? '半决赛' : 'Semi-finals';
    if (stage === 'FINAL') return isZh ? '决赛' : 'Final';
    return stage;
  };

  // Render Standings
  const renderStandings = (inModal: boolean = false) => (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={[styles.scrollContent, inModal && { paddingTop: 4 }]}
      refreshControl={
        !inModal ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        ) : undefined
      }
    >
      {standings.map((group) => (
        <View key={group.group} style={[styles.glassCard, { borderColor: theme === 'light' ? 'rgba(255, 255, 255, 0.55)' : 'rgba(255, 255, 255, 0.15)', backgroundColor: colors.cardBackground }]}>
          <BlurView tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} intensity={70} style={StyleSheet.absoluteFill} />
          
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.groupTitle, { color: colors.text }]}>{getGroupName(group.group)}</Text>
            <View style={styles.statsHeaderBox}>
              <Text style={[styles.statHeaderCol, { color: colors.textSecondary }]}>{isZh ? '场' : 'P'}</Text>
              <Text style={[styles.statHeaderCol, { color: colors.textSecondary }]}>{isZh ? '胜' : 'W'}</Text>
              <Text style={[styles.statHeaderCol, { color: colors.textSecondary }]}>{isZh ? '平' : 'D'}</Text>
              <Text style={[styles.statHeaderCol, { color: colors.textSecondary }]}>{isZh ? '负' : 'L'}</Text>
              <Text style={[styles.statHeaderCol, { color: colors.textSecondary, width: 28 }]}>{isZh ? '净' : 'GD'}</Text>
              <Text style={[styles.statHeaderCol, { color: colors.text, fontWeight: '700' }]}>{isZh ? '积分' : 'Pts'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {group.table.map((entry) => {
            const flag = getTeamFlagCode(entry.team.name);
            return (
              <View key={entry.team.id} style={styles.tableBodyRow}>
                <View style={styles.teamInfoBox}>
                  <Text style={[styles.rankNumber, { color: colors.textSecondary }]}>{entry.position}</Text>
                  {flag ? (
                    <CountryFlag isoCode={flag} size={14} style={styles.flagIcon} />
                  ) : (
                    <View style={[styles.flagPlaceholder, { backgroundColor: colors.border }]} />
                  )}
                  <Text style={[styles.teamNameText, { color: colors.text }]} numberOfLines={1}>
                    {isZh ? translateTeam(entry.team.name) : entry.team.name}
                  </Text>
                </View>
                
                <View style={styles.statsHeaderBox}>
                  <Text style={[styles.statBodyCol, { color: colors.textSecondary }]}>{entry.playedGames}</Text>
                  <Text style={[styles.statBodyCol, { color: colors.textSecondary }]}>{entry.won}</Text>
                  <Text style={[styles.statBodyCol, { color: colors.textSecondary }]}>{entry.draw}</Text>
                  <Text style={[styles.statBodyCol, { color: colors.textSecondary }]}>{entry.lost}</Text>
                  <Text style={[styles.statBodyCol, { color: colors.textSecondary, width: 28 }]}>
                    {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
                  </Text>
                  <Text style={[styles.statBodyCol, { color: colors.text, fontWeight: '700' }]}>{entry.points}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}
      <View style={{ height: 120 }} />
    </ScrollView>
  );

  // Render Group Match List
  const renderGroupMatches = () => {
    // Helper to get team record W-D-L from standings
    const getTeamRecord = (teamId: number) => {
      if (!standings || standings.length === 0) return '';
      for (const group of standings) {
        const entry = group.table.find(t => t.team.id === teamId);
        if (entry) {
          return `${entry.won}-${entry.draw}-${entry.lost}`;
        }
      }
      return '';
    };

    return (
    <ScrollView 
      ref={groupScrollRef}
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
      }
    >
      {groupedFixtures.map((groupDay) => (
        <View 
          key={groupDay.date} 
          style={styles.dateSection}
          onLayout={(e) => {
            dateLayouts.current[groupDay.date] = e.nativeEvent.layout.y;
          }}
        >
          <Text style={[styles.dateSectionTitle, { color: colors.text }]}>{groupDay.date}</Text>
          
          {groupDay.data.map((match) => {
            const homeFlag = getTeamFlagCode(match.homeTeam.name);
            const awayFlag = getTeamFlagCode(match.awayTeam.name);
            
            const hoursSinceStart = dayjs().diff(dayjs(match.utcDate), 'hour', true);
            const isFinished = match.status === 'FINISHED' || 
                               (hoursSinceStart > 4 && ['IN_PLAY', 'LIVE', 'PAUSED'].includes(match.status));
            const isLive = !isFinished && ['IN_PLAY', 'LIVE', 'PAUSED'].includes(match.status);
            
            return (
              <Pressable 
                key={match.id} 
                onPress={() => setSelectedDetailMatch(match)}
                style={({ pressed }) => [
                  styles.matchCard, 
                  { borderColor: theme === 'light' ? 'rgba(255, 255, 255, 0.55)' : 'rgba(255, 255, 255, 0.15)', backgroundColor: colors.cardBackground },
                  isFinished && { opacity: 0.6 },
                  pressed && { opacity: 0.85 }
                ]}
              >
                <BlurView tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} intensity={70} style={StyleSheet.absoluteFill} />
                
                {/* Match sub-header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, zIndex: 5 }}>
                  <Text style={[styles.matchSubHeader, { color: colors.textSecondary, marginBottom: 0 }]} numberOfLines={1}>
                    {getStageText(match.stage)}{match.venue ? ` · ${match.venue}` : ''}
                  </Text>
                  {isFinished && (
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary }}>
                      {isZh ? '已完赛' : 'FT'}
                    </Text>
                  )}
                  {isLive && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30', marginRight: 4 }} />
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#FF3B30' }}>
                        {isZh ? '直播中' : 'LIVE'}
                      </Text>
                    </View>
                  )}
                </View>
                
                {/* Match row */}
                <View style={styles.matchMainRow}>
                  {/* Home Team */}
                  <View style={[styles.teamColumn, { alignItems: 'flex-end' }]}>
                    <View style={styles.teamRowAlign}>
                      <View style={{ backgroundColor: theme === 'light' ? 'rgba(0, 102, 204, 0.1)' : 'rgba(56, 189, 248, 0.15)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4, marginRight: 4 }}>
                        <Text style={{ fontSize: 9, fontWeight: '700', color: colors.accent }}>{isZh ? '主' : 'H'}</Text>
                      </View>
                      <Text style={[
                        styles.teamNameInline, 
                        { color: colors.text, marginRight: 8 },
                        isFinished && match.score.winner === 'AWAY_TEAM' && { color: colors.textSecondary, fontWeight: 'normal' },
                        isFinished && match.score.winner === 'HOME_TEAM' && { fontWeight: 'bold' }
                      ]} numberOfLines={1}>
                        {isZh ? translateTeam(match.homeTeam.name) : match.homeTeam.name}
                      </Text>
                      {homeFlag ? (
                        <CountryFlag isoCode={homeFlag} size={16} style={[styles.teamFlag, isFinished && { opacity: 0.7 }]} />
                      ) : (
                        <View style={[styles.flagPlaceholder, { backgroundColor: colors.border }]} />
                      )}
                    </View>
                    <Text style={[styles.recordText, { color: colors.textSecondary }]}>{getTeamRecord(match.homeTeam.id)}</Text>
                  </View>

                  {/* Time / Score Center */}
                  <View style={styles.timeCenterBox}>
                    {isFinished || isLive ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: isLive ? '#FF3B30' : colors.text }}>
                          {match.score.fullTime.home}
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginHorizontal: 8 }}>
                          :
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: isLive ? '#FF3B30' : colors.text }}>
                          {match.score.fullTime.away}
                        </Text>
                      </View>
                    ) : (
                      <Text style={[styles.timeText, { color: colors.text }]}>
                        {formatUtcTime(match.utcDate)}
                      </Text>
                    )}
                    {match.odds_win_rate && !isFinished && !isLive && (
                      <Text style={[styles.oddsTagText, { color: colors.accent, marginTop: 2 }]}>
                        {match.odds_win_rate}
                      </Text>
                    )}
                  </View>

                  {/* Away Team */}
                  <View style={[styles.teamColumn, { alignItems: 'flex-start' }]}>
                    <View style={styles.teamRowAlign}>
                      {awayFlag ? (
                        <CountryFlag isoCode={awayFlag} size={16} style={[styles.teamFlag, isFinished && { opacity: 0.7 }]} />
                      ) : (
                        <View style={[styles.flagPlaceholder, { backgroundColor: colors.border }]} />
                      )}
                      <Text style={[
                        styles.teamNameInline, 
                        { color: colors.text, marginLeft: 8, marginRight: 4 },
                        isFinished && match.score.winner === 'HOME_TEAM' && { color: colors.textSecondary, fontWeight: 'normal' },
                        isFinished && match.score.winner === 'AWAY_TEAM' && { fontWeight: 'bold' }
                      ]} numberOfLines={1}>
                        {isZh ? translateTeam(match.awayTeam.name) : match.awayTeam.name}
                      </Text>
                      <View style={{ backgroundColor: 'rgba(120, 120, 120, 0.12)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 }}>
                        <Text style={{ fontSize: 9, fontWeight: '700', color: colors.textSecondary }}>{isZh ? '客' : 'A'}</Text>
                      </View>
                    </View>
                    <Text style={[styles.recordText, { color: colors.textSecondary }]}>{getTeamRecord(match.awayTeam.id)}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
  };

  // Render bracket placeholder / seed badge inside knockout circles
  const renderPlaceholderBadge = (name: string) => {
    // If it's a real team name, show flag
    const flag = getTeamFlagCode(name);
    if (flag) {
      return <CountryFlag isoCode={flag} size={14} style={[styles.flagIcon, { marginLeft: 0, marginRight: 10 }]} />;
    }
    
    // Otherwise it's a qualifier label (e.g. 1A, 2B, 3A/B/C/D/F)
    let display = name;
    if (name.includes('/')) {
      const match = name.match(/^(\d)/);
      display = match ? `${match[1]}rd` : '?';
    }
    return (
      <View style={[styles.placeholderBadge, { backgroundColor: colors.border }]}>
        <Text style={[styles.placeholderBadgeText, { color: colors.textSecondary, fontSize: 9, fontWeight: '800' }]}>
          {display}
        </Text>
      </View>
    );
  };

  // Render Knockout Bracket Match list
  const renderKnockouts = () => {
    const list = KNOCKOUT_MATCHES_BY_STAGE[selectedStage] || [];
    return (
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        {list.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <View key={item.id} style={styles.bracketWrapper}>
              <Pressable 
                onPress={() => {
                  const matchData: FootballDataMatch = {
                    id: item.id,
                    utcDate: item.date,
                    status: 'TIMED',
                    matchday: 2,
                    stage: selectedStage,
                    group: null,
                    lastUpdated: '',
                    homeTeam: { id: 0, name: item.home, shortName: item.home, tla: item.home, crest: '' },
                    awayTeam: { id: 0, name: item.away, shortName: item.away, tla: item.away, crest: '' },
                    score: { winner: null, duration: 'REGULAR', fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
                    odds_win_rate: item.odds
                  };
                  setSelectedDetailMatch(matchData);
                }}
                style={({ pressed }) => [
                  styles.bracketMatchCard, 
                  { borderColor: theme === 'light' ? 'rgba(255, 255, 255, 0.55)' : 'rgba(255, 255, 255, 0.15)', backgroundColor: colors.cardBackground },
                  pressed && { opacity: 0.85 }
                ]}
              >
                <BlurView tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} intensity={70} style={StyleSheet.absoluteFill} />
                
                {/* Date header */}
                <Text style={[styles.bracketDateText, { color: colors.textSecondary }]}>
                  {formatUtcDate(item.date)} · {formatUtcTime(item.date)}
                </Text>
                
                {/* Team Rows */}
                <View style={[styles.bracketTeamsContainer, { borderLeftColor: colors.border }]}>
                  {/* Home Placeholder / Team */}
                  <View style={styles.bracketTeamRow}>
                    {renderPlaceholderBadge(item.home)}
                    <Text style={[styles.bracketTeamName, { color: colors.text }]}>
                      {item.home}
                    </Text>
                  </View>

                  {/* Away Placeholder / Team */}
                  <View style={[styles.bracketTeamRow, { marginTop: 12 }]}>
                    {renderPlaceholderBadge(item.away)}
                    <Text style={[styles.bracketTeamName, { color: colors.text }]}>
                      {item.away}
                    </Text>
                  </View>
                </View>

                {/* Optional Odds tag */}
                <View style={styles.bracketOddsRow}>
                  <Text style={[styles.oddsTagText, { color: colors.accent }]}>
                    {item.odds}
                  </Text>
                </View>
              </Pressable>

              {/* Bracket fork line connectors (Mocking flowchart links) */}
              {selectedStage !== 'FINAL' && (
                <View style={styles.connectorContainer}>
                  <View style={[styles.horizontalLine, { backgroundColor: colors.border }]} />
                  <View style={[
                    styles.verticalLine, 
                    { 
                      backgroundColor: colors.border,
                      height: 50,
                      top: isEven ? '50%' : undefined,
                      bottom: !isEven ? '50%' : undefined,
                    }
                  ]} />
                  <View style={[
                    styles.forkBranch, 
                    { 
                      backgroundColor: colors.border,
                      top: isEven ? '50%' : undefined,
                      bottom: !isEven ? '50%' : undefined,
                      marginTop: isEven ? 50 : undefined,
                      marginBottom: !isEven ? 50 : undefined,
                    }
                  ]} />
                </View>
              )}
            </View>
          );
        })}
        <View style={{ height: 120 }} />
      </ScrollView>
    );
  };

  // Render Interactive Match Detail Modal
  const renderMatchDetailModal = () => {
    if (!selectedDetailMatch) return null;
    
    const homeName = selectedDetailMatch.homeTeam.name;
    const awayName = selectedDetailMatch.awayTeam.name;
    const homeFlag = getTeamFlagCode(homeName);
    const awayFlag = getTeamFlagCode(awayName);
    
    // Flag Colors for dynamic PK background
    const homeColors = getTeamColors(homeName);
    const awayColors = getTeamColors(awayName);
    const leftBlobColor = homeColors[0];
    const rightBlobColor = awayColors[0];

    // Find standings for this match's group if applicable
    const groupStanding = standings.find(s => s.group === selectedDetailMatch.group);

    const hoursSinceStart = dayjs().diff(dayjs(selectedDetailMatch.utcDate), 'hour', true);
    const isFinished = selectedDetailMatch.status === 'FINISHED' || 
                       (hoursSinceStart > 4 && ['IN_PLAY', 'LIVE', 'PAUSED'].includes(selectedDetailMatch.status));
    const isLive = !isFinished && ['IN_PLAY', 'LIVE', 'PAUSED'].includes(selectedDetailMatch.status);

    return (
      <Modal
        visible={!!selectedDetailMatch}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setSelectedDetailMatch(null)}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0A0E17' }]}>
        {/* Dynamic Fluid PK Background */}
        <View style={styles.pkBackgroundContainer}>
          <Animated.View style={[
            styles.pkBlobLeft, 
            { backgroundColor: leftBlobColor },
            pkAnimatedBlob1
          ]} />
          <Animated.View style={[
            styles.pkBlobRight, 
            { backgroundColor: rightBlobColor },
            pkAnimatedBlob2
          ]} />
          <BlurView tint="dark" intensity={65} style={StyleSheet.absoluteFill} />
        </View>

        {/* Back button */}
        <View style={[styles.pkHeaderRow, { paddingTop: Platform.OS === 'ios' ? 64 : 54 }]}>
          <Pressable 
            onPress={() => setSelectedDetailMatch(null)} 
            style={styles.pkIconBtn}
          >
            <FontAwesome name="chevron-left" size={18} color="#FFFFFF" />
          </Pressable>
          <Pressable 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              if (LiveActivities) {
                LiveActivities.startActivity('SportsLiveActivityWidget', {
                  matchName: getStageText(selectedDetailMatch.stage) + (selectedDetailMatch.venue ? ` · ${selectedDetailMatch.venue}` : ''),
                  homeTeamName: selectedDetailMatch.homeTeam.name,
                  homeTeamShort: isZh ? translateTeam(selectedDetailMatch.homeTeam.name) : selectedDetailMatch.homeTeam.shortName || 'H',
                  awayTeamName: selectedDetailMatch.awayTeam.name,
                  awayTeamShort: isZh ? translateTeam(selectedDetailMatch.awayTeam.name) : selectedDetailMatch.awayTeam.shortName || 'A',
                  homeScore: selectedDetailMatch.score.fullTime.home || 0,
                  awayScore: selectedDetailMatch.score.fullTime.away || 0,
                  timerDisplay: 'Live',
                  isLive: true
                });
                alert('已成功发送至灵动岛！切到桌面或锁屏查看');
              } else {
                alert('请先运行 npm install react-native-live-activities 并重新编译原生 App，才能激活灵动岛功能。');
              }
            }} 
            style={[styles.pkIconBtn, { width: 'auto', paddingHorizontal: 12, backgroundColor: 'rgba(0,0,0,0.3)' }]}
          >
            <FontAwesome name="apple" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>上岛</Text>
          </Pressable>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.pkScrollContent}
        >
          {/* Stage name */}
          <Text style={styles.pkStageTitle}>
            {getStageText(selectedDetailMatch.stage)}{selectedDetailMatch.venue ? ` · ${selectedDetailMatch.venue}` : ''}
          </Text>

          {/* PK Duel Header */}
          <View style={styles.pkMainRow}>
            {/* Home Team */}
            <View style={styles.pkTeamCol}>
              <View style={styles.largeFlagWrapper}>
                {homeFlag ? (
                  <CountryFlag isoCode={homeFlag} size={70} style={styles.largeFlag} />
                ) : (
                  <View style={styles.largeFlagPlaceholder}>
                    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '700' }}>{homeName.substring(0, 2)}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.pkTeamName} numberOfLines={1}>
                {isZh ? translateTeam(homeName) : homeName}
              </Text>
            </View>

            {/* Time / Score Center */}
            <View style={styles.pkTimeCol}>
            {isFinished || isLive ? (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 32, fontWeight: '900', color: '#FFFFFF' }}>
                    {selectedDetailMatch.score.fullTime.home} - {selectedDetailMatch.score.fullTime.away}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: isLive ? '#FF3B30' : 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                    {isLive ? 'LIVE' : 'FINISHED'}
                  </Text>
                </View>
              ) : (
                <Text style={styles.pkTimeText}>
                  {formatUtcTime(selectedDetailMatch.utcDate)}
                </Text>
              )}
            </View>

            {/* Away Team */}
            <View style={styles.pkTeamCol}>
              <View style={styles.largeFlagWrapper}>
                {awayFlag ? (
                  <CountryFlag isoCode={awayFlag} size={70} style={styles.largeFlag} />
                ) : (
                  <View style={styles.largeFlagPlaceholder}>
                    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '700' }}>{awayName.substring(0, 2)}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.pkTeamName} numberOfLines={1}>
                {isZh ? translateTeam(awayName) : awayName}
              </Text>
            </View>
          </View>

          {/* Betting Odds Card */}
          <View style={styles.pkGlassCard}>
            <BlurView tint="dark" intensity={50} style={StyleSheet.absoluteFill} />
            <Text style={styles.pkCardTitle}>{isZh ? '博彩赔率' : 'Betting Odds'}</Text>
            {loadingOdds ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginVertical: 12 }} />
            ) : realOdds ? (
              <View style={styles.pkOddsRow}>
                <View style={styles.pkOddsCol}>
                  <Text style={styles.pkOddsValue}>{realOdds.homeOdds}</Text>
                </View>
                <View style={[styles.pkOddsCol, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }]}>
                  <Text style={styles.pkOddsValue}>{realOdds.drawOdds}</Text>
                </View>
                <View style={styles.pkOddsCol}>
                  <Text style={styles.pkOddsValue}>{realOdds.awayOdds}</Text>
                </View>
              </View>
            ) : (
              <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginVertical: 12, fontSize: 13 }}>
                {isZh ? '暂无实时赔率数据' : 'No live odds available'}
              </Text>
            )}
          </View>

          {/* Starting Lineups Card */}
          {(() => {
            const lineups = getMatchLineup(homeName, awayName);
            return (
              <View style={styles.pkGlassCard}>
                <BlurView tint="dark" intensity={50} style={StyleSheet.absoluteFill} />
                <Text style={styles.pkCardTitle}>{isZh ? '首发及战术阵容' : 'Starting Lineups'}</Text>
                
                {/* Formations and Coaches */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{isZh ? '主队阵型' : 'Home Formation'}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFFFFF', marginVertical: 2 }}>{lineups.home.formation}</Text>
                    <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }} numberOfLines={1}>{isZh ? '主教练' : 'Coach'}: {isZh ? translatePlayer(lineups.home.coach) : lineups.home.coach}</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)', height: '100%' }} />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{isZh ? '客队阵型' : 'Away Formation'}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFFFFF', marginVertical: 2 }}>{lineups.away.formation}</Text>
                    <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }} numberOfLines={1}>{isZh ? '主教练' : 'Coach'}: {isZh ? translatePlayer(lineups.away.coach) : lineups.away.coach}</Text>
                  </View>
                </View>
                
                <View style={styles.pkCardDivider} />

                <Text style={[styles.pkCardTitle, { fontSize: 13, marginTop: 12, marginBottom: 8 }]}>
                  {isZh ? '战术沙盘' : 'Tactical Pitch'}
                </Text>
                
                <TacticalPitch 
                  homeStartingXI={lineups.home.startingXI}
                  homeFormation={lineups.home.formation}
                  homeColors={getTeamColors(homeName)}
                  awayStartingXI={lineups.away.startingXI}
                  awayFormation={lineups.away.formation}
                  awayColors={getTeamColors(awayName)}
                  isZh={isZh}
                />

                <View style={[styles.pkCardDivider, { marginVertical: 14 }]} />
                
                {/* Starting XI Lists side-by-side */}
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                  {/* Home XI */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF', marginBottom: 8, opacity: 0.9 }}>{isZh ? '主队首发' : 'Home XI'}</Text>
                    {lineups.home.startingXI.map(player => (
                      <View key={player.number} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                        <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 9, fontWeight: '700', color: '#FFFFFF' }}>{player.number}</Text>
                        </View>
                        <Text style={{ fontSize: 12, color: '#FFFFFF', marginLeft: 6, flex: 1 }} numberOfLines={1}>{isZh ? translatePlayer(player.name) : player.name}</Text>
                        <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', width: 22, textAlign: 'right' }}>{player.position}</Text>
                      </View>
                    ))}
                  </View>
                  
                  {/* Divider */}
                  <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                  
                  {/* Away XI */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF', marginBottom: 8, opacity: 0.9 }}>{isZh ? '客队首发' : 'Away XI'}</Text>
                    {lineups.away.startingXI.map(player => (
                      <View key={player.number} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                        <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 9, fontWeight: '700', color: '#FFFFFF' }}>{player.number}</Text>
                        </View>
                        <Text style={{ fontSize: 12, color: '#FFFFFF', marginLeft: 6, flex: 1 }} numberOfLines={1}>{isZh ? translatePlayer(player.name) : player.name}</Text>
                        <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', width: 22, textAlign: 'right' }}>{player.position}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            );
          })()}

          {/* Group Standings Card (If applicable) */}
          {groupStanding && (
            <View style={styles.pkGlassCard}>
              <BlurView tint="dark" intensity={50} style={StyleSheet.absoluteFill} />
              <Text style={styles.pkCardTitle}>
                {getGroupName(groupStanding.group)} {isZh ? '积分表' : 'Standings'}
              </Text>
              
              {/* Standings Header */}
              <View style={styles.pkStandingsHeader}>
                <Text style={[styles.pkStandingsColTeam, { color: 'rgba(255,255,255,0.5)' }]}>{isZh ? '球队' : 'Team'}</Text>
                <View style={styles.pkStandingsHeaderRight}>
                  <Text style={styles.pkStandingsColStat}>{isZh ? '场' : 'P'}</Text>
                  <Text style={styles.pkStandingsColStat}>{isZh ? '胜' : 'W'}</Text>
                  <Text style={styles.pkStandingsColStat}>{isZh ? '平' : 'D'}</Text>
                  <Text style={styles.pkStandingsColStat}>{isZh ? '负' : 'L'}</Text>
                  <Text style={[styles.pkStandingsColStat, { width: 26 }]}>{isZh ? '净' : 'GD'}</Text>
                  <Text style={[styles.pkStandingsColStat, { color: '#FFF', fontWeight: '700' }]}>{isZh ? '积分' : 'Pts'}</Text>
                </View>
              </View>

              <View style={styles.pkCardDivider} />

              {/* Standings Rows */}
              {groupStanding.table.map((entry) => {
                const flag = getTeamFlagCode(entry.team.name);
                const isCurrentTeam = entry.team.name === homeName || entry.team.name === awayName;
                return (
                  <View key={entry.team.id} style={[styles.pkStandingsRow, isCurrentTeam && { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, paddingHorizontal: 4 }]}>
                    <View style={styles.pkStandingsTeamLeft}>
                      <Text style={styles.pkStandingsRank}>{entry.position}</Text>
                      {flag ? (
                        <CountryFlag isoCode={flag} size={14} style={styles.pkStandingsFlag} />
                      ) : (
                        <View style={styles.pkStandingsFlagPlaceholder} />
                      )}
                      <Text style={styles.pkStandingsTeamName} numberOfLines={1}>
                        {isZh ? translateTeam(entry.team.name) : entry.team.name}
                      </Text>
                    </View>
                    
                    <View style={styles.pkStandingsHeaderRight}>
                      <Text style={styles.pkStandingsStatVal}>{entry.playedGames}</Text>
                      <Text style={styles.pkStandingsStatVal}>{entry.won}</Text>
                      <Text style={styles.pkStandingsStatVal}>{entry.draw}</Text>
                      <Text style={styles.pkStandingsStatVal}>{entry.lost}</Text>
                      <Text style={[styles.pkStandingsStatVal, { width: 26 }]}>
                        {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
                      </Text>
                      <Text style={[styles.pkStandingsStatVal, { color: '#FFF', fontWeight: '700' }]}>{entry.points}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
          <View style={{ height: 120 }} />
        </ScrollView>
        </View>
      </Modal>
    );
  };

  // Scroll to today's date on load/switch
  const scrollToToday = () => {
    if (!groupMatches || groupMatches.length === 0) return;
    setTimeout(() => {
      const todayStr = formatUtcDate(dayjs().format());
      let targetDate = todayStr;
      
      const exists = groupedFixtures.some(g => g.date === todayStr);
      if (!exists && groupedFixtures.length > 0) {
        const now = dayjs();
        let closest = groupedFixtures[0].date;
        let minDiff = Infinity;
        
        groupedFixtures.forEach(g => {
          const matchDate = dayjs(g.data[0].utcDate);
          const diff = Math.abs(matchDate.diff(now, 'day'));
          if (diff < minDiff) {
            minDiff = diff;
            closest = g.date;
          }
        });
        targetDate = closest;
      }
      
      const y = dateLayouts.current[targetDate];
      if (y !== undefined) {
        groupScrollRef.current?.scrollTo({ y: y - 10, animated: true });
      }
    }, 300);
  };

  useEffect(() => {
    if (selectedStage === 'GROUP_STAGE' && groupSubTab === 'matches' && !loading) {
      scrollToToday();
    }
  }, [selectedStage, groupSubTab, loading]);

  const renderNbaSchedule = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
      <FontAwesome name="dribbble" size={64} color="#FF8200" style={{ marginBottom: 16, opacity: 0.8 }} />
      <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
        {isZh ? 'NBA 赛程数据' : 'NBA Schedule'}
      </Text>
      <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 }}>
        {isZh ? '当前未配置 NBA API，你可以在右上角切换到 CS:GO 赛程进行完整的赛程与赔率交互。' : 'NBA API is not configured yet. Toggle to CS:GO in the top-right corner to interact with full match and odds views.'}
      </Text>
    </View>
  );

  const renderCsgoSchedule = () => {
    if (csgoLoading) {
      return (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      );
    }

    if (groupedCsgoFixtures.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 }}>
          <Text style={{ color: colors.textSecondary }}>
            {isZh ? '没有找到赛程信息' : 'No matches found'}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        {groupedCsgoFixtures.map((groupDay) => (
          <View key={groupDay.date} style={styles.dateSection}>
            <Text style={[styles.dateSectionTitle, { color: colors.text }]}>{groupDay.date}</Text>
            
            {groupDay.data.map((match) => {
              const isFinished = match.status === 'FINISHED';
              const isLive = match.status === 'IN_PLAY';
              
              return (
                <Pressable 
                  key={match.id} 
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    setSelectedCsgoDetailMatch(match);
                  }}
                  style={({ pressed }) => [
                    styles.matchCard, 
                    { borderColor: theme === 'light' ? 'rgba(255, 255, 255, 0.55)' : 'rgba(255, 255, 255, 0.15)', backgroundColor: colors.cardBackground },
                    isFinished && { opacity: 0.65 },
                    pressed && { opacity: 0.85 }
                  ]}
                >
                  <BlurView tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} intensity={70} style={StyleSheet.absoluteFill} />
                  
                  {/* Match sub-header */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, zIndex: 5 }}>
                    <Text style={[styles.matchSubHeader, { color: colors.textSecondary, marginBottom: 0 }]}>
                      {match.tournamentName}
                    </Text>
                    {isFinished && (
                      <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary }}>
                        {isZh ? '已完赛' : 'FT'}
                      </Text>
                    )}
                    {isLive && (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30', marginRight: 4 }} />
                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#FF3B30' }}>
                          {isZh ? '直播中' : 'LIVE'}
                        </Text>
                      </View>
                    )}
                    {!isFinished && !isLive && (
                      <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent }}>
                        {isZh ? '未开始' : 'UPCOMING'}
                      </Text>
                    )}
                  </View>
                  
                  {/* Match row */}
                  <View style={styles.matchMainRow}>
                    {/* Home Team */}
                    <View style={[styles.teamColumn, { alignItems: 'flex-end' }]}>
                      <View style={styles.teamRowAlign}>
                        <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
                          <Text style={[
                            { fontSize: 15, fontWeight: '700', color: colors.text },
                            isFinished && match.score.home < match.score.away && { color: colors.textSecondary, fontWeight: 'normal' },
                            isFinished && match.score.home > match.score.away && { fontWeight: 'bold' }
                          ]} numberOfLines={1}>
                            {getTeamAbbreviation(match.homeTeam.name, match.homeTeam.tla)}
                          </Text>
                          <Text style={{ fontSize: 9, color: colors.textSecondary, marginTop: 1 }} numberOfLines={1}>
                            {match.homeTeam.name}
                          </Text>
                        </View>
                        {renderTeamEmblem(match.homeTeam.name, 28, isFinished, match.homeTeam.logoUrl)}
                      </View>
                    </View>

                    {/* Score / Center */}
                    <View style={styles.timeCenterBox}>
                      {isFinished || isLive ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 18, fontWeight: '800', color: isLive ? '#FF3B30' : colors.text }}>
                            {match.score.home}
                          </Text>
                          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginHorizontal: 8 }}>
                            -
                          </Text>
                          <Text style={{ fontSize: 18, fontWeight: '800', color: isLive ? '#FF3B30' : colors.text }}>
                            {match.score.away}
                          </Text>
                        </View>
                      ) : (
                        <Text style={[styles.timeText, { color: colors.text }]}>
                          {formatUtcTime(match.utcDate)}
                        </Text>
                      )}
                    </View>

                    {/* Away Team */}
                    <View style={[styles.teamColumn, { alignItems: 'flex-start' }]}>
                      <View style={styles.teamRowAlign}>
                        {renderTeamEmblem(match.awayTeam.name, 28, isFinished, match.awayTeam.logoUrl)}
                        <View style={{ alignItems: 'flex-start', marginLeft: 8 }}>
                          <Text style={[
                            { fontSize: 15, fontWeight: '700', color: colors.text },
                            isFinished && match.score.home > match.score.away && { color: colors.textSecondary, fontWeight: 'normal' },
                            isFinished && match.score.home < match.score.away && { fontWeight: 'bold' }
                          ]} numberOfLines={1}>
                            {getTeamAbbreviation(match.awayTeam.name, match.awayTeam.tla)}
                          </Text>
                          <Text style={{ fontSize: 9, color: colors.textSecondary, marginTop: 1 }} numberOfLines={1}>
                            {match.awayTeam.name}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Simulated Odds Tag */}
                  {match.odds && match.odds.length > 0 && !isFinished && (
                    <View style={{ marginTop: 8, alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 6 }}>
                      <Text style={{ fontSize: 10, color: colors.textSecondary }}>
                        {isZh ? '平均赔率：' : 'Avg Odds: '}
                        <Text style={{ color: colors.accent, fontWeight: '600' }}>
                          {getTeamAbbreviation(match.homeTeam.name, match.homeTeam.tla)} {match.odds[0].homeOdds.toFixed(2)} vs {getTeamAbbreviation(match.awayTeam.name, match.awayTeam.tla)} {match.odds[0].awayOdds.toFixed(2)}
                        </Text>
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>
    );
  };

  const renderCsgoDetailModal = () => {
    if (!selectedCsgoDetailMatch) return null;
    
    const { homeTeam, awayTeam, score, status, utcDate, maps, lineups, odds, tournamentName } = selectedCsgoDetailMatch;
    
    const homeColors = CSGO_TEAM_COLORS[homeTeam.name] || ['#3A86FF', '#8338EC'];
    const awayColors = CSGO_TEAM_COLORS[awayTeam.name] || ['#8338EC', '#3A86FF'];
    const leftBlobColor = homeColors[0];
    const rightBlobColor = awayColors[0];

    const isLive = status === 'IN_PLAY';

    return (
      <Modal
        visible={!!selectedCsgoDetailMatch}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setSelectedCsgoDetailMatch(null)}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0C0D12' }]}>
          {/* Dynamic Fluid Background */}
          <View style={styles.pkBackgroundContainer}>
            <Animated.View style={[
              styles.pkBlobLeft, 
              { backgroundColor: leftBlobColor },
              pkAnimatedBlob1
            ]} />
            <Animated.View style={[
              styles.pkBlobRight, 
              { backgroundColor: rightBlobColor },
              pkAnimatedBlob2
            ]} />
            <BlurView tint="dark" intensity={70} style={StyleSheet.absoluteFill} />
          </View>

          {/* Back button */}
          <View style={[styles.pkHeaderRow, { paddingTop: Platform.OS === 'ios' ? 64 : 54 }]}>
            <Pressable 
              onPress={() => setSelectedCsgoDetailMatch(null)} 
              style={styles.pkIconBtn}
            >
              <FontAwesome name="chevron-left" size={18} color="#FFFFFF" />
            </Pressable>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFFFFF' }}>
              {isZh ? '赛事详情' : 'Match Details'}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.pkScrollContent}
          >
            {/* Tournament Name */}
            <Text style={styles.pkStageTitle}>
              {tournamentName}
            </Text>

            {/* Duel Header */}
            <View style={styles.pkMainRow}>
              {/* Home Team */}
              <View style={styles.pkTeamCol}>
                <View style={{ marginBottom: 8 }}>
                  {renderTeamEmblem(homeTeam.name, 60, false, homeTeam.logoUrl)}
                </View>
                <Text style={[styles.pkTeamName, { fontSize: 18, fontWeight: '800' }]} numberOfLines={1}>
                  {getTeamAbbreviation(homeTeam.name, homeTeam.tla)}
                </Text>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2, textAlign: 'center' }} numberOfLines={1}>
                  {homeTeam.name}
                </Text>
              </View>

              {/* Time / Score */}
              <View style={styles.pkTimeCol}>
                {status === 'FINISHED' || isLive ? (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: 2 }}>
                      {score.home} - {score.away}
                    </Text>
                    <View style={[
                      { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 8 },
                      isLive ? { backgroundColor: '#FF3B30' } : { backgroundColor: 'rgba(255,255,255,0.15)' }
                    ]}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: '#FFFFFF' }}>
                        {isLive ? 'LIVE' : 'FINISHED'}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={[styles.pkTimeText, { fontSize: 18 }]}>
                      {formatUtcTime(utcDate)}
                    </Text>
                    <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                      {isZh ? '等待开始' : 'Upcoming'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Away Team */}
              <View style={styles.pkTeamCol}>
                <View style={{ marginBottom: 8 }}>
                  {renderTeamEmblem(awayTeam.name, 60, false, awayTeam.logoUrl)}
                </View>
                <Text style={[styles.pkTeamName, { fontSize: 18, fontWeight: '800' }]} numberOfLines={1}>
                  {getTeamAbbreviation(awayTeam.name, awayTeam.tla)}
                </Text>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2, textAlign: 'center' }} numberOfLines={1}>
                  {awayTeam.name}
                </Text>
              </View>
            </View>

            {/* Map-by-map Scores Card */}
            <View style={styles.pkGlassCard}>
              <BlurView tint="dark" intensity={50} style={StyleSheet.absoluteFill} />
              <Text style={styles.pkCardTitle}>{isZh ? '地图比分' : 'Map Scores'}</Text>
              
              {maps.map((map, idx) => {
                const mapFinished = map.status === 'FINISHED';
                const mapLive = map.status === 'IN_PLAY';
                return (
                  <View key={map.mapName}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                          <Text style={{ fontSize: 10, color: '#FFF', fontWeight: '800' }}>{idx + 1}</Text>
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFF' }}>{map.mapName}</Text>
                      </View>
                      
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {mapLive && (
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30', marginRight: 8 }} />
                        )}
                        <Text style={[
                          { fontSize: 16, fontWeight: '800' },
                          mapFinished ? { color: '#FFF' } : (mapLive ? { color: '#FF3B30' } : { color: 'rgba(255,255,255,0.3)' })
                        ]}>
                          {map.status !== 'UNPLAYED' ? `${map.homeScore} - ${map.awayScore}` : '- : -'}
                        </Text>
                      </View>
                    </View>
                    {idx < maps.length - 1 && <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />}
                  </View>
                );
              })}
            </View>

            {/* Odds Card */}
            {odds && odds.length > 0 && (
              <View style={styles.pkGlassCard}>
                <BlurView tint="dark" intensity={50} style={StyleSheet.absoluteFill} />
                <Text style={styles.pkCardTitle}>{isZh ? '博彩赔率' : 'Betting Odds'}</Text>
                <View style={styles.pkStandingsHeader}>
                  <Text style={[styles.pkStandingsColTeam, { color: 'rgba(255,255,255,0.4)', flex: 1.5 }]}>
                    {isZh ? '博彩商' : 'Bookmaker'}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 32 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.4)', width: 50, textAlign: 'center' }}>
                      {homeTeam.tla} {isZh ? '胜' : 'Win'}
                    </Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.4)', width: 50, textAlign: 'center' }}>
                      {awayTeam.tla} {isZh ? '胜' : 'Win'}
                    </Text>
                  </View>
                </View>
                <View style={styles.pkCardDivider} />
                {odds.map(o => (
                  <View key={o.providerName} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFF', flex: 1.5 }}>{o.providerName}</Text>
                    <View style={{ flexDirection: 'row', gap: 32 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.accent, width: 50, textAlign: 'center' }}>{o.homeOdds.toFixed(2)}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.accent, width: 50, textAlign: 'center' }}>{o.awayOdds.toFixed(2)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Player Stats / Lineups Card */}
            {lineups && (
              <View style={styles.pkGlassCard}>
                <BlurView tint="dark" intensity={50} style={StyleSheet.absoluteFill} />
                <Text style={styles.pkCardTitle}>{isZh ? '战队阵容与选手数据' : 'Team Lineups & Player Stats'}</Text>
                
                {/* Coach info */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{isZh ? '教练' : 'Coach'}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFFFFF', marginVertical: 2 }}>{lineups.home.coach}</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)', height: '100%' }} />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{isZh ? '教练' : 'Coach'}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFFFFF', marginVertical: 2 }}>{lineups.away.coach}</Text>
                  </View>
                </View>
                
                <View style={styles.pkCardDivider} />
                
                {/* List Headers */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>{homeTeam.name}</Text>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '700', textAlign: 'center', width: 90 }}>K/D (ADR) R</Text>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '700', textAlign: 'right' }}>{awayTeam.name}</Text>
                </View>

                {/* Lineup comparison */}
                {Array.from({ length: 5 }).map((_, i) => {
                  const pHome = lineups.home.players[i];
                  const pAway = lineups.away.players[i];
                  if (!pHome || !pAway) return null;
                  return (
                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
                      {/* Home player info */}
                      <View style={{ flex: 1.2, flexDirection: 'row', alignItems: 'center' }}>
                        <View>
                          <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFF' }}>{pHome.name}</Text>
                          <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>{pHome.position}</Text>
                        </View>
                      </View>
                      
                      {/* Compare Stats center */}
                      <View style={{ width: 100, alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, color: '#FFF', fontWeight: '800' }}>
                          {pHome.rating.toFixed(2)} <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 'normal' }}>vs</Text> {pAway.rating.toFixed(2)}
                        </Text>
                        <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                          {pHome.kills}/{pHome.deaths} ({pHome.adr.toFixed(0)}) | {pAway.kills}/{pAway.deaths} ({pAway.adr.toFixed(0)})
                        </Text>
                      </View>

                      {/* Away player info */}
                      <View style={{ flex: 1.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFF', textAlign: 'right' }}>{pAway.name}</Text>
                          <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>{pAway.position}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            <View style={{ height: 60 }} />
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <LiquidBackground />

      {/* Dim backdrop when Switcher menu is open */}
      {showMenu && (
        <Pressable 
          style={[StyleSheet.absoluteFill, { zIndex: 99, backgroundColor: 'rgba(0,0,0,0.3)' }]} 
          onPress={() => setShowMenu(false)} 
        />
      )}
      
      {/* Header Container */}
      <View style={[styles.rootHeader, { zIndex: 100 }]}>
        {/* Apple Sports Premium Navigation Bar */}
        <View style={styles.appleSportsHeaderRow}>
          {/* Logo Sports */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.appleLogo, { color: colors.text }]}></Text>
            <Text style={[styles.sportsLogoText, { color: colors.text }]}>Sports</Text>
          </View>

          {/* User Profile Avatar with Switcher Menu */}
          <Pressable 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              setShowMenu(!showMenu);
            }}
            style={styles.avatarButton}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }} 
              style={styles.avatarImage} 
            />
          </Pressable>
        </View>

        {/* Switcher floating menu */}
        {showMenu && (
          <View style={[styles.switcherMenuCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <BlurView tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} intensity={90} style={StyleSheet.absoluteFill} />
            
            <View style={{ paddingVertical: 4 }}>
              <Text style={[styles.menuSectionHeader, { fontSize: 10, letterSpacing: 1, color: colors.textSecondary }]}>
                {isZh ? '选择赛事' : 'SELECT SPORT'}
              </Text>
              
              <Pressable 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setCurrentSport('world_cup');
                  setShowMenu(false);
                }}
                style={[styles.menuItem, currentSport === 'world_cup' && styles.menuItemActive, { marginTop: 6 }]}
              >
                <FontAwesome name="trophy" size={14} color={currentSport === 'world_cup' ? colors.accent : colors.textSecondary} style={{ width: 20 }} />
                <Text style={[styles.menuItemText, { color: currentSport === 'world_cup' ? colors.accent : colors.text, fontWeight: currentSport === 'world_cup' ? '700' : 'normal' }]}>
                  {isZh ? '2026 FIFA 世界杯' : '2026 FIFA World Cup'}
                </Text>
                {currentSport === 'world_cup' && <FontAwesome name="check" size={12} color={colors.accent} />}
              </Pressable>

              <Pressable 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setCurrentSport('nba');
                  setShowMenu(false);
                }}
                style={[styles.menuItem, currentSport === 'nba' && styles.menuItemActive]}
              >
                <FontAwesome name="dribbble" size={14} color={currentSport === 'nba' ? colors.accent : colors.textSecondary} style={{ width: 20 }} />
                <Text style={[styles.menuItemText, { color: currentSport === 'nba' ? colors.accent : colors.text, fontWeight: currentSport === 'nba' ? '700' : 'normal' }]}>
                  {isZh ? 'NBA' : 'NBA'}
                </Text>
                {currentSport === 'nba' && <FontAwesome name="check" size={12} color={colors.accent} />}
              </Pressable>

              <Pressable 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setCurrentSport('csgo');
                  setShowMenu(false);
                }}
                style={[styles.menuItem, currentSport === 'csgo' && styles.menuItemActive]}
              >
                <FontAwesome name="gamepad" size={14} color={currentSport === 'csgo' ? colors.accent : colors.textSecondary} style={{ width: 20 }} />
                <Text style={[styles.menuItemText, { color: currentSport === 'csgo' ? colors.accent : colors.text, fontWeight: currentSport === 'csgo' ? '700' : 'normal' }]}>
                  {isZh ? 'CS:GO 赛程' : 'CS:GO Schedule'}
                </Text>
                {currentSport === 'csgo' && <FontAwesome name="check" size={12} color={colors.accent} />}
              </Pressable>
            </View>
          </View>
        )}

        {/* Current Sport Sub-Header containing Title & Quick Action buttons */}
        <View style={styles.headerTitleRow}>
          {currentSport === 'world_cup' && (
            <>
              <Text style={[styles.title, { color: colors.text }]}>{isZh ? '2026 FIFA 世界杯' : '2026 FIFA World Cup'}</Text>
              <FontAwesome name="trophy" size={22} color={colors.gold || '#FFE066'} style={{ marginLeft: 8 }} />
              
              <Pressable 
                onPress={() => setShowStandingsModal(true)}
                style={[styles.floatingStandingsBtn, { backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' }]}
              >
                <FontAwesome name="list-ol" size={12} color={colors.text} />
                <Text style={[styles.floatingStandingsBtnText, { color: colors.text }]}>
                  {isZh ? ' 积分榜' : ' Standings'}
                </Text>
              </Pressable>
            </>
          )}

          {currentSport === 'csgo' && (
            <>
              <Text style={[styles.title, { color: colors.text }]}>{isZh ? 'CS:GO 赛程' : 'CS:GO Schedule'}</Text>
              <FontAwesome name="gamepad" size={22} color="#00C4FF" style={{ marginLeft: 8 }} />
            </>
          )}

          {currentSport === 'nba' && (
            <>
              <Text style={[styles.title, { color: colors.text }]}>{isZh ? 'NBA 赛程' : 'NBA Schedule'}</Text>
              <FontAwesome name="dribbble" size={22} color="#FF8200" style={{ marginLeft: 8 }} />
            </>
          )}

          {/* Quick Refresh button */}
          <Pressable 
            onPress={onRefresh}
            style={[styles.floatingStandingsBtn, { marginLeft: 'auto', backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' }]}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={colors.text} style={{ transform: [{ scale: 0.7 }] }} />
            ) : (
              <FontAwesome name="refresh" size={11} color={colors.text} />
            )}
            <Text style={[styles.floatingStandingsBtnText, { color: colors.text }]}>
              {isZh ? ' 刷新' : ' Refresh'}
            </Text>
          </Pressable>
        </View>

        {/* Conditional Stage selection bar */}
        {currentSport === 'world_cup' && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.stageTabBar}
            contentContainerStyle={styles.stageTabContent}
          >
            {STAGES.map((stage) => {
              const isActive = selectedStage === stage.key;
              return (
                <Pressable
                  key={stage.key}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    setSelectedStage(stage.key);
                  }}
                  style={[
                    styles.stageTabItem,
                    isActive ? { backgroundColor: colors.accent } : { backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.15)' }
                  ]}
                >
                  <Text
                    style={[
                      styles.stageTabText,
                      { color: isActive ? '#FFFFFF' : colors.textSecondary }
                    ]}
                  >
                    {isZh ? stage.labelZh : stage.labelEn}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {currentSport === 'csgo' && (
          <View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.stageTabBar}
              contentContainerStyle={styles.stageTabContent}
            >
              {(() => {
                const tourneyScores: Record<string, number> = {};
                csgoMatches.forEach(m => {
                  if (m.status === 'IN_PLAY') tourneyScores[m.tournamentName] = 10000000000000;
                  else {
                    const time = new Date(m.utcDate).getTime();
                    if (!tourneyScores[m.tournamentName] || time > tourneyScores[m.tournamentName]) {
                      tourneyScores[m.tournamentName] = time;
                    }
                  }
                });
                const sortedTourneys = Array.from(new Set(csgoMatches.map(m => m.tournamentName))).sort((a, b) => (tourneyScores[b] || 0) - (tourneyScores[a] || 0));
                
                return sortedTourneys.map((tourney) => {
                  const isActive = csgoSelectedTournament === tourney;
                  return (
                  <Pressable
                    key={tourney}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                      setCsgoSelectedTournament(tourney);
                      // Auto-select substage
                      const matchesInTourney = csgoMatches.filter(m => m.tournamentName === tourney);
                      const stagesInTourney = Array.from(new Set(matchesInTourney.map(m => m.stage)));
                      const liveSubMatch = matchesInTourney.find(m => m.status === 'IN_PLAY');
                      if (liveSubMatch) setCsgoSelectedSubStage(liveSubMatch.stage);
                      else setCsgoSelectedSubStage(stagesInTourney[stagesInTourney.length - 1] || '');
                    }}
                    style={[
                      styles.stageTabItem,
                      isActive ? { backgroundColor: colors.accent } : { backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.15)' }
                    ]}
                  >
                    <Text
                      style={[
                        styles.stageTabText,
                        { color: isActive ? '#FFFFFF' : colors.textSecondary }
                      ]}
                    >
                      {tourney}
                    </Text>
                  </Pressable>
                );
              });
              })()}
            </ScrollView>

            {csgoSelectedTournament && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={[styles.stageTabBar, { marginTop: 0, marginBottom: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 }]}
                contentContainerStyle={styles.stageTabContent}
              >
                {Array.from(new Set(csgoMatches.filter(m => m.tournamentName === csgoSelectedTournament).map(m => m.stage))).map((stage) => {
                  const isActive = csgoSelectedSubStage === stage;
                  const stageMatches = csgoMatches.filter(m => m.tournamentName === csgoSelectedTournament && m.stage === stage);
                  const isStageLive = stageMatches.some(m => m.status === 'IN_PLAY');
                  const isStageFinished = stageMatches.length > 0 && stageMatches.every(m => m.status === 'FINISHED');

                  return (
                    <Pressable
                      key={stage}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                        setCsgoSelectedSubStage(stage);
                      }}
                      style={[
                        styles.stageTabItem,
                        isActive ? { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: colors.accent, borderWidth: 1 } : { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'transparent' },
                        { paddingHorizontal: 12, paddingVertical: 6, minHeight: 0 }
                      ]}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {isStageLive && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30', marginRight: 6 }} />}
                        <Text
                          style={[
                            styles.stageTabText,
                            { color: isActive ? colors.text : colors.textSecondary, fontSize: 13 }
                          ]}
                        >
                          {stage} {isStageFinished ? (isZh ? '(已结束)' : '(Finished)') : ''}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )}

        {/* Sub-selector for Group stage (Standings vs Matches) */}
        {currentSport === 'world_cup' && selectedStage === 'GROUP_STAGE' && (
          <View style={styles.subToggleContainer}>
            <Pressable
              onPress={() => setGroupSubTab('standings')}
              style={[
                styles.subToggleItem,
                groupSubTab === 'standings' ? { backgroundColor: colors.text } : { backgroundColor: 'transparent' }
              ]}
            >
              <Text style={[
                styles.subToggleText,
                { color: groupSubTab === 'standings' ? colors.background : colors.textSecondary }
              ]}>
                {isZh ? '积分榜' : 'Standings'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setGroupSubTab('matches')}
              style={[
                styles.subToggleItem,
                groupSubTab === 'matches' ? { backgroundColor: colors.text } : { backgroundColor: 'transparent' }
              ]}
            >
              <Text style={[
                styles.subToggleText,
                { color: groupSubTab === 'matches' ? colors.background : colors.textSecondary }
              ]}>
                {isZh ? '小组赛程' : 'Matches'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Main Content Area */}
      {currentSport === 'world_cup' && (
        loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {selectedStage === 'GROUP_STAGE' 
              ? (groupSubTab === 'standings' ? renderStandings() : renderGroupMatches()) 
              : renderKnockouts()
            }
          </View>
        )
      )}

      {currentSport === 'csgo' && renderCsgoSchedule()}

      {currentSport === 'nba' && renderNbaSchedule()}

      {/* Standings Modal Overlay (Always accessible to review standings "与时俱进") */}
      <Modal
        visible={showStandingsModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowStandingsModal(false)}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0A0E17' }]}>
          <BlurView tint="dark" intensity={90} style={StyleSheet.absoluteFill} />
          
          <View style={[styles.modalHeader, { paddingTop: Platform.OS === 'ios' ? 64 : 54 }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {isZh ? '世界杯完整积分榜' : 'World Cup Standings'}
            </Text>
            <Pressable 
              onPress={() => setShowStandingsModal(false)}
              style={[styles.modalCloseBtn, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
            >
              <FontAwesome name="close" size={16} color={colors.text} />
            </Pressable>
          </View>
          
          {renderStandings(true)}
        </View>
      </Modal>

      {/* Match Details Overlay Screen (With PK layout & fluid gradients) */}
      {selectedDetailMatch && renderMatchDetailModal()}
      {selectedCsgoDetailMatch && renderCsgoDetailModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  appleSportsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 12,
  },
  appleLogo: {
    fontSize: 28,
    fontWeight: '900',
    marginRight: 2,
  },
  sportsLogoText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FFFFFF20',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  switcherMenuCard: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 104 : 94,
    right: 16,
    width: 260,
    borderRadius: 16,
    padding: 16,
    zIndex: 999,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 12,
  },
  menuSection: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  menuItemText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  menuSectionHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 4,
    paddingLeft: 6,
  },
  rootHeader: {
    paddingTop: Platform.OS === 'ios' ? 64 : 54,
    paddingBottom: 8,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...Typography.header,
    fontSize: 22,
    fontWeight: '800',
  },
  floatingStandingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  floatingStandingsBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stageTabBar: {
    marginVertical: 4,
  },
  stageTabContent: {
    paddingRight: 16,
  },
  stageTabItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  stageTabText: {
    ...Typography.caption,
    fontWeight: '700',
  },
  subToggleContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 12,
    padding: 2,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  subToggleItem: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  subToggleText: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupTitle: {
    ...Typography.teamName,
    fontSize: 16,
    fontWeight: '700',
  },
  statsHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statHeaderCol: {
    width: 22,
    textAlign: 'center',
    fontSize: 11,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 12,
  },
  tableBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  teamInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankNumber: {
    fontSize: 13,
    fontWeight: '600',
    width: 16,
    textAlign: 'center',
  },
  flagIcon: {
    borderRadius: 2,
    marginHorizontal: 10,
  },
  flagPlaceholder: {
    width: 14,
    height: 10,
    borderRadius: 2,
    marginHorizontal: 10,
  },
  teamNameText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  statBodyCol: {
    width: 22,
    textAlign: 'center',
    fontSize: 13,
    marginLeft: 6,
  },
  dateSection: {
    marginBottom: 20,
  },
  dateSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    paddingLeft: 4,
  },
  matchCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  matchSubHeader: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 10,
    textAlign: 'center',
  },
  matchMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamColumn: {
    flex: 2.5,
  },
  teamRowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamFlag: {
    borderRadius: 2,
  },
  teamNameInline: {
    fontSize: 13,
    fontWeight: '600',
    maxWidth: 90,
  },
  recordText: {
    fontSize: 10,
    marginTop: 4,
  },
  timeCenterBox: {
    flex: 2,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  oddsTagText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  bracketWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  bracketMatchCard: {
    width: '85%',
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  bracketDateText: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 12,
  },
  bracketTeamsContainer: {
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    paddingLeft: 10,
  },
  bracketTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  placeholderBadgeText: {
    fontSize: 10,
  },
  bracketTeamName: {
    fontSize: 14,
    fontWeight: '700',
  },
  bracketOddsRow: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  connectorContainer: {
    width: '15%',
    height: '100%',
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalLine: {
    width: 15,
    height: 1.5,
  },
  verticalLine: {
    width: 1.5,
    position: 'absolute',
    left: 15,
  },
  forkBranch: {
    width: 15,
    height: 1.5,
    position: 'absolute',
    left: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pkBackgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -10,
    overflow: 'hidden',
    backgroundColor: '#071A0E',
  },
  pkBlobLeft: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.15,
    height: SCREEN_WIDTH * 1.15,
    borderRadius: (SCREEN_WIDTH * 1.15) / 2,
    top: -SCREEN_HEIGHT * 0.1,
    left: -SCREEN_WIDTH * 0.35,
    opacity: 0.45,
  },
  pkBlobRight: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.15,
    height: SCREEN_WIDTH * 1.15,
    borderRadius: (SCREEN_WIDTH * 1.15) / 2,
    bottom: SCREEN_HEIGHT * 0.1,
    right: -SCREEN_WIDTH * 0.35,
    opacity: 0.45,
  },
  pkHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  pkIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pkScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 64,
  },
  pkStageTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 20,
  },
  pkMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  pkTeamCol: {
    flex: 3,
    alignItems: 'center',
  },
  largeFlagWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  largeFlag: {
    width: 102,
    height: 76,
  },
  largeFlagPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pkTeamName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  },
  pkTeamRecord: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
  },
  pkTimeCol: {
    flex: 2,
    alignItems: 'center',
  },
  pkTimeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  pkActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  pkRoundActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pkPillActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: 12,
  },
  pkPillActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pkBroadcastText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 24,
  },
  pkGlassCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  pkCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  pkOddsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  pkOddsCol: {
    flex: 1,
    alignItems: 'center',
  },
  pkOddsValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pkCardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  pkOddsFooter: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    fontWeight: '600',
  },
  pkStandingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pkStandingsColTeam: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    flex: 1.2,
  },
  pkStandingsHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pkStandingsColStat: {
    width: 22,
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    marginLeft: 6,
    fontWeight: '700',
  },
  pkStandingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
  },
  pkStandingsTeamLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.2,
  },
  pkStandingsRank: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    width: 14,
    textAlign: 'center',
  },
  pkStandingsFlag: {
    borderRadius: 2,
    marginHorizontal: 8,
  },
  pkStandingsFlagPlaceholder: {
    width: 14,
    height: 10,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 8,
  },
  pkStandingsTeamName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  pkStandingsStatVal: {
    width: 22,
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 6,
  },
});
