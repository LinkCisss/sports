const tintColorLight = '#FF6B8B'; // Sweet strawberry pink
const tintColorDark = '#FF8DA1';  // Bright pastel coral-pink

export const Colors = {
  light: {
    text: '#2C3E50',            // Deep slate-charcoal for text
    textSecondary: '#7A8C9E',   // Warm soft slate for captions
    background: '#FAF8F5',      // Creamy off-white base
    cardBackground: 'rgba(255, 255, 255, 0.75)', // High translucency glass
    tint: tintColorLight,
    icon: '#A0B2C6',
    tabIconDefault: '#A0B2C6',
    tabIconSelected: tintColorLight,
    accent: tintColorLight,
    border: 'rgba(255, 255, 255, 0.5)', // Extremely subtle white glass border
    gold: '#FFD166',            // Soft pastel gold
    
    // Macaron Pastel accents (Light Mode)
    pink: '#FFD3D6',
    green: '#E2F8DD',
    blue: '#D3E2FF',
    purple: '#E7E2FF',
    orange: '#FFEBD3',
  },
  dark: {
    text: '#F1F5F9',            // Off-white for dark mode readability
    textSecondary: '#94A3B8',   // Soft muted slate
    background: '#0B0F19',      // Deep dark navy base
    cardBackground: 'rgba(21, 29, 45, 0.7)', // Dark glass transparency
    tint: tintColorDark,
    icon: '#64748B',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
    accent: tintColorDark,
    border: 'rgba(255, 255, 255, 0.08)', // Soft dark border reflection
    gold: '#FFE066',
    
    // Macaron Pastel accents (Dark Mode)
    pink: '#FF8DA1',
    green: '#A7F3D0',
    blue: '#93C5FD',
    purple: '#C4B5FD',
    orange: '#FDBA74',
  },
};

export default Colors;
