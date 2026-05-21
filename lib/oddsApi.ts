import axios from 'axios';

// The Odds API 免费版配额有限，请注意调用频率
const API_KEY = process.env.EXPO_PUBLIC_ODDS_API_KEY || '90ac78ab00a546e7440e90a7c93316fe';
const BASE_URL = 'https://api.the-odds-api.com/v4/sports';

export interface OddsOutcome {
  name: string;
  price: number;
}

export interface Market {
  key: string;
  last_update: string;
  outcomes: OddsOutcome[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface MatchOdds {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

/**
 * 获取赛事及实时赔率
 * 默认获取 'soccer_epl'（英超）作为示例。由于目前 2026 世界杯还没开赛，
 * 测试时使用正在进行的联赛更容易看到数据。世界杯的 key 通常为 'soccer_fifa_world_cup'
 */
export const fetchLiveMatchesWithOdds = async (sportKey: string = 'soccer_epl'): Promise<MatchOdds[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/${sportKey}/odds`, {
      params: {
        apiKey: API_KEY,
        regions: 'eu,us', // 获取欧洲和美国的主流博彩公司
        markets: 'h2h',   // Head to Head (胜平负)
        oddsFormat: 'decimal', // 十进制赔率 (例如 1.50)
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching from The Odds API:', error);
    return [];
  }
};
