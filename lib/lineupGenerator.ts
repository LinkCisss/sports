export interface Player {
  name: string;
  number: number;
  position: 'GK' | 'DF' | 'MF' | 'FW';
}

export interface TeamLineup {
  formation: string;
  coach: string;
  startingXI: Player[];
  substitutes: Player[];
}

export interface MatchLineup {
  home: TeamLineup;
  away: TeamLineup;
}

// Famous players for key teams to show premium design
const PRESETS: Record<string, TeamLineup> = {
  'Argentina': {
    formation: '4-3-3',
    coach: 'Lionel Scaloni',
    startingXI: [
      { name: 'E. Martínez', number: 23, position: 'GK' },
      { name: 'N. Molina', number: 26, position: 'DF' },
      { name: 'C. Romero', number: 13, position: 'DF' },
      { name: 'N. Otamendi', number: 19, position: 'DF' },
      { name: 'N. Tagliafico', number: 3, position: 'DF' },
      { name: 'R. De Paul', number: 7, position: 'MF' },
      { name: 'E. Fernández', number: 24, position: 'MF' },
      { name: 'A. Mac Allister', number: 20, position: 'MF' },
      { name: 'L. Messi', number: 10, position: 'FW' },
      { name: 'J. Álvarez', number: 9, position: 'FW' },
      { name: 'A. Di María', number: 11, position: 'FW' }
    ],
    substitutes: [
      { name: 'G. Rulli', number: 1, position: 'GK' },
      { name: 'G. Montiel', number: 4, position: 'DF' },
      { name: 'L. Martínez', number: 22, position: 'FW' },
      { name: 'L. Paredes', number: 5, position: 'MF' },
      { name: 'P. Dybala', number: 21, position: 'FW' }
    ]
  },
  'Brazil': {
    formation: '4-2-3-1',
    coach: 'Dorival Júnior',
    startingXI: [
      { name: 'Ederson', number: 23, position: 'GK' },
      { name: 'Danilo', number: 2, position: 'DF' },
      { name: 'Marquinhos', number: 3, position: 'DF' },
      { name: 'G. Magalhães', number: 4, position: 'DF' },
      { name: 'Wendell', number: 6, position: 'DF' },
      { name: 'B. Guimarães', number: 5, position: 'MF' },
      { name: 'João Gomes', number: 15, position: 'MF' },
      { name: 'Raphinha', number: 11, position: 'FW' },
      { name: 'L. Paquetá', number: 8, position: 'MF' },
      { name: 'Vinícius Jr.', number: 7, position: 'FW' },
      { name: 'Rodrygo', number: 10, position: 'FW' }
    ],
    substitutes: [
      { name: 'Alisson', number: 1, position: 'GK' },
      { name: 'Bremer', number: 14, position: 'DF' },
      { name: 'A. Pereira', number: 18, position: 'MF' },
      { name: 'G. Martinelli', number: 22, position: 'FW' },
      { name: 'Endrick', number: 9, position: 'FW' }
    ]
  },
  'France': {
    formation: '4-3-3',
    coach: 'Didier Deschamps',
    startingXI: [
      { name: 'M. Maignan', number: 16, position: 'GK' },
      { name: 'J. Koundé', number: 5, position: 'DF' },
      { name: 'D. Upamecano', number: 4, position: 'DF' },
      { name: 'W. Saliba', number: 17, position: 'DF' },
      { name: 'T. Hernandez', number: 22, position: 'DF' },
      { name: 'A. Tchouaméni', number: 8, position: 'MF' },
      { name: 'N. Kanté', number: 13, position: 'MF' },
      { name: 'A. Rabiot', number: 14, position: 'MF' },
      { name: 'O. Dembélé', number: 11, position: 'FW' },
      { name: 'M. Thuram', number: 15, position: 'FW' },
      { name: 'K. Mbappé', number: 10, position: 'FW' }
    ],
    substitutes: [
      { name: 'B. Samba', number: 1, position: 'GK' },
      { name: 'B. Pavard', number: 2, position: 'DF' },
      { name: 'E. Camavinga', number: 6, position: 'MF' },
      { name: 'A. Griezmann', number: 7, position: 'FW' },
      { name: 'R. Kolo Muani', number: 12, position: 'FW' }
    ]
  },
  'South Korea': {
    formation: '4-2-3-1',
    coach: 'Hong Myung-bo',
    startingXI: [
      { name: 'Jo Hyeon-woo', number: 21, position: 'GK' },
      { name: 'Seol Young-woo', number: 22, position: 'DF' },
      { name: 'Kim Min-jae', number: 4, position: 'DF' },
      { name: 'Cho Yu-min', number: 3, position: 'DF' },
      { name: 'Lee Myung-jae', number: 13, position: 'DF' },
      { name: 'Hwang In-beom', number: 6, position: 'MF' },
      { name: 'Park Yong-woo', number: 5, position: 'MF' },
      { name: 'Lee Kang-in', number: 18, position: 'FW' },
      { name: 'Lee Jae-sung', number: 10, position: 'MF' },
      { name: 'Son Heung-min', number: 7, position: 'FW' },
      { name: 'Joo Min-kyu', number: 9, position: 'FW' }
    ],
    substitutes: [
      { name: 'Song Bum-keun', number: 1, position: 'GK' },
      { name: 'Kim Young-gwon', number: 19, position: 'DF' },
      { name: 'Hwang Hee-chan', number: 11, position: 'FW' },
      { name: 'Bae Jun-ho', number: 20, position: 'MF' },
      { name: 'Oh Se-hun', number: 19, position: 'FW' }
    ]
  },
  'Mexico': {
    formation: '4-3-3',
    coach: 'Javier Aguirre',
    startingXI: [
      { name: 'L. Malagón', number: 1, position: 'GK' },
      { name: 'J. Sánchez', number: 19, position: 'DF' },
      { name: 'C. Montes', number: 3, position: 'DF' },
      { name: 'J. Vásquez', number: 5, position: 'DF' },
      { name: 'G. Arteaga', number: 6, position: 'DF' },
      { name: 'E. Álvarez', number: 4, position: 'MF' },
      { name: 'L. Romo', number: 7, position: 'MF' },
      { name: 'L. Chávez', number: 24, position: 'MF' },
      { name: 'U. Antuna', number: 15, position: 'FW' },
      { name: 'S. Giménez', number: 11, position: 'FW' },
      { name: 'J. Quiñones', number: 9, position: 'FW' }
    ],
    substitutes: [
      { name: 'G. Ochoa', number: 13, position: 'GK' },
      { name: 'I. Reyes', number: 2, position: 'DF' },
      { name: 'O. Pineda', number: 17, position: 'MF' },
      { name: 'C. Huerta', number: 21, position: 'FW' },
      { name: 'R. Jiménez', number: 14, position: 'FW' }
    ]
  },
  'United States': {
    formation: '4-3-3',
    coach: 'Mauricio Pochettino',
    startingXI: [
      { name: 'M. Turner', number: 1, position: 'GK' },
      { name: 'J. Scally', number: 22, position: 'DF' },
      { name: 'C. Richards', number: 3, position: 'DF' },
      { name: 'T. Ream', number: 13, position: 'DF' },
      { name: 'A. Robinson', number: 5, position: 'DF' },
      { name: 'W. McKennie', number: 8, position: 'MF' },
      { name: 'T. Adams', number: 4, position: 'MF' },
      { name: 'Y. Musah', number: 6, position: 'MF' },
      { name: 'T. Weah', number: 21, position: 'FW' },
      { name: 'F. Balogun', number: 20, position: 'FW' },
      { name: 'C. Pulisic', number: 10, position: 'FW' }
    ],
    substitutes: [
      { name: 'E. Horvath', number: 12, position: 'GK' },
      { name: 'M. Robinson', number: 12, position: 'DF' },
      { name: 'J. Cardoso', number: 15, position: 'MF' },
      { name: 'B. Aaronson', number: 11, position: 'FW' },
      { name: 'R. Pepi', number: 9, position: 'FW' }
    ]
  },
  'Canada': {
    formation: '4-2-3-1',
    coach: 'Jesse Marsch',
    startingXI: [
      { name: 'M. Crépeau', number: 16, position: 'GK' },
      { name: 'A. Johnston', number: 2, position: 'DF' },
      { name: 'M. Bombito', number: 15, position: 'DF' },
      { name: 'D. Cornelius', number: 13, position: 'DF' },
      { name: 'A. Davies', number: 19, position: 'DF' },
      { name: 'I. Koné', number: 8, position: 'MF' },
      { name: 'S. Eustáquio', number: 7, position: 'MF' },
      { name: 'L. Millar', number: 14, position: 'MF' },
      { name: 'J. David', number: 10, position: 'FW' },
      { name: 'J. Shaffelburg', number: 21, position: 'FW' },
      { name: 'C. Larin', number: 9, position: 'FW' }
    ],
    substitutes: [
      { name: 'D. St. Clair', number: 1, position: 'GK' },
      { name: 'K. Miller', number: 3, position: 'DF' },
      { name: 'R. Laryea', number: 22, position: 'DF' },
      { name: 'J. Osorio', number: 21, position: 'MF' },
      { name: 'T. Bair', number: 11, position: 'FW' }
    ]
  },
  'Spain': {
    formation: '4-3-3',
    coach: 'Luis de la Fuente',
    startingXI: [
      { name: 'Unai Simón', number: 23, position: 'GK' },
      { name: 'D. Carvajal', number: 2, position: 'DF' },
      { name: 'R. Le Normand', number: 3, position: 'DF' },
      { name: 'A. Laporte', number: 14, position: 'DF' },
      { name: 'M. Cucurella', number: 24, position: 'DF' },
      { name: 'Rodri', number: 16, position: 'MF' },
      { name: 'Fabián Ruiz', number: 8, position: 'MF' },
      { name: 'Dani Olmo', number: 10, position: 'MF' },
      { name: 'L. Yamal', number: 19, position: 'FW' },
      { name: 'Á. Morata', number: 7, position: 'FW' },
      { name: 'Nico Williams', number: 17, position: 'FW' }
    ],
    substitutes: [
      { name: 'David Raya', number: 1, position: 'GK' },
      { name: 'Vivian', number: 4, position: 'DF' },
      { name: 'A. Grimaldo', number: 12, position: 'DF' },
      { name: 'Pedri', number: 20, position: 'MF' },
      { name: 'M. Oyarzabal', number: 21, position: 'FW' }
    ]
  }
};

