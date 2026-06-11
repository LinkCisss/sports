/**
 * utils/flags.ts
 * Maps English team names (as returned by API) to ISO 3166-1 alpha-2 codes.
 */
export const getTeamFlagCode = (teamName: string): string | undefined => {
  if (!teamName) return undefined;
  const name = teamName.trim().toLowerCase();
  
  const dictionary: Record<string, string> = {
    // English Clubs
    "arsenal": "GB",
    "aston villa": "GB",
    "bournemouth": "GB",
    "brentford": "GB",
    "brighton and hove albion": "GB",
    "brighton": "GB",
    "burnley": "GB",
    "chelsea": "GB",
    "crystal palace": "GB",
    "everton": "GB",
    "fulham": "GB",
    "liverpool": "GB",
    "luton town": "GB",
    "luton": "GB",
    "manchester city": "GB",
    "manchester united": "GB",
    "newcastle united": "GB",
    "newcastle": "GB",
    "nottingham forest": "GB",
    "sheffield united": "GB",
    "tottenham hotspur": "GB",
    "tottenham": "GB",
    "west ham united": "GB",
    "west ham": "GB",
    "wolverhampton wanderers": "GB",
    "wolves": "GB",

    // Spanish Clubs
    "real madrid": "ES",
    "barcelona": "ES",
    "atletico madrid": "ES",
    "sevilla": "ES",
    "valencia": "ES",
    
    // German Clubs
    "bayern munich": "DE",
    "borussia dortmund": "DE",
    "bayer leverkusen": "DE",
    "rb leipzig": "DE",
    
    // French Clubs
    "paris saint germain": "FR",
    "psg": "FR",
    "marseille": "FR",
    "lyon": "FR",
    
    // Italian Clubs
    "juventus": "IT",
    "ac milan": "IT",
    "inter milan": "IT",
    "napoli": "IT",
    "as roma": "IT",

    // National Teams
    "france": "FR",
    "germany": "DE",
    "england": "GB",
    "spain": "ES",
    "portugal": "PT",
    "italy": "IT",
    "netherlands": "NL",
    "belgium": "BE",
    "croatia": "HR",
    "switzerland": "CH",
    "denmark": "DK",
    "sweden": "SE",
    "norway": "NO",
    "poland": "PL",
    "serbia": "RS",
    "turkey": "TR",
    "wales": "GB",
    "scotland": "GB",
    "czech republic": "CZ",
    "czech rep": "CZ",
    "bosnia and herzegovina": "BA",
    "bosnia": "BA",
    "haiti": "HT",
    
    "argentina": "AR",
    "brazil": "BR",
    "uruguay": "UY",
    "colombia": "CO",
    "chile": "CL",
    "ecuador": "EC",
    "peru": "PE",
    "paraguay": "PY",
    "venezuela": "VE",
    "bolivia": "BO",

    "united states": "US",
    "usa": "US",
    "mexico": "MX",
    "canada": "CA",
    "costa rica": "CR",
    "panama": "PA",
    "jamaica": "JM",
    "honduras": "HN",

    "senegal": "SN",
    "morocco": "MA",
    "south africa": "ZA",
    "nigeria": "NG",
    "egypt": "EG",
    "ghana": "GH",
    "cameroon": "CM",
    "tunisia": "TN",
    "algeria": "DZ",
    "ivory coast": "CI",
    "mali": "ML",
    
    "japan": "JP",
    "south korea": "KR",
    "korea republic": "KR",
    "korea dpr": "KP",
    "north korea": "KP",
    "saudi arabia": "SA",
    "iran": "IR",
    "australia": "AU",
    "qatar": "QA",
    "united arab emirates": "AE",
    "china": "CN",
    "iraq": "IQ",
    "uzbekistan": "UZ",
    "new zealand": "NZ",
    "greece": "GR",
    "slovakia": "SK",
    "slovenia": "SI"
  };
  return dictionary[name];
};
