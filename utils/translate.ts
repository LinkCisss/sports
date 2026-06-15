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
  "Switzerland": "瑞士",
  "Denmark": "丹麦",
  "Sweden": "瑞典",
  "Norway": "挪威",
  "Poland": "波兰",
  "Serbia": "塞尔维亚",
  "Turkey": "土耳其",
  "Wales": "威尔士",
  "Scotland": "苏格兰",
  "Northern Ireland": "北爱尔兰",
  "Ireland": "爱尔兰",
  "Republic of Ireland": "爱尔兰",
  "Austria": "奥地利",
  "Hungary": "匈牙利",
  "Romania": "罗马尼亚",
  "Slovakia": "斯洛伐克",
  "Slovenia": "斯洛文尼亚",
  "Albania": "阿尔巴尼亚",
  "Georgia": "格鲁吉亚",
  "Ukraine": "乌克兰",
  "Greece": "希腊",
  "Finland": "芬兰",
  "Iceland": "冰岛",
  "Bulgaria": "保加利亚",
  "Czech Republic": "捷克",
  "Czech Rep": "捷克",
  "Czechia": "捷克",
  "Bosnia and Herzegovina": "波黑",
  "Bosnia-Herzegovina": "波黑",
  "Bosnia": "波黑",
  "Uruguay": "乌拉圭",
  "Colombia": "哥伦比亚",
  "Chile": "智利",
  "Ecuador": "厄瓜多尔",
  "Peru": "秘鲁",
  "Paraguay": "巴拉圭",
  "Venezuela": "委内瑞拉",
  "Bolivia": "玻利维亚",
  "United States": "美国",
  "United States of America": "美国",
  "USA": "美国",
  "Mexico": "墨西哥",
  "Canada": "加拿大",
  "Costa Rica": "哥斯达黎加",
  "Panama": "巴拿马",
  "Jamaica": "牙买加",
  "Honduras": "洪都拉斯",
  "El Salvador": "萨尔瓦多",
  "Guatemala": "危地马拉",
  "Trinidad and Tobago": "特立尼达和多巴哥",
  "Trinidad & Tobago": "特立尼达和多巴哥",
  "Haiti": "海地",
  "Curacao": "库拉索",
  "Senegal": "塞内加尔",
  "Morocco": "摩洛哥",
  "South Africa": "南非",
  "Nigeria": "尼日利亚",
  "Egypt": "埃及",
  "Ghana": "加纳",
  "Cameroon": "喀麦隆",
  "Tunisia": "突尼斯",
  "Algeria": "阿尔及利亚",
  "Ivory Coast": "科特迪瓦",
  "Cote d'Ivoire": "科特迪瓦",
  "Côte d'Ivoire": "科特迪瓦",
  "Mali": "马里",
  "Democratic Republic of the congo": "民主刚果",
  "Democratic Republic of the Congo": "民主刚果",
  "DR Congo": "民主刚果",
  "Congo DR": "民主刚果",
  "Congo": "刚果",
  "Angola": "安哥拉",
  "Guinea": "几内亚",
  "Gabon": "加蓬",
  "Zambia": "赞比亚",
  "Burkina Faso": "布基纳法索",
  "Japan": "日本",
  "South Korea": "韩国",
  "Korea Republic": "韩国",
  "Korea DPR": "朝鲜",
  "North Korea": "朝鲜",
  "Saudi Arabia": "沙特阿拉伯",
  "Iran": "伊朗",
  "Islamic Republic of Iran": "伊朗",
  "Australia": "澳大利亚",
  "Qatar": "卡塔尔",
  "United Arab Emirates": "阿联酋",
  "UAE": "阿联酋",
  "China": "中国",
  "China PR": "中国",
  "PR China": "中国",
  "Iraq": "伊拉克",
  "Uzbekistan": "乌兹别克斯坦",
  "Syria": "叙利亚",
  "Jordan": "约旦",
  "Vietnam": "越南",
  "Thailand": "泰国",
  "Indonesia": "印度尼西亚",
  "India": "印度",
  "New Zealand": "新西兰",
  "Cape Verde": "佛得角",
  "Cabo Verde": "佛得角",
  "Cape Verde Islands": "佛得角",
  
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