// Realistic name components for generating generic teams dynamically
const LAST_NAMES: Record<string, string[]> = {
  default: ['Smith', 'Jones', 'Taylor', 'Brown', 'Wilson', 'Johnson', 'Davies', 'Patel', 'Wright', 'Green'],
  RSA: ['Mokoena', 'Modise', 'Tshabalala', 'Zuma', 'Khumalo', 'Pienaar', 'McCarthy', 'Tau', 'Lorch', 'Zwane'],
  BIH: ['Džeko', 'Pjanić', 'Kolašinac', 'Višća', 'Hadžiahmetović', 'Cimirot', 'Gojak', 'Dulić', 'Krunić', 'Sarić'],
  QAT: ['Al-Haydos', 'Afif', 'Ali', 'Boudiaf', 'Hassan', 'Khoukhi', 'Salman', 'Madibo', 'Pedro', 'Sheeb'],
  SUI: ['Sommer', 'Akanji', 'Elvedi', 'Rodriguez', 'Xhaka', 'Freuler', 'Shaqiri', 'Vargas', 'Embolo', 'Zakaria'],
  AUS: ['Ryan', 'Rowles', 'Souttar', 'Behich', 'Baccus', 'Irvine', 'Metcalfe', 'Goodwin', 'Duke', 'Boyle'],
  TUR: ['Çakır', 'Çelik', 'Söyüncü', 'Demiral', 'Müldür', 'Yokuşlu', 'Tufan', 'Çalhanoğlu', 'Under', 'Yılmaz'],
  EGY: ['Salah', 'Elneny', 'Trezeguet', 'Mostafa', 'Marmoush', 'Hegazi', 'Gabal', 'Fathi', 'Ashour', 'Hamdi'],
  POL: ['Lewandowski', 'Zieliński', 'Szczęsny', 'Kiwiour', 'Bednarek', 'Cash', 'Szymański', 'Milík', 'Frankowski', 'Piątek'],
  JAM: ['Blake', 'Lowe', 'Hector', 'Bell', 'Latibeaudiere', 'Palmer', 'Reid', 'Bailey', 'Antonio', 'Gray'],
  CMR: ['Onana', 'Castelletto', 'Wooh', 'Tolo', 'Anguissa', 'Gouet', 'Mbeumo', 'Toko Ekambi', 'Aboubakar', 'Choupo-Moting'],
  SCO: ['Gunn', 'Porteous', 'Hendry', 'Tierney', 'Hickey', 'McTominay', 'McGinn', 'Robertson', 'Adams', 'Dykes'],
  MAR: ['Bounou', 'Hakimi', 'Aguerd', 'Saïss', 'Mazraoui', 'Amrabat', 'Ounahi', 'Amallah', 'Ziyech', 'En-Nesyri', 'Boufal'],
  PAR: ['Silva', 'Gómez', 'Balbuena', 'Alonso', 'Rojas', 'Cubas', 'Villasanti', 'Sánchez', 'Almirón', 'Sanabria', 'Enciso'],
  CZE: ['Staněk', 'Coufal', 'Holeš', 'Krejčí', 'Jurásek', 'Souček', 'Sadílek', 'Provod', 'Barák', 'Schick', 'Hložek'],
  HAI: ['Placide', 'Ade', 'Metusala', 'Christian', 'Alceus', 'Sainte', 'Cantave', 'Guerrier', 'Nazon', 'Pierrot', 'Etienne'],
  NZL: ['Sail', 'Boxall', 'Pijnaker', 'Cacace', 'Payne', 'Bell', 'Howieson', 'Singh', 'Wood', 'Rojas', 'Just'],
  JPN: ['Suzuki', 'Itakura', 'Taniguchi', 'Machida', 'Suga', 'Endo', 'Morita', 'Minamino', 'Doan', 'Kubo', 'Ueda']
};

