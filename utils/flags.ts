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
    "Sevilla": "ES",
    "Valencia": "ES",
    
    // German Clubs -> DE
    "Bayern Munich": "DE",
    "Borussia Dortmund": "DE",
    "Bayer Leverkusen": "DE",
    "RB Leipzig": "DE",
    
    // French Clubs -> FR
    "Paris Saint Germain": "FR",
    "Marseille": "FR",
    "Lyon": "FR",
    
    // Italian Clubs -> IT
    "Juventus": "IT",
    "AC Milan": "IT",
    "Inter Milan": "IT",
    "Napoli": "IT",
    "AS Roma": "IT",

    // ----------------------------------------------------
    // National Teams (World Cup & International)
    // ----------------------------------------------------
    // Europe
    "France": "FR",
    "Germany": "DE",
    "England": "GB",
    "Spain": "ES",
    "Portugal": "PT",
    "Italy": "IT",
    "Netherlands": "NL",
    "Belgium": "BE",
    "Croatia": "HR",
    "Switzerland": "CH",
    "Denmark": "DK",
    "Sweden": "SE",
    "Norway": "NO",
    "Poland": "PL",
    "Serbia": "RS",
    "Turkey": "TR",
    "Wales": "GB",
    "Scotland": "GB",
    
    // South America
    "Argentina": "AR",
    "Brazil": "BR",
    "Uruguay": "UY",
    "Colombia": "CO",
    "Chile": "CL",
    "Ecuador": "EC",
    "Peru": "PE",
    "Paraguay": "PY",
    "Venezuela": "VE",
    "Bolivia": "BO",

    // North & Central America
    "United States": "US",
    "Mexico": "MX",
    "Canada": "CA",
    "Costa Rica": "CR",
    "Panama": "PA",
    "Jamaica": "JM",
    "Honduras": "HN",

    // Africa
    "Senegal": "SN",
    "Morocco": "MA",
    "South Africa": "ZA",
    "Nigeria": "NG",
    "Egypt": "EG",
    "Ghana": "GH",
    "Cameroon": "CM",
    "Tunisia": "TN",
    "Algeria": "DZ",
    "Ivory Coast": "CI",
    "Mali": "ML",
    
    // Asia & Oceania
    "Japan": "JP",
    "South Korea": "KR",
    "Saudi Arabia": "SA",
    "Iran": "IR",
    "Australia": "AU",
    "Qatar": "QA",
    "United Arab Emirates": "AE",
    "China": "CN",
    "Iraq": "IQ",
    "Uzbekistan": "UZ",
    "New Zealand": "NZ"
  };
  return dictionary[teamName];
};