const PLAYER_DICTIONARY: Record<string, string> = {
  // Coach Presets
  "Lionel Scaloni": "利昂内尔·斯卡洛尼",
  "Dorival Júnior": "多里瓦尔·儒尼奥尔",
  "Didier Deschamps": "迪迪埃·德尚",
  "Hong Myung-bo": "洪明甫",
  "Javier Aguirre": "哈维尔·阿吉雷",
  "Mauricio Pochettino": "毛里西奥·波切蒂诺",
  "Jesse Marsch": "杰西·马希",
  "Luis de la Fuente": "路易斯·德拉富恩特",
  "Ivan Hašek": "伊万·哈谢克",

  // Argentina
  "E. Martínez": "马丁内斯",
  "N. Molina": "莫利纳",
  "C. Romero": "罗梅罗",
  "N. Otamendi": "奥塔门迪",
  "N. Tagliafico": "塔利亚菲科",
  "R. De Paul": "德保罗",
  "E. Fernández": "恩佐·费尔南德斯",
  "A. Mac Allister": "麦卡利斯特",
  "L. Messi": "梅西",
  "J. Álvarez": "阿尔瓦雷斯",
  "A. Di María": "迪马利亚",
  "G. Rulli": "鲁利",
  "G. Montiel": "蒙铁尔",
  "L. Martínez": "劳塔罗",
  "L. Paredes": "帕雷德斯",
  "P. Dybala": "迪巴拉",
  // Brazil
  "Ederson": "埃德森",
  "Danilo": "达尼洛",
  "Marquinhos": "马尔基尼奥斯",
  "G. Magalhães": "加布里埃尔",
  "Wendell": "温德尔",
  "B. Guimarães": "吉马良斯",
  "João Gomes": "若昂·戈麦斯",
  "Raphinha": "拉菲尼亚",
  "L. Paquetá": "帕奎塔",
  "Vinícius Jr.": "维尼修斯",
  "Rodrygo": "罗德里戈",
  "Alisson": "阿利森",
  "Bremer": "布雷默",
  "A. Pereira": "佩雷拉",
  "G. Martinelli": "马丁内利",
  "Endrick": "恩德里克",
  // France
  "M. Maignan": "迈尼昂",
  "J. Koundé": "孔德",
  "D. Upamecano": "于帕梅卡诺",
  "W. Saliba": "萨利巴",
  "T. Hernandez": "特奥·埃尔南德斯",
  "A. Tchouaméni": "楚阿梅尼",
  "N. Kanté": "坎特",
  "A. Rabiot": "拉比奥特",
  "O. Dembélé": "登贝莱",
  "M. Thuram": "图拉姆",
  "K. Mbappé": "姆巴佩",
  "B. Samba": "桑巴",
  "B. Pavard": "帕瓦尔",
  "E. Camavinga": "卡马文加",
  "A. Griezmann": "格列兹曼",
  "R. Kolo Muani": "穆阿尼",
  // South Korea
  "Jo Hyeon-woo": "赵贤祐",
  "Seol Young-woo": "薛英佑",
  "Kim Min-jae": "金玟哉",
  "Cho Yu-min": "曹侑珉",
  "Lee Myung-jae": "李明载",
  "Hwang In-beom": "黄仁范",
  "Park Yong-woo": "朴镕宇",
  "Lee Kang-in": "李刚仁",
  "Lee Jae-sung": "李在城",
  "Son Heung-min": "孙兴慜",
  "Joo Min-kyu": "周敏圭",
  "Song Bum-keun": "宋范根",
  "Kim Young-gwon": "金英权",
  "Hwang Hee-chan": "黄喜灿",
  "Bae Jun-ho": "裴峻浩",
  "Oh Se-hun": "吴世勋",
  // Mexico
  "L. Malagón": "马拉贡",
  "J. Sánchez": "桑切斯",
  "C. Montes": "蒙特斯",
  "J. Vásquez": "巴斯克斯",
  "G. Arteaga": "阿尔特亚加",
  "E. Álvarez": "阿尔瓦雷斯",
  "L. Romo": "罗莫",
  "L. Chávez": "查韦斯",
  "U. Antuna": "安图尼亚",
  "S. Giménez": "希门尼斯",
  "J. Quiñones": "基尼奥内斯",
  "G. Ochoa": "奥乔亚",
  "I. Reyes": "雷耶斯",
  "O. Pineda": "皮内达",
  "C. Huerta": "韦尔塔",
  "R. Jimenez": "希门尼斯",
  "R. Jiménez": "希门尼斯",
  // United States
  "M. Turner": "特纳",
  "J. Scally": "斯卡利",
  "C. Richards": "里查兹",
  "T. Ream": "里姆",
  "A. Robinson": "罗宾逊",
  "W. McKennie": "麦肯尼",
  "T. Adams": "亚当斯",
  "Y. Musah": "穆萨",
  "T. Weah": "维阿",
  "F. Balogun": "巴洛贡",
  "C. Pulisic": "普利西奇",
  "E. Horvath": "霍瓦特",
  "M. Robinson": "罗宾逊",
  "J. Cardoso": "卡多索",
  "B. Aaronson": "阿伦森",
  "R. Pepi": "佩皮",
  // Canada
  "M. Crépeau": "克雷波",
  "A. Johnston": "约翰斯顿",
  "M. Bombito": "邦比托",
  "D. Cornelius": "科内利乌斯",
  "A. Davies": "阿方索·戴维斯",
  "I. Koné": "科内",
  "S. Eustáquio": "尤斯塔基奥",
  "L. Millar": "米勒",
  "J. David": "乔纳森·戴维",
  "J. Shaffelburg": "沙菲尔伯格",
  "C. Larin": "拉林",
  "D. St. Clair": "圣克莱尔",
  "K. Miller": "米勒",
  "R. Laryea": "拉里亚",
  "J. Osorio": "奥索里奥",
  "T. Bair": "贝尔",
  // Spain
  "Unai Simón": "乌奈·西蒙",
  "D. Carvajal": "卡瓦哈尔",
  "R. Le Normand": "勒诺尔芒",
  "A. Laporte": "拉波尔特",
  "M. Cucurella": "库库雷利亚",
  "Rodri": "罗德里",
  "Fabián Ruiz": "法比安·鲁伊斯",
  "Dani Olmo": "丹尼·奥尔莫",
  "L. Yamal": "雅马尔",
  "Á. Morata": "莫拉塔",
  "Nico Williams": "尼科·威廉姆斯",
  "David Raya": "拉亚",
  "Vivian": "维维安",
  "A. Grimaldo": "格里马尔多",
  "Pedri": "佩德里",
  "M. Oyarzabal": "奥亚萨瓦尔",
};

