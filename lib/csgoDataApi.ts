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
  stage: string;
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

const PANDASCORE_API_KEY = 'SltvK9asJ5UAaROQ9bN5IJiv9n_n4_1kH3CI6t78bL6QkMg2iHA';
const BASE_URL = 'https://api.pandascore.co';

const translateName = (name: string) => {
  if (!name) return name;
  return name
    .replace(/Cologne/ig, '科隆')
    .replace(/Atlanta/ig, '亚特兰大')
    .replace(/Astana/ig, '阿斯塔纳')
    .replace(/Rio/ig, '里约')
    .replace(/Bucharest/ig, '布加勒斯特')
    .replace(/Rotterdam/ig, '鹿特丹')
    .replace(/Fort Worth/ig, '沃斯堡')
    .replace(/Pro League/ig, 'EPL')
    .replace(/Showdown/ig, '对抗赛')
    .replace(/Playoffs/ig, '季后赛')
    .replace(/Group Stage/ig, '小组赛')
    .replace(/Showmatch/ig, '表演赛')
    .replace(/Qualifier/ig, '预选赛')
    .replace(/Closed/ig, '封闭')
    .replace(/Open/ig, '公开')
    .replace(/Finals/ig, '总决赛')
    .replace(/Final/ig, '决赛')
    .replace(/Quarterfinal/ig, '1/4决赛')
    .replace(/Semifinal/ig, '半决赛')
    .replace(/Grand Final/ig, '总决赛')
    .replace(/Europe/ig, '欧洲')
    .replace(/North America/ig, '北美')
    .replace(/South America/ig, '南美')
    .replace(/Asia/ig, '亚洲')
    .replace(/World Championship/ig, '全球总决赛')
    .replace(/Stage/ig, '阶段')
    .replace(/League/ig, '联赛')
    .replace(/Championship/ig, '锦标赛');
};

