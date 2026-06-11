// utils/translate.ts

const TEAM_DICTIONARY: Record<string, string> = {
  // English Premier League (EPL)
  "Arsenal": "阿森纳",
  "Aston Villa": "阿斯顿维拉",
  "Bournemouth": "伯恩茅斯",
  "Brentford": "布伦特福德",
  "Brighton and Hove Albion": "布莱顿",
  "Brighton": "布莱顿",
  "Burnley": "伯恩利",
  "Chelsea": "切尔西",
  "Crystal Palace": "水晶宫",
  "Everton": "埃弗顿",
  "Fulham": "富勒姆",
  "Liverpool": "利物浦",
  "Luton Town": "卢顿",
  "Luton": "卢顿",
  "Manchester City": "曼城",
  "Manchester United": "曼联",
  "Newcastle United": "纽卡斯尔联",
  "Newcastle": "纽卡斯尔",
  "Nottingham Forest": "诺丁汉森林",
  "Sheffield United": "谢菲尔德联",
  "Tottenham Hotspur": "热刺",
  "Tottenham": "热刺",
  "West Ham United": "西汉姆联",
  "West Ham": "西汉姆联",
  "Wolverhampton Wanderers": "狼队",
  "Wolves": "狼队",

  // Other Top Clubs
  "Real Madrid": "皇家马德里",
  "Barcelona": "巴塞罗那",
  "Atletico Madrid": "马德里竞技",
  "Bayern Munich": "拜仁慕尼黑",
  "Borussia Dortmund": "多特蒙德",
  "Paris Saint Germain": "巴黎圣日耳曼",
  "Juventus": "尤文图斯",
  "AC Milan": "AC米兰",
  "Inter Milan": "国际米兰",

  // National Teams (World Cup etc.)
  "Argentina": "阿根廷",
  "Brazil": "巴西",
  "France": "法国",
  "Germany": "德国",
  "England": "英格兰",
  "Spain": "西班牙",
  "Portugal": "葡萄牙",
  "Italy": "意大利",
  "Netherlands": "荷兰",
  "Belgium": "比利时",
  "Croatia": "克罗地亚",
  "Uruguay": "乌拉圭",
  "Colombia": "哥伦比亚",
  "Senegal": "塞内加尔",
  "Morocco": "摩洛哥",
  "Japan": "日本",
  "South Korea": "韩国",
  "United States": "美国",
  "Mexico": "墨西哥",
  "Canada": "加拿大",
  "China": "中国",
  "Australia": "澳大利亚",
  "Saudi Arabia": "沙特阿拉伯",
  "Czech Republic": "捷克",
  "Czech Rep": "捷克",
  "South Africa": "南非",
  "Qatar": "卡塔尔",
  "Switzerland": "瑞士",
  "Haiti": "海地",
  "Scotland": "苏格兰",
  "Paraguay": "巴拉圭",
  "Turkey": "土耳其",
  "Bosnia and Herzegovina": "波黑",
  "Bosnia": "波黑",
  
  // fallback for generic draw
  "Draw": "平局"
};

const LEAGUE_DICTIONARY: Record<string, string> = {
  "EPL": "英超",
  "English Premier League": "英格兰超级联赛",
  "Premier League": "英超联赛",
  "La Liga": "西甲",
  "Bundesliga": "德甲",
  "Serie A": "意甲",
  "Ligue 1": "法甲",
  "Champions League": "欧冠",
  "Europa League": "欧联杯",
  "FIFA World Cup": "FIFA 世界杯",
  "World Cup": "世界杯",
  "Euro Championship": "欧洲杯",
  "Copa America": "美洲杯"
};

/**
 * 翻译球队名称
 * @param englishName 球队英文名
 * @returns 中文名（如果找不到则返回原英文名）
 */
export const translateTeam = (englishName: string): string => {
  if (!englishName) return '';
  return TEAM_DICTIONARY[englishName] || englishName;
};

/**
 * 翻译联赛名称
 * @param englishName 联赛英文名
 * @returns 中文名（如果找不到则返回原英文名）
 */
export const translateLeague = (englishName: string): string => {
  if (!englishName) return '';
  return LEAGUE_DICTIONARY[englishName] || englishName;
};

/**
 * 动态扩展翻译字典的方法
 * @param newTeams 新增的球队映射
 * @param newLeagues 新增的联赛映射
 */
export const extendDictionary = (newTeams?: Record<string, string>, newLeagues?: Record<string, string>) => {
  if (newTeams) {
    Object.assign(TEAM_DICTIONARY, newTeams);
  }
  if (newLeagues) {
    Object.assign(LEAGUE_DICTIONARY, newLeagues);
  }
};