const FIRST_INITIAL_TRANSLATIONS: Record<string, string> = {
  "A": "阿", "B": "贝", "C": "卡", "D": "德", "E": "埃", "F": "费", "G": "盖", "H": "哈", "I": "伊",
  "J": "杰", "K": "凯", "L": "莱", "M": "马", "N": "尼", "O": "奥", "P": "皮", "Q": "基", "R": "罗",
  "S": "萨", "T": "托", "U": "乌", "V": "维", "W": "威", "X": "克", "Y": "亚", "Z": "泽"
};

const LAST_NAME_TRANSLATIONS: Record<string, string> = {
  // South Africa
  "Mokoena": "莫科埃纳", "Modise": "莫迪塞", "Tshabalala": "查巴拉拉", "Zuma": "祖马", "Khumalo": "库马洛",
  "Pienaar": "皮纳尔", "McCarthy": "麦卡锡", "Tau": "塔乌", "Lorch": "洛奇", "Zwane": "茨瓦内",
  // Bosnia
  "Džeko": "哲科", "Pjanić": "皮亚尼奇", "Kolašinac": "科拉希纳茨", "Višća": "维斯卡", "Hadžiahmetović": "哈济亚梅托维奇",
  "Cimirot": "齐米罗特", "Gojak": "戈亚克", "Dulić": "杜利奇", "Krunić": "克鲁尼奇", "Sarić": "萨里奇",
  // Qatar
  "Al-Haydos": "海多斯", "Afif": "阿菲夫", "Ali": "阿里", "Boudiaf": "布迪亚夫", "Hassan": "哈桑",
  "Khoukhi": "胡希", "Salman": "萨勒曼", "Madibo": "马迪博", "Pedro": "佩德罗", "Sheeb": "希卜",
  // Switzerland
  "Sommer": "索默", "Akanji": "阿坎吉", "Elvedi": "埃尔维迪", "Rodriguez": "罗德里格斯", "Xhaka": "扎卡",
  "Freuler": "弗罗伊勒", "Shaqiri": "沙奇里", "Vargas": "巴尔加斯", "Embolo": "恩博洛", "Zakaria": "扎卡里亚",
  // Australia
  "Ryan": "赖安", "Rowles": "罗尔斯", "Souttar": "苏塔尔", "Behich": "贝希奇", "Baccus": "巴克斯",
  "Irvine": "欧文", "Metcalfe": "梅特卡夫", "Goodwin": "古德温", "Duke": "杜克", "Boyle": "博伊尔",
  // Turkey
  "Çakır": "恰基尔", "Çelik": "切利克", "Söyüncü": "瑟云聚", "Demiral": "德米拉尔", "Müldür": "米尔迪尔",
  "Yokuşlu": "约库什鲁", "Tufan": "图凡", "Çalhanoğlu": "恰尔汗奥卢", "Under": "云代尔", "Yılmaz": "伊尔马兹",
  // Egypt
  "Salah": "萨拉赫", "Elneny": "埃尔内尼", "Trezeguet": "特雷泽盖", "Mostafa": "莫斯塔法", "Marmoush": "马尔穆什",
  "Hegazi": "赫加齐", "Gabal": "加巴尔", "Fathi": "法特希", "Ashour": "阿舒尔", "Hamdi": "哈姆迪",
  // Poland
  "Lewandowski": "莱万多夫斯基", "Zieliński": "泽林斯基", "Szczęsny": "什琴斯尼", "Kiwiour": "基维奥尔", "Bednarek": "贝德纳雷克",
  "Cash": "卡什", "Szymański": "希曼斯基", "Milík": "米利克", "Frankowski": "弗兰科夫斯基", "Piątek": "皮扬特克",
  // Jamaica
  "Blake": "布莱克", "Lowe": "洛维", "Hector": "赫克托", "Bell": "贝尔", "Latibeaudiere": "拉蒂博迪埃",
  "Palmer": "帕尔默", "Reid": "里德", "Bailey": "贝利", "Antonio": "安东尼奥", "Gray": "格雷",
  // Cameroon
  "Onana": "奥纳纳", "Castelletto": "卡斯特莱托", "Wooh": "伍赫", "Tolo": "托洛", "Anguissa": "安古伊萨",
  "Gouet": "古埃特", "Mbeumo": "姆贝乌莫", "Toko Ekambi": "埃卡姆比", "Aboubakar": "阿布巴卡尔", "Choupo-Moting": "舒波-莫廷",
  // Scotland
  "Gunn": "冈恩", "Porteous": "波蒂厄斯", "Hendry": "亨德利", "Tierney": "蒂尔尼", "Hickey": "希基",
  "McTominay": "麦克托米奈", "McGinn": "麦金", "Robertson": "罗伯逊", "Adams": "亚当斯", "Dykes": "戴克斯",
  // Morocco
  "Bounou": "布努", "Hakimi": "阿什拉夫", "Aguerd": "阿盖尔德", "Saïss": "塞斯", "Mazraoui": "马兹拉维",
  "Amrabat": "阿姆拉巴特", "Ounahi": "欧纳希", "Amallah": "阿马拉", "Ziyech": "齐耶赫", "En-Nesyri": "恩-内斯里",
  "Boufal": "布法尔",
  // Paraguay
  "Silva": "席尔瓦", "Gómez": "戈麦斯", "Balbuena": "巴尔武埃纳", "Alonso": "阿隆索", "Rojas": "罗哈斯",
  "Cubas": "库巴斯", "Villasanti": "比利亚桑蒂", "Sánchez": "桑切斯", "Almirón": "阿尔米隆", "Sanabria": "萨纳夫里亚",
  "Enciso": "恩西索",
  // Czech Republic
  "Staněk": "斯塔涅克", "Coufal": "曹法尔", "Holeš": "霍莱什", "Krejčí": "克雷伊奇", "Jurásek": "尤拉塞克",
  "Souček": "绍切克", "Sadílek": "萨迪莱克", "Provod": "普罗沃德", "Barák": "巴拉克", "Schick": "希克",
  "Hložek": "赫洛热克",
  // Haiti
  "Placide": "普拉西德", "Ade": "阿德", "Metusala": "梅图萨拉", "Christian": "克里斯蒂安", "Alceus": "阿尔塞斯",
  "Sainte": "圣地", "Cantave": "坎塔夫", "Guerrier": "格里尔", "Nazon": "纳宗", "Pierrot": "皮埃罗",
  "Etienne": "埃蒂安",
  // New Zealand
  "Sail": "塞勒", "Boxall": "博克萨尔", "Pijnaker": "皮纳克", "Cacace": "卡卡切", "Payne": "佩恩",
  "Howieson": "豪伊森", "Singh": "辛格", "Wood": "伍德", "Just": "贾斯特",
  // Japan
  "Suzuki": "铃木", "Itakura": "板仓滉", "Taniguchi": "谷口彰悟", "Machida": "町田浩树", "Suga": "菅原由势",
  "Endo": "远藤航", "Morita": "守田英正", "Minamino": "南野拓实", "Doan": "堂安律", "Kubo": "久保建英",
  "Ueda": "上田绮世",
  // Generic English Fallbacks
  "Smith": "史密斯", "Jones": "琼斯", "Taylor": "泰勒", "Brown": "布朗", "Wilson": "威尔逊",
  "Johnson": "约翰逊", "Davies": "戴维斯", "Patel": "帕特尔", "Wright": "赖特", "Green": "格林",
  // Coaches & Managers
  "Queiroz": "奎罗斯", "Renard": "勒纳尔", "Martinez": "马丁内斯", "Flick": "弗里克", "Cissé": "西塞",
  "Southgate": "索斯盖特", "Kinsmann": "克林斯曼", "Dalić": "达利奇", "Rossi": "罗西", "Aguirre": "阿吉雷",
  "Scaloni": "斯卡洛尼", "Júnior": "儒尼奥尔", "Deschamps": "德尚", "Myung-bo": "洪明甫", "Pochettino": "波切蒂诺",
  "Marsch": "马希", "Fuente": "德拉富恩特", "Hašek": "哈谢克"
};

export const translatePlayer = (name: string): string => {
  if (!name) return "";
  if (PLAYER_DICTIONARY[name]) {
    return PLAYER_DICTIONARY[name];
  }
  
  const parts = name.split(". ");
  if (parts.length === 2) {
    const initial = parts[0];
    const lastName = parts[1];
    const initialZh = FIRST_INITIAL_TRANSLATIONS[initial] || initial;
    const lastNameZh = LAST_NAME_TRANSLATIONS[lastName] || lastName;
    return `${initialZh}·${lastNameZh}`;
  }

  const spaceParts = name.split(" ");
  if (spaceParts.length === 2) {
    const firstName = spaceParts[0];
    const lastName = spaceParts[1];
    const firstZh = FIRST_INITIAL_TRANSLATIONS[firstName.charAt(0)] || firstName;
    const lastZh = LAST_NAME_TRANSLATIONS[lastName] || lastName;
    return `${firstZh}·${lastZh}`;
  }
  
  return name;
};