const FIRST_NAMES: Record<string, string[]> = {
  default: ['John', 'David', 'James', 'Michael', 'Robert', 'William', 'Alex', 'Daniel', 'Chris', 'Thomas'],
  RSA: ['Themba', 'Percy', 'Siphiwe', 'Itumeleng', 'Bongani', 'Keagan', 'Ronwen', 'Teboho', 'Tshegofatso', 'Lyle'],
  BIH: ['Edin', 'Miralem', 'Sead', 'Edin', 'Amir', 'Gojko', 'Luka', 'Rade', 'Anel', 'Kenan'],
  QAT: ['Hassan', 'Akram', 'Almoez', 'Karim', 'Abdelkarim', 'Boualem', 'Tarek', 'Assim', 'Miguel', 'Saad'],
  SUI: ['Yann', 'Manuel', 'Nico', 'Ricardo', 'Granit', 'Remo', 'Xherdan', 'Ruben', 'Breel', 'Denis'],
  AUS: ['Mathew', 'Kye', 'Harry', 'Aziz', 'Keanu', 'Jackson', 'Connor', 'Craig', 'Mitchell', 'Martin'],
  TUR: ['Uğurcan', 'Zeki', 'Çağlar', 'Merih', 'Mert', 'Okay', 'Ozan', 'Hakan', 'Cengiz', 'Burak'],
  EGY: ['Mohamed', 'Mohamed', 'Mahmoud', 'Mostafa', 'Omar', 'Ahmed', 'Mohamed', 'Hamdi', 'Imam', 'Al-Ahly'],
  POL: ['Robert', 'Piotr', 'Wojciech', 'Jakub', 'Jan', 'Matty', 'Sebastian', 'Arkadiusz', 'Przemysław', 'Krzysztof'],
  JAM: ['Andre', 'Damion', 'Michael', 'Amari\'i', 'Joel', 'Kasey', 'Bobby', 'Leon', 'Michail', 'Demarai'],
  CMR: ['André', 'Jean-Charles', 'Christopher', 'Nouhou', 'Frank', 'Samuel', 'Bryan', 'Karl', 'Vincent', 'Eric'],
  SCO: ['Angus', 'Ryan', 'Jack', 'Kieran', 'Aaron', 'Scott', 'John', 'Andy', 'Che', 'Lyndon'],
  MAR: ['Yassine', 'Achraf', 'Nayef', 'Romain', 'Noussair', 'Sofyan', 'Azzedine', 'Selim', 'Hakim', 'Youssef', 'Sofiane'],
  PAR: ['Antony', 'Gustavo', 'Fabián', 'Junior', 'Robert', 'Andrés', 'Mathías', 'Richard', 'Miguel', 'Antonio', 'Julio'],
  CZE: ['Jindřich', 'Vladimír', 'Tomáš', 'Ladislav', 'David', 'Tomáš', 'Michal', 'Lukáš', 'Antonín', 'Patrik', 'Adam'],
  HAI: ['Johnny', 'Carlens', 'Garven', 'Alex', 'Leverton', 'Danley', 'Mikael', 'Wilde-Donald', 'Duckens', 'Frantzdy', 'Derrick'],
  NZL: ['Oliver', 'Michael', 'Nando', 'Liberato', 'Tim', 'Joe', 'Cameron', 'Sarpreet', 'Chris', 'Marco', 'Elijah'],
  JPN: ['Zion', 'Ko', 'Shogo', 'Koki', 'Daiki', 'Wataru', 'Hidemasa', 'Takumi', 'Ritsu', 'Takefusa', 'Ayase']
};

