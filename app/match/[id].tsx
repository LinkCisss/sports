import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { fetchEventOdds, MatchOdds, Bookmaker } from '@/lib/oddsApi';
import { useTranslation } from 'react-i18next';
import { translateTeam, translateLeague } from '@/utils/translate';
import { formatMatchTime } from '@/utils/date';
import { getTeamFlagCode } from '@/utils/flags';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CountryFlag from 'react-native-country-flag';
import * as WebBrowser from 'expo-web-browser';
import { useColorScheme } from '@/components/useColorScheme';
import { LiquidBackground } from '@/components/LiquidBackground';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, useAnimatedScrollHandler } from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AFFILIATE_LINK = "https://reffpa.com/L?tag=d_5622403m_97c_&site=5622403&ad=97";

import { getTeamColors } from '@/utils/teamColors';

export default function MatchDetailScreen() {
  const { id, sportKey } = useLocalSearchParams<{ id: string; sportKey: string }>();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const insets = useSafeAreaInsets();

  const [matchData, setMatchData] = useState<MatchOdds | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    pkScale1.value = withRepeat(withTiming(1.35, { duration: 6500 }), -1, true);
    pkTx1.value = withRepeat(withTiming(SCREEN_WIDTH * 0.18, { duration: 8000 }), -1, true);
    pkTy1.value = withRepeat(withTiming(SCREEN_HEIGHT * 0.08, { duration: 9000 }), -1, true);

    pkScale2.value = withRepeat(withTiming(1.28, { duration: 6000 }), -1, true);
    pkTx2.value = withRepeat(withTiming(-SCREEN_WIDTH * 0.18, { duration: 7500 }), -1, true);
    pkTy2.value = withRepeat(withTiming(-SCREEN_HEIGHT * 0.08, { duration: 8500 }), -1, true);
  }, []);

  const lastScrollY = useSharedValue(0);
  const buttonTranslateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      const diff = currentY - lastScrollY.value;
      
      if (currentY <= 10) {
        buttonTranslateY.value = withTiming(0, { duration: 180 });
      } else if (diff > 8) {
        buttonTranslateY.value = withTiming(150, { duration: 220 });
      } else if (diff < -8) {
        buttonTranslateY.value = withTiming(0, { duration: 220 });
      }
      
      lastScrollY.value = currentY;
    },
  });

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const displayTeam = (name: string) => isZh ? translateTeam(name) : name;

  const handleBetNow = async () => {
    await WebBrowser.openBrowserAsync(AFFILIATE_LINK);
  };

  useEffect(() => {
    const loadMatch = async () => {
      if (id && sportKey) {
        setLoading(true);
        const data = await fetchEventOdds(sportKey, id);
        setMatchData(data);
        setLoading(false);
      }
    };
    loadMatch();
  }, [id, sportKey]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Loading...', headerTransparent: true }} />
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!matchData) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={{ color: colors.textSecondary }}>Failed to load match data.</Text>
      </View>
    );
  }

  const renderMarket = (bookmaker: Bookmaker, marketKey: string, title: string) => {
    const market = bookmaker.markets.find(m => m.key === marketKey);
    if (!market || !market.outcomes || market.outcomes.length === 0) return null;

    return (
      <View style={styles.marketContainer}>
        <Text style={[styles.marketTitle, { color: colors.textSecondary }]}>{title}</Text>
        <View style={styles.outcomesRow}>
          {market.outcomes.map((outcome, idx) => {
            let nameDisplay = displayTeam(outcome.name);
            // Translate Over/Under specifically if needed
            if (isZh) {
              if (nameDisplay.toLowerCase() === 'over') nameDisplay = '大';
              if (nameDisplay.toLowerCase() === 'under') nameDisplay = '小';
            }

            return (
              <View key={idx} style={[styles.outcomeBox, { backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.15)', borderWidth: 1, borderColor: colors.border }]}>
                <Text style={[styles.outcomeName, { color: colors.textSecondary }]} numberOfLines={1}>
                  {nameDisplay}
                  {outcome.point !== undefined ? ` (${outcome.point > 0 ? '+' : ''}${outcome.point})` : ''}
                </Text>
                <Text style={[styles.outcomePrice, { color: colors.text }]}>
                  {outcome.price.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const homeColors = getTeamColors(matchData?.home_team || '');
  const awayColors = getTeamColors(matchData?.away_team || '');
  const leftBlobColor = homeColors[0];
  const rightBlobColor = awayColors[0];
  const pkBgColor = theme === 'dark' ? '#050D1A' : '#F4F7FB';
  const safeTop = insets.top > 0 ? insets.top : 28;

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Dynamic Fluid PK Background */}
      <View style={[styles.pkBackgroundContainer, { backgroundColor: pkBgColor }]}>
        <Animated.View style={[
          styles.pkBlobLeft, 
          { backgroundColor: leftBlobColor, opacity: theme === 'dark' ? 0.45 : 0.28 },
          pkAnimatedBlob1
        ]} />
        <Animated.View style={[
          styles.pkBlobRight, 
          { backgroundColor: rightBlobColor, opacity: theme === 'dark' ? 0.45 : 0.28 },
          pkAnimatedBlob2
        ]} />
        <BlurView tint={theme === 'light' ? 'light' : 'dark'} intensity={theme === 'light' ? 70 : 65} style={StyleSheet.absoluteFill} />
      </View>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Compact Glass Top Title Bar */}
      <View style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: safeTop + (Platform.OS === 'android' ? 6 : 4), 
        paddingBottom: 6, 
        zIndex: 15,
        overflow: 'hidden',
        borderBottomWidth: 1,
        borderBottomColor: colors.border
      }}>
        <BlurView 
          tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} 
          intensity={85} 
          style={StyleSheet.absoluteFill} 
        />
        <View style={styles.headerTopRow}>
          <Pressable 
            onPress={() => router.back()} 
            style={[styles.backButton, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
          >
            <FontAwesome name="chevron-left" size={16} color={colors.text} style={{ marginLeft: -2 }} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 16, fontWeight: '700' }]}>
            {isZh ? '比赛详情' : 'Match Details'}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Floating Team Capsule (Below title row, no blur, distinct background) */}
      <View style={{ 
        position: 'absolute',
        top: safeTop + 52 + 10, 
        left: 0,
        right: 0,
        zIndex: 10,
      }}>
        <View style={styles.capsuleContainer}>
          <View style={[
            styles.capsule, 
            { 
              backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
              overflow: 'hidden', 
              borderWidth: 1, 
              borderColor: colors.border 
            }, 
            theme === 'dark' ? styles.shadowDark : styles.shadowLight
          ]}>
            <View style={styles.horizontalTeams}>
              <View style={[styles.teamInline, { justifyContent: 'flex-end' }]}>
                <Text style={[styles.smallTeamName, { color: colors.text, textAlign: 'right' }]} numberOfLines={1}>
                  {displayTeam(matchData.home_team)}
                </Text>
                {getTeamFlagCode(matchData.home_team) && (
                  <CountryFlag isoCode={getTeamFlagCode(matchData.home_team)!} size={16} style={{ borderRadius: 2 }} />
                )}
              </View>
              <Text style={[styles.vs, { color: colors.accent }]}>vs</Text>
              <View style={[styles.teamInline, { justifyContent: 'flex-start' }]}>
                {getTeamFlagCode(matchData.away_team) && (
                  <CountryFlag isoCode={getTeamFlagCode(matchData.away_team)!} size={16} style={{ borderRadius: 2 }} />
                )}
                <Text style={[styles.smallTeamName, { color: colors.text, textAlign: 'left' }]} numberOfLines={1}>
                  {displayTeam(matchData.away_team)}
                </Text>
              </View>
            </View>
            <Text style={[styles.time, { color: colors.textSecondary, marginTop: 4 }]}>
              {formatMatchTime(matchData.commence_time, isZh)}
            </Text>
          </View>
        </View>
      </View>

      <Animated.ScrollView 
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.scrollContent, { paddingTop: safeTop + 160 }]}
      >

        {/* Bookmakers List */}
        {matchData.bookmakers.length === 0 ? (
          <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 40 }}>
            No odds data available for this match yet.
          </Text>
        ) : (
          matchData.bookmakers.map(bookmaker => (
            <View key={bookmaker.key} style={[
              styles.bookmakerCard, 
              { backgroundColor: colors.cardBackground, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }
            ]}>
              <BlurView tint={theme === 'light' ? 'systemMaterialLight' : 'systemMaterialDark'} intensity={40} style={StyleSheet.absoluteFill} />
              <Text style={[styles.bookmakerTitle, { color: colors.text }]}>{bookmaker.title}</Text>
              
              {renderMarket(bookmaker, 'h2h', isZh ? '胜平负 (Moneyline)' : 'Moneyline (H2H)')}
              {renderMarket(bookmaker, 'spreads', isZh ? '让分 (Spreads)' : 'Spreads')}
              {renderMarket(bookmaker, 'totals', isZh ? '大小球 (Totals)' : 'Totals')}
              
            </View>
          ))
        )}

      </Animated.ScrollView>

      {/* Floating Action Button (Affiliate) */}
      <Animated.View style={[
        styles.fabContainer, 
        animatedButtonStyle,
        { 
          backgroundColor: 'transparent', 
        }
      ]}>
        <Pressable 
          style={({ pressed }) => [
            styles.fabButton, 
            { backgroundColor: colors.accent, transform: [{ scale: pressed ? 0.98 : 1 }] },
            theme === 'light' ? styles.shadowLight : styles.shadowDark
          ]}
          onPress={handleBetNow}
        >
          <Text style={styles.fabText}>{isZh ? '去 1xBet 投注' : 'Bet at 1xBet'}</Text>
          <FontAwesome name="external-link" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  headerTopRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.header,
  },
  capsuleContainer: {
    paddingHorizontal: 20, // More side margin (not touching edges)
    paddingTop: 8,
    paddingBottom: 8,
  },
  capsule: {
    borderRadius: 100, // Pill shape
    paddingVertical: 18, // Make it taller
    paddingHorizontal: 24, // Wider internal padding
    alignItems: 'center',
    width: '100%',
  },
  horizontalTeams: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  teamInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  smallTeamName: {
    ...Typography.body,
    fontWeight: '700',
    flexShrink: 1,
  },
  time: {
    ...Typography.caption,
    fontWeight: '600',
  },
  vs: {
    ...Typography.caption,
    fontWeight: '700',
  },
  bookmakerCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bookmakerTitle: {
    ...Typography.body,
    fontWeight: '700',
    marginBottom: 12,
  },
  marketContainer: {
    marginBottom: 16,
  },
  marketTitle: {
    ...Typography.caption,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  outcomesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  outcomeBox: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  outcomeName: {
    ...Typography.caption,
    marginBottom: 4,
  },
  outcomePrice: {
    ...Typography.body,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 100,
    width: '64%',
  },
  fabText: {
    ...Typography.body,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  shadowLight: {
    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  shadowDark: {
    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  pkBackgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -10,
    overflow: 'hidden',
  },
  pkBlobLeft: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.85,
    borderRadius: (SCREEN_WIDTH * 0.85) / 2,
    top: SCREEN_HEIGHT * 0.08,
    left: -SCREEN_WIDTH * 0.2,
  },
  pkBlobRight: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.85,
    borderRadius: (SCREEN_WIDTH * 0.85) / 2,
    bottom: SCREEN_HEIGHT * 0.2,
    right: -SCREEN_WIDTH * 0.2,
  },
});