export const fetchCsgoMatches = async (): Promise<CsgoMatch[]> => {
  try {
    const [upcomingRes, pastRes1, pastRes2] = await Promise.all([
      fetch(`${BASE_URL}/csgo/matches?filter[status]=running,not_started&sort=begin_at&per_page=100`, {
        headers: { 'Authorization': `Bearer ${PANDASCORE_API_KEY}`, 'Accept': 'application/json' }
      }),
      fetch(`${BASE_URL}/csgo/matches?filter[status]=finished&sort=-begin_at&per_page=100&page=1`, {
        headers: { 'Authorization': `Bearer ${PANDASCORE_API_KEY}`, 'Accept': 'application/json' }
      }),
      fetch(`${BASE_URL}/csgo/matches?filter[status]=finished&sort=-begin_at&per_page=100&page=2`, {
        headers: { 'Authorization': `Bearer ${PANDASCORE_API_KEY}`, 'Accept': 'application/json' }
      })
    ]);

    const upcomingData = upcomingRes.ok ? await upcomingRes.json() : [];
    const pastData1 = pastRes1.ok ? await pastRes1.json() : [];
    const pastData2 = pastRes2.ok ? await pastRes2.json() : [];

    const data = [...upcomingData, ...pastData1, ...pastData2];
    
    // Filter out matches that don't have exactly 2 opponents and filter by high-tier tournaments
    const validMatches = data.filter((m: any) => {
      if (!m.opponents || m.opponents.length !== 2) return false;
      
      const tier = m.league?.tier || m.serie?.tier || m.tournament?.tier;
      if (tier === 's' || tier === 'a' || tier === 'b') return true;
      
      const name = ((m.league?.name || '') + ' ' + (m.serie?.name || '') + ' ' + (m.tournament?.name || '')).toLowerCase();
      if (/iem|blast|pgl|esl|epl|major|cac|roobet|thunderpick|intel/i.test(name)) return true;
      
      return false;
    });

    const formattedMatches = validMatches.map((match: any, index: number) => {
      let status: 'FINISHED' | 'IN_PLAY' | 'TIMED' = 'TIMED';
      if (match.status === 'running') status = 'IN_PLAY';
      if (match.status === 'finished') status = 'FINISHED';

      const homeOpponent = match.opponents[0].opponent;
      const awayOpponent = match.opponents[1].opponent;

      // Extract scores if available
      const homeScoreObj = match.results?.find((r: any) => r.team_id === homeOpponent.id);
      const awayScoreObj = match.results?.find((r: any) => r.team_id === awayOpponent.id);

      // Maps
      const maps: CsgoMapScore[] = (match.games || []).map((game: any, gIndex: number) => {
        let winner: 'HOME' | 'AWAY' | undefined = undefined;
        if (game.winner?.id === homeOpponent.id) winner = 'HOME';
        if (game.winner?.id === awayOpponent.id) winner = 'AWAY';
        
        let gameStatus: 'FINISHED' | 'IN_PLAY' | 'UNPLAYED' = 'UNPLAYED';
        if (game.status === 'finished') gameStatus = 'FINISHED';
        if (game.status === 'running') gameStatus = 'IN_PLAY';

        return {
          mapName: game.position ? `Map ${game.position}` : `Map ${gIndex + 1}`,
          homeScore: gameStatus === 'FINISHED' ? (winner === 'HOME' ? 13 : 0) : 0, 
          awayScore: gameStatus === 'FINISHED' ? (winner === 'AWAY' ? 13 : 0) : 0,
          status: gameStatus,
          winner: winner
        };
      });

      // The UI filters by stage
      const stageRaw = match.tournament?.name || match.league?.name || 'Tournament';
      const stage = translateName(stageRaw);

      return {
        id: match.id.toString(),
        tournamentName: translateName((match.league?.name || '') + ' ' + (match.serie?.name || '')),
        stage: stage,
        utcDate: match.begin_at || match.scheduled_at || new Date().toISOString(),
        status: status,
        homeTeam: {
          id: homeOpponent.id.toString(),
          name: homeOpponent.name || 'Unknown',
          tla: homeOpponent.acronym || homeOpponent.name?.substring(0, 3).toUpperCase() || 'TBA',
          flagCode: homeOpponent.location || 'UN',
          logoUrl: homeOpponent.image_url,
        },
        awayTeam: {
          id: awayOpponent.id.toString(),
          name: awayOpponent.name || 'Unknown',
          tla: awayOpponent.acronym || awayOpponent.name?.substring(0, 3).toUpperCase() || 'TBA',
          flagCode: awayOpponent.location || 'UN',
          logoUrl: awayOpponent.image_url,
        },
        score: {
          home: homeScoreObj?.score || 0,
          away: awayScoreObj?.score || 0,
        },
        maps: maps,
      };
    });

    const now = Date.now();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    const tourneyLatestTime: Record<string, number> = {};
    const tourneyEarliestTime: Record<string, number> = {};

    formattedMatches.forEach((m: any) => {
      const time = new Date(m.utcDate).getTime();
      if (!tourneyLatestTime[m.tournamentName] || time > tourneyLatestTime[m.tournamentName]) {
        tourneyLatestTime[m.tournamentName] = time;
      }
      if (!tourneyEarliestTime[m.tournamentName] || time < tourneyEarliestTime[m.tournamentName]) {
        tourneyEarliestTime[m.tournamentName] = time;
      }
    });

    const timeFilteredMatches = formattedMatches.filter((m: any) => {
      const latest = tourneyLatestTime[m.tournamentName];
      const earliest = tourneyEarliestTime[m.tournamentName];
      
      // If the tournament's latest match is older than 7 days, discard
      if (now - latest > SEVEN_DAYS_MS) return false;
      // If the tournament's earliest match is more than 30 days in the future, discard
      if (earliest - now > THIRTY_DAYS_MS) return false;

      return true;
    });

    // Sort chronologically ascending
    return timeFilteredMatches.sort((a: any, b: any) => {
      const timeA = new Date(a.utcDate).getTime();
      const timeB = new Date(b.utcDate).getTime();
      return timeA - timeB;
    });
  } catch (error) {
    console.error('Error fetching PandaScore API:', error);
    return [];
  }
};
