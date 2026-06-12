import dayjs from 'dayjs';

export interface CsgoPlayerStat {
  name: string;
  kills: number;
  deaths: number;
  adr: number; // Average Damage per Round
  rating: number; // HLTV Rating 2.0
  position: string; // e.g. "AWPer", "Rifler", "IGL"
}

export interface CsgoTeamLineup {
  coach: string;
  players: CsgoPlayerStat[];
}

export interface CsgoMapScore {
  mapName: string;
  homeScore: number;
  awayScore: number;
  status: 'FINISHED' | 'IN_PLAY' | 'UNPLAYED';
  winner?: 'HOME' | 'AWAY';
}

export interface CsgoMatch {
  id: string;
  tournamentName: string;
  stage: 'LEGENDS_STAGE' | 'CHAMPIONS_STAGE';
  utcDate: string;
  status: 'FINISHED' | 'IN_PLAY' | 'TIMED';
  homeTeam: {
    id: string;
    name: string;
    tla: string;
    flagCode: string; // HQ flag code for display
    logoUrl?: string;
  };
  awayTeam: {
    id: string;
    name: string;
    tla: string;
    flagCode: string;
    logoUrl?: string;
  };
  score: {
    home: number; // Map wins
    away: number; // Map wins
  };
  maps: CsgoMapScore[];
  lineups?: {
    home: CsgoTeamLineup;
    away: CsgoTeamLineup;
  };
  odds?: {
    providerName: string;
    homeOdds: number;
    awayOdds: number;
  }[];
}