const TLA_MAP: Record<string, string> = {
  'Mexico': 'MEX',
  'South Africa': 'RSA',
  'South Korea': 'KOR',
  'Czech Republic': 'CZE',
  'Canada': 'CAN',
  'Bosnia and Herzegovina': 'BIH',
  'Qatar': 'QAT',
  'Switzerland': 'SUI',
  'Brazil': 'BRA',
  'Morocco': 'MAR',
  'Haiti': 'HAI',
  'Scotland': 'SCO',
  'United States': 'USA',
  'Paraguay': 'PAR',
  'Australia': 'AUS',
  'Turkey': 'TUR',
  'Argentina': 'ARG',
  'Poland': 'POL',
  'Egypt': 'EGY',
  'New Zealand': 'NZL',
  'France': 'FRA',
  'Japan': 'JPN',
  'Cameroon': 'CMR',
  'Jamaica': 'JAM',
  'Spain': 'ESP'
};

const COACH_FIRST = ['Carlos', 'Guillaume', 'Roberto', 'Hans-Dieter', 'Hervé', 'Aliou', 'Gareth', 'Jürgen', 'Zlatko', 'Marco'];
const COACH_LAST = ['Queiroz', 'Renard', 'Martinez', 'Flick', 'Cissé', 'Southgate', 'Kinsmann', 'Dalić', 'Rossi', 'Silva'];

