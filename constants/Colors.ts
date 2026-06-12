const tintColorLight = '#FF6B8B'; // Vivid strawberry pink for light mode
const tintColorDark = '#FF8DA1';  // Bright pastel coral-pink for dark mode

export const Colors = {
  light: {
    text: '#0F172A',            // Deep slate-charcoal (very high contrast, extremely readable)
    textSecondary: '#475569',   // Mid slate for subtitles and captions
    background: '#F8FAFC',      // Soft, clean iOS-style slate-white background
    cardBackground: 'rgba(255, 255, 255, 0.65)', // Frosted white glassmorphic card transparency
    tint: tintColorLight,
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    accent: tintColorLight,
    border: 'rgba(15, 23, 42, 0.08)', // Very subtle dark boundary line
    gold: '#D97706',            // Warm golden amber for trophies/ranks (readable on light backdrop)
    
    // Soft iOS pastel accents for gradients/tabs
    pink: '#FFAEBC',            // Pastel strawberry
    green: '#B4F8C8',           // Pastel mint
    blue: '#A0E7E5',            // Pastel sky blue
    purple: '#E0BBE4',          // Pastel lavender
    orange: '#FBE7C6',          // Pastel cream orange
  },
  dark: {
    text: '#F1F5F9',            // Off-white for dark mode readability
    textSecondary: '#94A3B8',   // Soft muted slate
    background: '#0A0E17',      // Deep dark navy base
    cardBackground: 'rgba(21, 29, 45, 0.7)', // Dark glass transparency
    tint: tintColorDark,
    icon: '#64748B',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
    accent: tintColorDark,
    border: 'rgba(255, 255, 255, 0.08)', // Soft dark border reflection
    gold: '#FFE066',
    
    // Macaron Pastel accents for dark mode
    pink: '#FF8DA1',
    green: '#A7F3D0',
    blue: '#93C5FD',
    purple: '#C4B5FD',
    orange: '#FDBA74',
  },
};

export default Colors;
