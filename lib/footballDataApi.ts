import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_TOKEN = '88a9c7a0f16248d19093dac45d7ecf39';
const BASE_URL = 'https://api.football-data.org/v4';

// Cache expiry: 5 minutes to protect user rate limits
const CACHE_DURATION_MS = 5 * 60 * 1000;

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface StandingTableEntry {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface GroupStanding {
  stage: string;
  type: string;
  group: string;
  table: StandingTableEntry[];
}

export interface FootballDataStandingsResponse {
  standings: GroupStanding[];
}

export interface MatchTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface MatchScoreValue {
  home: number | null;
  away: number | null;
}

export interface MatchScore {
  winner: string | null;
  duration: string;
  fullTime: MatchScoreValue;
  halfTime: MatchScoreValue;
}

export interface FootballDataMatch {
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  score: MatchScore;
  odds_win_rate?: string; // Optional custom odds tag matching user screenshots
}

export interface FootballDataMatchesResponse {
  matches: FootballDataMatch[];
}

// ==========================================
// HIGH-FIDELITY MOCK DATA FALLBACKS (WORLD CUP 2026)
// ==========================================

const MOCK_STANDINGS: GroupStanding[] = [
  {
    stage: 'GROUP_STAGE',
    type: 'TOTAL',
    group: 'GROUP_A',
    table: [
      { position: 1, team: { id: 1001, name: 'Mexico', shortName: 'Mexico', tla: 'MEX', crest: 'MX' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 2, team: { id: 1002, name: 'South Africa', shortName: 'South Africa', tla: 'RSA', crest: 'ZA' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 3, team: { id: 1003, name: 'South Korea', shortName: 'South Korea', tla: 'KOR', crest: 'KR' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 4, team: { id: 1004, name: 'Czech Republic', shortName: 'Czech Rep', tla: 'CZE', crest: 'CZ' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
    ]
  },
  {
    stage: 'GROUP_STAGE',
    type: 'TOTAL',
    group: 'GROUP_B',
    table: [
      { position: 1, team: { id: 1005, name: 'Canada', shortName: 'Canada', tla: 'CAN', crest: 'CA' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 2, team: { id: 1006, name: 'Bosnia and Herzegovina', shortName: 'Bosnia', tla: 'BIH', crest: 'BA' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 3, team: { id: 1007, name: 'Qatar', shortName: 'Qatar', tla: 'QAT', crest: 'QA' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 4, team: { id: 1008, name: 'Switzerland', shortName: 'Switzerland', tla: 'SUI', crest: 'CH' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
    ]
  },
  {
    stage: 'GROUP_STAGE',
    type: 'TOTAL',
    group: 'GROUP_C',
    table: [
      { position: 1, team: { id: 1009, name: 'Brazil', shortName: 'Brazil', tla: 'BRA', crest: 'BR' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 2, team: { id: 1010, name: 'Morocco', shortName: 'Morocco', tla: 'MAR', crest: 'MA' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 3, team: { id: 1011, name: 'Haiti', shortName: 'Haiti', tla: 'HAI', crest: 'HT' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 4, team: { id: 1012, name: 'Scotland', shortName: 'Scotland', tla: 'SCO', crest: 'GB-SCT' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
    ]
  },
  {
    stage: 'GROUP_STAGE',
    type: 'TOTAL',
    group: 'GROUP_D',
    table: [
      { position: 1, team: { id: 1013, name: 'United States', shortName: 'USA', tla: 'USA', crest: 'US' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 2, team: { id: 1014, name: 'Paraguay', shortName: 'Paraguay', tla: 'PAR', crest: 'PY' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 3, team: { id: 1015, name: 'Australia', shortName: 'Australia', tla: 'AUS', crest: 'AU' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 4, team: { id: 1016, name: 'Turkey', shortName: 'Turkey', tla: 'TUR', crest: 'TR' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
    ]
  },
  {
    stage: 'GROUP_STAGE',
    type: 'TOTAL',
    group: 'GROUP_E',
    table: [
      { position: 1, team: { id: 1017, name: 'Argentina', shortName: 'Argentina', tla: 'ARG', crest: 'AR' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 2, team: { id: 1018, name: 'Poland', shortName: 'Poland', tla: 'POL', crest: 'PL' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 3, team: { id: 1019, name: 'Egypt', shortName: 'Egypt', tla: 'EGY', crest: 'EG' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 4, team: { id: 1020, name: 'New Zealand', shortName: 'New Zealand', tla: 'NZL', crest: 'NZ' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
    ]
  },
  {
    stage: 'GROUP_STAGE',
    type: 'TOTAL',
    group: 'GROUP_F',
    table: [
      { position: 1, team: { id: 1021, name: 'France', shortName: 'France', tla: 'FRA', crest: 'FR' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 2, team: { id: 1022, name: 'Japan', shortName: 'Japan', tla: 'JPN', crest: 'JP' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 3, team: { id: 1023, name: 'Cameroon', shortName: 'Cameroon', tla: 'CMR', crest: 'CM' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
      { position: 4, team: { id: 1024, name: 'Jamaica', shortName: 'Jamaica', tla: 'JAM', crest: 'JM' }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
    ]
  }
];

const MOCK_MATCHES: FootballDataMatch[] = [
  // June 12
  {
    id: 200001,
    utcDate: '2026-06-12T03:00:00Z',
    status: 'TIMED',
    matchday: 1,
    stage: 'GROUP_STAGE',
    group: 'GROUP_A',
    lastUpdated: '2026-06-11T12:00:00Z',
    homeTeam: { id: 1001, name: 'Mexico', shortName: 'Mexico', tla: 'MEX', crest: 'MX' },
    awayTeam: { id: 1002, name: 'South Africa', shortName: 'South Africa', tla: 'RSA', crest: 'ZA' },
    score: { winner: null, duration: 'REGULAR', fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
    odds_win_rate: 'MEX 1.41'
  },
  {
    id: 200002,
    utcDate: '2026-06-12T10:00:00Z',
    status: 'TIMED',
    matchday: 1,
    stage: 'GROUP_STAGE',
    group: 'GROUP_A',
    lastUpdated: '2026-06-11T12:00:00Z',
    homeTeam: { id: 1003, name: 'South Korea', shortName: 'South Korea', tla: 'KOR', crest: 'KR' },
    awayTeam: { id: 1004, name: 'Czech Republic', shortName: 'Czech Rep', tla: 'CZE', crest: 'CZ' },
    score: { winner: null, duration: 'REGULAR', fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
    odds_win_rate: 'KOR 2.70'
  },
  // June 13
  {
    id: 200003,
    utcDate: '2026-06-13T03:00:00Z',
    status: 'TIMED',
    matchday: 1,
    stage: 'GROUP_STAGE',
    group: 'GROUP_B',
    lastUpdated: '2026-06-11T12:00:00Z',
    homeTeam: { id: 1005, name: 'Canada', shortName: 'Canada', tla: 'CAN', crest: 'CA' },
    awayTeam: { id: 1006, name: 'Bosnia and Herzegovina', shortName: 'Bosnia', tla: 'BIH', crest: 'BA' },
    score: { winner: null, duration: 'REGULAR', fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
    odds_win_rate: 'CAN 1.80'
  },
  {
    id: 200004,
    utcDate: '2026-06-13T09:00:00Z',
    status: 'TIMED',
    matchday: 1,
    stage: 'GROUP_STAGE',
    group: 'GROUP_D',
    lastUpdated: '2026-06-11T12:00:00Z',
    homeTeam: { id: 1013, name: 'United States', shortName: 'USA', tla: 'USA', crest: 'US' },
    awayTeam: { id: 1014, name: 'Paraguay', shortName: 'Paraguay', tla: 'PAR', crest: 'PY' },
    score: { winner: null, duration: 'REGULAR', fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
    odds_win_rate: 'USA 1.90'
  },
  // June 14
  {
    id: 200005,
    utcDate: '2026-06-14T03:00:00Z',
    status: 'TIMED',
    matchday: 1,
    stage: 'GROUP_STAGE',
    group: 'GROUP_B',
    lastUpdated: '2026-06-11T12:00:00Z',
    homeTeam: { id: 1007, name: 'Qatar', shortName: 'Qatar', tla: 'QAT', crest: 'QA' },
    awayTeam: { id: 1008, name: 'Switzerland', shortName: 'Switzerland', tla: 'SUI', crest: 'CH' },
    score: { winner: null, duration: 'REGULAR', fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
    odds_win_rate: 'SUI 1.23'
  },
  {
    id: 200006,
    utcDate: '2026-06-14T06:00:00Z',
    status: 'TIMED',
    matchday: 1,
    stage: 'GROUP_STAGE',
    group: 'GROUP_C',
    lastUpdated: '2026-06-11T12:00:00Z',
    homeTeam: { id: 1009, name: 'Brazil', shortName: 'Brazil', tla: 'BRA', crest: 'BR' },
    awayTeam: { id: 1010, name: 'Morocco', shortName: 'Morocco', tla: 'MAR', crest: 'MA' },
    score: { winner: null, duration: 'REGULAR', fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
    odds_win_rate: 'BRA 1.68'
  },
  {
    id: 200007,
    utcDate: '2026-06-14T09:00:00Z',
    status: 'TIMED',
    matchday: 1,
    stage: 'GROUP_STAGE',
    group: 'GROUP_C',
    lastUpdated: '2026-06-11T12:00:00Z',
    homeTeam: { id: 1011, name: 'Haiti', shortName: 'Haiti', tla: 'HAI', crest: 'HT' },
    awayTeam: { id: 1012, name: 'Scotland', shortName: 'Scotland', tla: 'SCO', crest: 'GB-SCT' },
    score: { winner: null, duration: 'REGULAR', fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
    odds_win_rate: 'SCO 1.55'
  }
];

// Helper to fetch with local caching
const fetchWithCache = async <T>(cacheKey: string, endpoint: string): Promise<T | null> => {
  try {
    const cachedData = await AsyncStorage.getItem(cacheKey);
    const cachedTime = await AsyncStorage.getItem(`${cacheKey}_time`);
    
    if (cachedData && cachedTime) {
      const parsedTime = parseInt(cachedTime, 10);
      if (Date.now() - parsedTime < CACHE_DURATION_MS) {
        console.log(`[FootballData] Returning cached data for ${cacheKey}`);
        return JSON.parse(cachedData) as T;
      }
    }
    
    console.log(`[FootballData] Fetching fresh data for ${endpoint}`);
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        'X-Auth-Token': API_TOKEN,
      },
    });
    
    await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data));
    await AsyncStorage.setItem(`${cacheKey}_time`, Date.now().toString());
    
    return response.data as T;
  } catch (error) {
    console.warn(`[FootballData] Error fetching ${endpoint}, using cache fallback:`, error);
    
    // Fallback to cache if exists
    const cachedData = await AsyncStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }
    
    return null;
  }
};

export const fetchWorldCupStandings = async (): Promise<FootballDataStandingsResponse> => {
  const data = await fetchWithCache<FootballDataStandingsResponse>('wc_standings', '/competitions/WC/standings');
  if (data && data.standings && data.standings.length > 0) {
    return data;
  }
  // Safe high-fidelity fallback if API fails
  return { standings: MOCK_STANDINGS };
};

export const fetchWorldCupMatches = async (): Promise<FootballDataMatchesResponse> => {
  const data = await fetchWithCache<FootballDataMatchesResponse>('wc_matches', '/competitions/WC/matches');
  if (data && data.matches && data.matches.length > 0) {
    return data;
  }
  // Safe high-fidelity fallback if API fails
  return { matches: MOCK_MATCHES };
};