const MOCK_CSGO_MATCHES: CsgoMatch[] = [
  {
    id: 'csgo_match_1',
    tournamentName: 'PGL Major Copenhagen 2026',
    stage: 'CHAMPIONS_STAGE',
    utcDate: dayjs().subtract(1, 'day').hour(19).minute(0).utc().format(), // Yesterday 19:00 UTC
    status: 'FINISHED',
    homeTeam: { id: 'g2', name: 'G2 Esports', tla: 'G2', flagCode: 'DE' },
    awayTeam: { id: 'navi', name: 'Natus Vincere', tla: 'NAV', flagCode: 'UA' },
    score: { home: 2, away: 1 },
    maps: [
      { mapName: 'Mirage', homeScore: 13, awayScore: 9, status: 'FINISHED', winner: 'HOME' },
      { mapName: 'Nuke', homeScore: 10, awayScore: 13, status: 'FINISHED', winner: 'AWAY' },
      { mapName: 'Inferno', homeScore: 13, awayScore: 11, status: 'FINISHED', winner: 'HOME' },
    ],
    lineups: {
      home: {
        coach: 'TaZ',
        players: [
          { name: 'm0NESY', kills: 68, deaths: 42, adr: 88.5, rating: 1.35, position: 'AWPer' },
          { name: 'NiKo', kills: 61, deaths: 48, adr: 82.4, rating: 1.21, position: 'Rifler' },
          { name: 'huNter-', kills: 52, deaths: 51, adr: 74.8, rating: 1.05, position: 'Rifler' },
          { name: 'Snax', kills: 45, deaths: 54, adr: 68.2, rating: 0.94, position: 'IGL' },
          { name: 'malbsMd', kills: 48, deaths: 50, adr: 72.1, rating: 1.01, position: 'Rifler' },
        ],
      },
      away: {
        coach: 'B1ad3',
        players: [
          { name: 'jL', kills: 63, deaths: 52, adr: 84.1, rating: 1.23, position: 'Rifler' },
          { name: 'w0nderful', kills: 58, deaths: 48, adr: 78.5, rating: 1.15, position: 'AWPer' },
          { name: 'b1t', kills: 50, deaths: 54, adr: 71.0, rating: 0.99, position: 'Rifler' },
          { name: 'iM', kills: 44, deaths: 58, adr: 66.8, rating: 0.91, position: 'Rifler' },
          { name: 'Aleksib', kills: 41, deaths: 62, adr: 62.4, rating: 0.84, position: 'IGL' },
        ],
      },
    },
    odds: [
      { providerName: 'GG.BET', homeOdds: 1.68, awayOdds: 2.15 },
      { providerName: 'Pinnacle', homeOdds: 1.72, awayOdds: 2.10 },
      { providerName: 'Thunderpick', homeOdds: 1.65, awayOdds: 2.22 },
    ],
  },
  {
    id: 'csgo_match_2',
    tournamentName: 'PGL Major Copenhagen 2026',
    stage: 'CHAMPIONS_STAGE',
    utcDate: dayjs().utc().format(), // Live right now!
    status: 'IN_PLAY',
    homeTeam: { id: 'vitality', name: 'Team Vitality', tla: 'VIT', flagCode: 'FR' },
    awayTeam: { id: 'faze', name: 'FaZe Clan', tla: 'FAZ', flagCode: 'US' },
    score: { home: 1, away: 1 },
    maps: [
      { mapName: 'Anubis', homeScore: 13, awayScore: 7, status: 'FINISHED', winner: 'HOME' },
      { mapName: 'Ancient', homeScore: 9, awayScore: 13, status: 'FINISHED', winner: 'AWAY' },
      { mapName: 'Mirage', homeScore: 8, awayScore: 5, status: 'IN_PLAY' },
    ],
    lineups: {
      home: {
        coach: 'XTQZZZ',
        players: [
          { name: 'ZywOo', kills: 52, deaths: 31, adr: 92.4, rating: 1.48, position: 'AWPer' },
          { name: 'Spinx', kills: 45, deaths: 35, adr: 81.0, rating: 1.18, position: 'Rifler' },
          { name: 'flameZ', kills: 42, deaths: 38, adr: 78.4, rating: 1.12, position: 'Rifler' },
          { name: 'apEX', kills: 31, deaths: 42, adr: 64.5, rating: 0.89, position: 'IGL' },
          { name: 'mezii', kills: 35, deaths: 39, adr: 68.0, rating: 0.95, position: 'Rifler' },
        ],
      },
      away: {
        coach: 'NEO',
        players: [
          { name: 'broky', kills: 46, deaths: 38, adr: 79.5, rating: 1.14, position: 'AWPer' },
          { name: 'ropz', kills: 43, deaths: 41, adr: 76.8, rating: 1.09, position: 'Rifler' },
          { name: 'frozen', kills: 41, deaths: 42, adr: 75.0, rating: 1.04, position: 'Rifler' },
          { name: 'rain', kills: 38, deaths: 45, adr: 71.2, rating: 0.96, position: 'Rifler' },
          { name: 'karrigan', kills: 28, deaths: 49, adr: 58.4, rating: 0.76, position: 'IGL' },
        ],
      },
    },
    odds: [
      { providerName: 'GG.BET', homeOdds: 1.42, awayOdds: 2.75 },
      { providerName: 'Pinnacle', homeOdds: 1.45, awayOdds: 2.62 },
    ],
  },
  {
    id: 'csgo_match_3',
    tournamentName: 'PGL Major Copenhagen 2026',
    stage: 'CHAMPIONS_STAGE',
    utcDate: dayjs().hour(20).minute(0).second(0).utc().format(), // Today 20:00 UTC
    status: 'TIMED',
    homeTeam: { id: 'mouz', name: 'MOUZ', tla: 'MOU', flagCode: 'DE' },
    awayTeam: { id: 'astralis', name: 'Astralis', tla: 'AST', flagCode: 'DK' },
    score: { home: 0, away: 0 },
    maps: [
      { mapName: 'Mirage', homeScore: 0, awayScore: 0, status: 'UNPLAYED' },
      { mapName: 'Nuke', homeScore: 0, awayScore: 0, status: 'UNPLAYED' },
      { mapName: 'Ancient', homeScore: 0, awayScore: 0, status: 'UNPLAYED' },
    ],
    odds: [
      { providerName: 'GG.BET', homeOdds: 1.55, awayOdds: 2.40 },
      { providerName: 'Pinnacle', homeOdds: 1.58, awayOdds: 2.35 },
      { providerName: 'Thunderpick', homeOdds: 1.52, awayOdds: 2.48 },
    ],
  },
  {
    id: 'csgo_match_4',
    tournamentName: 'PGL Major Copenhagen 2026',
    stage: 'LEGENDS_STAGE',
    utcDate: dayjs().add(1, 'day').hour(3).minute(0).second(0).utc().format(), // Tomorrow 03:00 UTC
    status: 'TIMED',
    homeTeam: { id: 'liquid', name: 'Team Liquid', tla: 'TL', flagCode: 'US' },
    awayTeam: { id: 'vp', name: 'Virtus.pro', tla: 'VP', flagCode: 'AM' },
    score: { home: 0, away: 0 },
    maps: [
      { mapName: 'Anubis', homeScore: 0, awayScore: 0, status: 'UNPLAYED' },
      { mapName: 'Ancient', homeScore: 0, awayScore: 0, status: 'UNPLAYED' },
      { mapName: 'Dust II', homeScore: 0, awayScore: 0, status: 'UNPLAYED' },
    ],
    odds: [
      { providerName: 'GG.BET', homeOdds: 1.95, awayOdds: 1.85 },
      { providerName: 'Pinnacle', homeOdds: 1.98, awayOdds: 1.82 },
    ],
  },
];

export const fetchCsgoMatches = async (): Promise<CsgoMatch[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CSGO_MATCHES);
    }, 400); // simulate network delay
  });
};
