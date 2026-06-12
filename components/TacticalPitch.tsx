import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { translatePlayer } from '@/utils/translate';

interface Player {
  name: string;
  number: number;
  position: 'GK' | 'DF' | 'MF' | 'FW';
}

interface TacticalPitchProps {
  homeStartingXI: Player[];
  homeFormation: string;
  homeColors: string[];
  awayStartingXI: Player[];
  awayFormation: string;
  awayColors: string[];
  isZh: boolean;
}

interface PlayerPositioned extends Player {
  x: number;
  y: number;
}

export function TacticalPitch({
  homeStartingXI,
  homeFormation,
  homeColors,
  awayStartingXI,
  awayFormation,
  awayColors,
  isZh,
}: TacticalPitchProps) {
  
  function getPositions(startingXI: Player[], formation: string, isAway: boolean) {
    const gks = startingXI.filter(p => p.position === 'GK');
    const dfs = startingXI.filter(p => p.position === 'DF');
    const mfs = startingXI.filter(p => p.position === 'MF');
    const fws = startingXI.filter(p => p.position === 'FW');

    const positioned: PlayerPositioned[] = [];

    // GK
    if (gks.length > 0) {
      positioned.push({ ...gks[0], x: 50, y: isAway ? 93 : 7 });
    }

    // DF
    const dfCount = dfs.length;
    dfs.forEach((p, idx) => {
      const rawX = dfCount === 1 ? 50 : 12 + idx * (76 / (dfCount - 1));
      const x = isAway ? 100 - rawX : rawX;
      const y = isAway ? 81 : 19;
      positioned.push({ ...p, x, y });
    });

    // MF
    const mfCount = mfs.length;
    mfs.forEach((p, idx) => {
      let rawX = 50;
      let y = isAway ? 68 : 32;
      if (formation === '4-2-3-1' && mfCount === 5) {
        if (idx < 2) {
          y = isAway ? 72 : 28;
          rawX = idx === 0 ? 33 : 67;
        } else {
          y = isAway ? 60 : 40;
          rawX = idx === 2 ? 18 : idx === 3 ? 50 : 82;
        }
      } else {
        rawX = mfCount === 1 ? 50 : 15 + idx * (70 / (mfCount - 1));
      }
      const x = isAway ? 100 - rawX : rawX;
      positioned.push({ ...p, x, y });
    });

    // FW
    const fwCount = fws.length;
    fws.forEach((p, idx) => {
      const rawX = fwCount === 1 ? 50 : 22 + idx * (56 / (fwCount - 1));
      const x = isAway ? 100 - rawX : rawX;
      const y = isAway ? 53 : 47;
      positioned.push({ ...p, x, y });
    });

    return positioned;
  }

  const homePositions = getPositions(homeStartingXI, homeFormation, false);
  const awayPositions = getPositions(awayStartingXI, awayFormation, true);

  const homePrimary = homeColors[0] || '#3A86FF';
  const homeSecondary = homeColors[1] || '#FFFFFF';

  const awayPrimary = awayColors[0] || '#FF3B5C';
  const awaySecondary = awayColors[1] || '#FFFFFF';

  return (
    <View style={styles.pitchOuter}>
      <View style={styles.pitchContainer}>
        {/* Pitch Field Lines */}
        <View style={styles.borderLine} />
        <View style={styles.centerLine} />
        <View style={styles.centerCircle} />
        <View style={styles.centerDot} />

        {/* Penalty Area Top */}
        <View style={styles.penaltyAreaTop} />
        <View style={styles.goalAreaTop} />
        
        {/* Penalty Area Bottom */}
        <View style={styles.penaltyAreaBottom} />
        <View style={styles.goalAreaBottom} />

        {/* Home Player Nodes */}
        {homePositions.map((player) => (
          <View 
            key={`home-${player.number}`} 
            style={[
              styles.playerWrapper, 
              { left: `${player.x}%`, bottom: `${player.y}%` }
            ]}
          >
            <View style={[styles.jerseyCircle, { backgroundColor: homePrimary, borderColor: homeSecondary }]}>
              <Text style={[styles.jerseyNumber, { color: homePrimary === '#FFFFFF' ? '#000' : '#FFF' }]}>
                {player.number}
              </Text>
            </View>
            <View style={styles.playerNameBg}>
              <Text style={styles.playerName} numberOfLines={1}>
                {isZh ? translatePlayer(player.name) : player.name}
              </Text>
            </View>
          </View>
        ))}

        {/* Away Player Nodes */}
        {awayPositions.map((player) => (
          <View 
            key={`away-${player.number}`} 
            style={[
              styles.playerWrapper, 
              { left: `${player.x}%`, bottom: `${player.y}%` }
            ]}
          >
            <View style={[styles.jerseyCircle, { backgroundColor: awayPrimary, borderColor: awaySecondary }]}>
              <Text style={[styles.jerseyNumber, { color: awayPrimary === '#FFFFFF' ? '#000' : '#FFF' }]}>
                {player.number}
              </Text>
            </View>
            <View style={styles.playerNameBg}>
              <Text style={styles.playerName} numberOfLines={1}>
                {isZh ? translatePlayer(player.name) : player.name}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pitchOuter: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#1B4332',
  },
  pitchContainer: {
    height: 380,
    width: '100%',
    position: 'relative',
  },
  borderLine: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  centerLine: {
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    transform: [{ translateX: -33 }, { translateY: -33 }],
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  penaltyAreaTop: {
    position: 'absolute',
    top: 10,
    left: '22%',
    right: '22%',
    height: 52,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  goalAreaTop: {
    position: 'absolute',
    top: 10,
    left: '38%',
    right: '38%',
    height: 18,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  penaltyAreaBottom: {
    position: 'absolute',
    bottom: 10,
    left: '22%',
    right: '22%',
    height: 52,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  goalAreaBottom: {
    position: 'absolute',
    bottom: 10,
    left: '38%',
    right: '38%',
    height: 18,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playerWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 50,
    marginLeft: -30,
    marginBottom: -25,
  },
  jerseyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
  },
  jerseyNumber: {
    fontSize: 8,
    fontWeight: '800',
  },
  playerNameBg: {
    marginTop: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    maxWidth: 58,
  },
  playerName: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
