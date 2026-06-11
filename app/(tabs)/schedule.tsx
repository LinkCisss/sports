import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, ActivityIndicator, Pressable, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/components/useColorScheme';
import { LiquidBackground } from '@/components/LiquidBackground';
import { BlurView } from 'expo-blur';
import CountryFlag from 'react-native-country-flag';
import { getTeamFlagCode } from '@/utils/flags';
import { translateTeam } from '@/utils/translate';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { fetchWorldCupStandings, fetchWorldCupMatches, FootballDataMatch, GroupStanding } from '@/lib/footballDataApi';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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

export default function ScheduleScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const [selectedStage, setSelectedStage] = useState('GROUP_STAGE');
  const [groupSubTab, setGroupSubTab] = useState<'standings' | 'matches'>('standings'); // Standings vs Match Schedule

  const [standings, setStandings] = useState<GroupStanding[]>([]);
  const [groupMatches, setGroupMatches] = useState<FootballDataMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const standingsRes = await fetchWorldCupStandings();
        const matchesRes = await fetchWorldCupMatches();
        
        if (standingsRes?.standings) {
          setStandings(standingsRes.standings);
        }
        if (matchesRes?.matches) {
          // Filter out group stage matches specifically
          const groupFixtures = matchesRes.matches.filter(m => m.stage === 'GROUP_STAGE');
          setGroupMatches(groupFixtures);
        }
      } catch (err) {
        console.error('Error loading schedule data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Format date and time
  const formatUtcDate = (utcDate: string) => {
    const d = dayjs(utcDate);
    if (isZh) {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return `${d.month() + 1}月${d.date()}日 ${weekdays[d.day()]}`;
    }
    return d.format('ddd, MMM DD');
  };

  const formatUtcTime = (utcDate: string) => {
    const d = dayjs(utcDate);
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

  // Group names formatting
  const getGroupName = (groupKey: string) => {
    const letter = groupKey.replace('GROUP_', '');
    return isZh ? `${letter}组` : `Group ${letter}`;
  };

  // Render Standings
  const renderStandings = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {standings.map((group) => (
        <View key={group.group} style={[styles.glassCard, { borderColor: colors.border }]}>
          <BlurView tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} intensity={40} style={StyleSheet.absoluteFill} />
          
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
  const renderGroupMatches = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {groupedFixtures.map((groupDay) => (
        <View key={groupDay.date} style={styles.dateSection}>
          <Text style={[styles.dateSectionTitle, { color: colors.text }]}>{groupDay.date}</Text>
          
          {groupDay.data.map((match) => {
            const homeFlag = getTeamFlagCode(match.homeTeam.name);
            const awayFlag = getTeamFlagCode(match.awayTeam.name);
            
            return (
              <View key={match.id} style={[styles.matchCard, { borderColor: colors.border }]}>
                <BlurView tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} intensity={40} style={StyleSheet.absoluteFill} />
                
                {/* Match sub-header */}
                <Text style={[styles.matchSubHeader, { color: colors.textSecondary }]}>
                  {isZh ? '小组赛 · 第1场' : 'Group Stage · Match 1'}
                </Text>
                
                {/* Match row */}
                <View style={styles.matchMainRow}>
                  {/* Home Team */}
                  <View style={[styles.teamColumn, { alignItems: 'flex-end' }]}>
                    <View style={styles.teamRowAlign}>
                      <Text style={[styles.teamNameInline, { color: colors.text, marginRight: 8 }]} numberOfLines={1}>
                        {isZh ? translateTeam(match.homeTeam.name) : match.homeTeam.name}
                      </Text>
                      {homeFlag ? (
                        <CountryFlag isoCode={homeFlag} size={16} style={styles.teamFlag} />
                      ) : (
                        <View style={[styles.flagPlaceholder, { backgroundColor: colors.border }]} />
                      )}
                    </View>
                    <Text style={[styles.recordText, { color: colors.textSecondary }]}>0-0-0</Text>
                  </View>

                  {/* Time / Score Center */}
                  <View style={styles.timeCenterBox}>
                    <Text style={[styles.timeText, { color: colors.text }]}>
                      {formatUtcTime(match.utcDate)}
                    </Text>
                    {match.odds_win_rate && (
                      <Text style={[styles.oddsTagText, { color: colors.accent }]}>
                        {match.odds_win_rate}
                      </Text>
                    )}
                  </View>

                  {/* Away Team */}
                  <View style={[styles.teamColumn, { alignItems: 'flex-start' }]}>
                    <View style={styles.teamRowAlign}>
                      {awayFlag ? (
                        <CountryFlag isoCode={awayFlag} size={16} style={styles.teamFlag} />
                      ) : (
                        <View style={[styles.flagPlaceholder, { backgroundColor: colors.border }]} />
                      )}
                      <Text style={[styles.teamNameInline, { color: colors.text, marginLeft: 8 }]} numberOfLines={1}>
                        {isZh ? translateTeam(match.awayTeam.name) : match.awayTeam.name}
                      </Text>
                    </View>
                    <Text style={[styles.recordText, { color: colors.textSecondary }]}>0-0-0</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ))}
      <View style={{ height: 120 }} />
    </ScrollView>
  );

  // Render Knockout Bracket Match list
  const renderKnockouts = () => {
    const list = KNOCKOUT_MATCHES_BY_STAGE[selectedStage] || [];
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {list.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <View key={item.id} style={styles.bracketWrapper}>
              <View style={[styles.bracketMatchCard, { borderColor: colors.border }]}>
                <BlurView tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} intensity={40} style={StyleSheet.absoluteFill} />
                
                {/* Date header */}
                <Text style={[styles.bracketDateText, { color: colors.textSecondary }]}>
                  {formatUtcDate(item.date)} · {formatUtcTime(item.date)}
                </Text>
                
                {/* Team Rows */}
                <View style={styles.bracketTeamsContainer}>
                  {/* Home Placeholder / Team */}
                  <View style={styles.bracketTeamRow}>
                    <View style={[styles.placeholderBadge, { backgroundColor: colors.border }]}>
                      <Text style={[styles.placeholderBadgeText, { color: colors.textSecondary }]}>
                        {item.home.startsWith('W') || item.home.match(/^\d/) ? '' : '🏳️'}
                      </Text>
                    </View>
                    <Text style={[styles.bracketTeamName, { color: colors.text }]}>
                      {item.home}
                    </Text>
                  </View>

                  {/* Away Placeholder / Team */}
                  <View style={[styles.bracketTeamRow, { marginTop: 12 }]}>
                    <View style={[styles.placeholderBadge, { backgroundColor: colors.border }]}>
                      <Text style={[styles.placeholderBadgeText, { color: colors.textSecondary }]}>
                        {item.away.startsWith('W') || item.away.match(/^\d/) ? '' : '🏳️'}
                      </Text>
                    </View>
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
              </View>

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

  return (
    <View style={{ flex: 1 }}>
      <LiquidBackground />
      
      {/* Header Container */}
      <View style={styles.rootHeader}>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.title, { color: colors.text }]}>2026 FIFA 世界杯</Text>
          <FontAwesome name="trophy" size={22} color={colors.gold || '#FFE066'} style={{ marginLeft: 8 }} />
        </View>

        {/* Stage selection bar */}
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
                onPress={() => setSelectedStage(stage.key)}
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

        {/* Sub-selector for Group stage (Standings vs Matches) */}
        {selectedStage === 'GROUP_STAGE' && (
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
      {loading ? (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
