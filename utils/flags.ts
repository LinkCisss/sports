/**
 * utils/flags.ts
 * Maps English team names (as returned by API) to ISO 3166-1 alpha-2 codes.
 */
export const getTeamFlagCode = (teamName: string): string | undefined => {
  const dictionary: Record<string, string> = {
    // English Clubs -> GB (Using UK flag for English clubs as default for flag library)
    "Arsenal": "GB",
    "Aston Villa": "GB",
    "Bournemouth": "GB",
    "Brentford": "GB",
    "Brighton and Hove Albion": "GB",
    "Brighton": "GB",
    "Burnley": "GB",
    "Chelsea": "GB",
    "Crystal Palace": "GB",
    "Everton": "GB",
    "Fulham": "GB",
    "Liverpool": "GB",
    "Luton Town": "GB",
    "Luton": "GB",
    "Manchester City": "GB",
    "Manchester United": "GB",
    "Newcastle United": "GB",
    "Newcastle": "GB",
    "Nottingham Forest": "GB",
    "Sheffield United": "GB",
    "Tottenham Hotspur": "GB",
    "Tottenham": "GB",
    "West Ham United": "GB",
    "West Ham": "GB",
    "Wolverhampton Wanderers": "GB",
    "Wolves": "GB",

    // Spanish Clubs -> ES
    "Real Madrid": "ES",
    "Barcelona": "ES",
    "Atletico Madrid": "ES",
    
    // German Clubs -> DE
    "Bayern Munich": "DE",
    "Borussia Dortmund": "DE",
    
    // French Clubs -> FR
    "Paris Saint Germain": "FR",
    
    // Italian Clubs -> IT
    "Juventus": "IT",
    "AC Milan": "IT",
    "Inter Milan": "IT",

    // National Teams
    "Argentina": "AR",
    "Brazil": "BR",
    "France": "FR",
    "Germany": "DE",
    "England": "GB", // Can also be mapped to GB-ENG if supported by flag library, but usually GB is safest fallback
    "Spain": "ES",
    "Portugal": "PT",
    "Italy": "IT",
    "Netherlands": "NL",
    "Belgium": "BE",
    "Croatia": "HR",
    "Uruguay": "UY",
    "Colombia": "CO",
    "Senegal": "SN",
    "Morocco": "MA",
    "Japan": "JP",
    "South Korea": "KR",
    "United States": "US",
    "Mexico": "MX",
    "Canada": "CA",
    "China": "CN",
    "Australia": "AU",
    "Saudi Arabia": "SA",
  };
  return dictionary[teamName];
};