const generateTeamLineup = (teamName: string): TeamLineup => {
  const tla = TLA_MAP[teamName] || 'default';
  const firsts = FIRST_NAMES[tla] || FIRST_NAMES.default;
  const lasts = LAST_NAMES[tla] || LAST_NAMES.default;
  
  const coachName = `${COACH_FIRST[Math.floor(Math.random() * COACH_FIRST.length)]} ${COACH_LAST[Math.floor(Math.random() * COACH_LAST.length)]}`;
  const formation = Math.random() > 0.4 ? '4-3-3' : '4-2-3-1';
  
  const startingXI: Player[] = [];
  const substitutes: Player[] = [];
  
  // 1. Goalkeeper
  startingXI.push({
    name: `${firsts[0].charAt(0)}. ${lasts[0]}`,
    number: 1,
    position: 'GK'
  });
  
  // 2. Defenders (Positions 1 to 4)
  const dfCount = formation === '4-3-3' || formation === '4-2-3-1' ? 4 : 5;
  for (let i = 0; i < dfCount; i++) {
    const fIdx = (i + 1) % firsts.length;
    const lIdx = (i + 1) % lasts.length;
    startingXI.push({
      name: `${firsts[fIdx].charAt(0)}. ${lasts[lIdx]}`,
      number: 2 + i,
      position: 'DF'
    });
  }
  
  // 3. Midfielders
  const mfCount = formation === '4-3-3' ? 3 : 5;
  for (let i = 0; i < mfCount; i++) {
    const offset = 1 + dfCount + i;
    const fIdx = offset % firsts.length;
    const lIdx = offset % lasts.length;
    startingXI.push({
      name: `${firsts[fIdx].charAt(0)}. ${lasts[lIdx]}`,
      number: 2 + dfCount + i,
      position: 'MF'
    });
  }
  
  // 4. Forwards
  const fwCount = 11 - startingXI.length;
  for (let i = 0; i < fwCount; i++) {
    const offset = 1 + dfCount + mfCount + i;
    const fIdx = offset % firsts.length;
    const lIdx = offset % lasts.length;
    startingXI.push({
      name: `${firsts[fIdx].charAt(0)}. ${lasts[lIdx]}`,
      number: 2 + dfCount + mfCount + i,
      position: 'FW'
    });
  }

  // 5. Substitutes
  for (let i = 0; i < 5; i++) {
    const offset = 12 + i;
    const fIdx = offset % firsts.length;
    const lIdx = offset % lasts.length;
    substitutes.push({
      name: `${firsts[fIdx].charAt(0)}. ${lasts[lIdx]}`,
      number: 12 + i,
      position: i === 0 ? 'GK' : i < 3 ? 'DF' : i === 3 ? 'MF' : 'FW'
    });
  }
  
  return {
    formation,
    coach: coachName,
    startingXI,
    substitutes
  };
};

export const getMatchLineup = (homeTeamName: string, awayTeamName: string): MatchLineup => {
  const homePreset = PRESETS[homeTeamName] || PRESETS[translateTeamBack(homeTeamName)];
  const awayPreset = PRESETS[awayTeamName] || PRESETS[translateTeamBack(awayTeamName)];
  
  return {
    home: homePreset ? JSON.parse(JSON.stringify(homePreset)) : generateTeamLineup(homeTeamName),
    away: awayPreset ? JSON.parse(JSON.stringify(awayPreset)) : generateTeamLineup(awayTeamName)
  };
};

// Helper to match Chinese names back to English for presets lookup
const translateTeamBack = (zhName: string): string => {
  const map: Record<string, string> = {
    '阿根廷': 'Argentina',
    '巴西': 'Brazil',
    '法国': 'France',
    '韩国': 'South Korea',
    '墨西哥': 'Mexico',
    '美国': 'United States',
    '加拿大': 'Canada',
    '西班牙': 'Spain'
  };
  return map[zhName] || zhName;
};
