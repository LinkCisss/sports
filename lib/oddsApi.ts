import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// The Odds API 免费版配额有限，请注意调用频率
const API_KEY = process.env.EXPO_PUBLIC_ODDS_API_KEY || '90ac78ab00a546e7440e90a7c93316fe';
const BASE_URL = 'https://api.the-odds-api.com/v4/sports';

export interface OddsOutcome {
  name: string;
  price: number;
  point?: number;
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
 * 获取赛事及实时赔率 (仅 h2h 胜平负)
 * @param sportKey 联赛 Key
 * @param dateString 可选：指定查询的日期 (YYYY-MM-DD)，不传则返回默认的 Live/Upcoming
 */
export const fetchLiveMatchesWithOdds = async (sportKey: string = 'soccer_epl', dateString?: string): Promise<MatchOdds[]> => {
  try {
    const params: any = {
      apiKey: API_KEY,
      regions: 'eu,us',
      markets: 'h2h',
      oddsFormat: 'decimal',
    };

    if (dateString) {
      // 构造当天的 UTC 起止时间 (例如 '2026-06-11T00:00:00Z')
      params.commenceTimeFrom = dayjs(dateString).startOf('day').utc().format();
      params.commenceTimeTo = dayjs(dateString).endOf('day').utc().format();
    }

    const response = await axios.get(`${BASE_URL}/${sportKey}/odds`, { params });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching from The Odds API:', error);
    return [];
  }
};

/**
 * 获取单场比赛的详细赔率（包含多种盘口）
 * 供“平台对比”详情页使用，下钻展示 h2h, spreads, totals
 */
export const fetchEventOdds = async (sportKey: string, eventId: string): Promise<MatchOdds | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/${sportKey}/events/${eventId}/odds`, {
      params: {
        apiKey: API_KEY,
        regions: 'eu,us',
        markets: 'h2h,spreads,totals',
        oddsFormat: 'decimal',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching event odds for ${eventId}:`, error);
    return null;
  }
};
