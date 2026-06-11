/**
 * utils/teamColors.ts
 * Maps English team names to their dominant flag colors.
 */
export const TEAM_FLAG_COLORS: Record<string, string[]> = {
  "Mexico": ["#006847", "#CE1126"],
  "South Africa": ["#007C3F", "#FFB612"],
  "South Korea": ["#CD2E3A", "#0047A0"],
  "Korea Republic": ["#CD2E3A", "#0047A0"],
  "Czech Republic": ["#11457E", "#D7141A"],
  "Czech Rep": ["#11457E", "#D7141A"],
  "Canada": ["#FF0000", "#FFFFFF"],
  "Bosnia and Herzegovina": ["#002F6C", "#FEC524"],
  "Bosnia": ["#002F6C", "#FEC524"],
  "USA": ["#B22234", "#3C3B6E"],
  "United States": ["#B22234", "#3C3B6E"],
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
  "Slovakia": ["#0B47A1", "#D32F2F"],
  "Slovenia": ["#005CA9", "#E21A1A"],
  "Greece": ["#0D5EAF", "#FFFFFF"],
  "Netherlands": ["#FF6600", "#FFFFFF"],
  "Belgium": ["#E30613", "#FFE500"],
  "Croatia": ["#FF0000", "#1D328C"],
};

export const getTeamColors = (teamName: string): string[] => {
  if (!teamName) return ['#3A86FF', '#8338EC'];
  const name = teamName.trim();
  return TEAM_FLAG_COLORS[name] || ['#3A86FF', '#8338EC'];
};
