import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function LiquidBackground() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  // Shared values for floating/breathing animations of blobs
  const scale1 = useSharedValue(1);
  const tx1 = useSharedValue(0);
  const ty1 = useSharedValue(0);

  const scale2 = useSharedValue(1);
  const tx2 = useSharedValue(0);
  const ty2 = useSharedValue(0);

  const scale3 = useSharedValue(1);
  const tx3 = useSharedValue(0);
  const ty3 = useSharedValue(0);

  useEffect(() => {
    // Blob 1: Pink/Strawberry
    scale1.value = withRepeat(withTiming(1.25, { duration: 6000 }), -1, true);
    tx1.value = withRepeat(withTiming(SCREEN_WIDTH * 0.15, { duration: 8000 }), -1, true);
    ty1.value = withRepeat(withTiming(SCREEN_HEIGHT * 0.08, { duration: 9000 }), -1, true);

    // Blob 2: Mint/Cotton candy Blue
    scale2.value = withRepeat(withDelay(800, withTiming(1.3, { duration: 7500 })), -1, true);
    tx2.value = withRepeat(withTiming(-SCREEN_WIDTH * 0.2, { duration: 8500 }), -1, true);
    ty2.value = withRepeat(withTiming(-SCREEN_HEIGHT * 0.12, { duration: 7500 }), -1, true);

    // Blob 3: Lavender Purple / Orange
    scale3.value = withRepeat(withDelay(1500, withTiming(1.2, { duration: 7000 })), -1, true);
    tx3.value = withRepeat(withTiming(SCREEN_WIDTH * 0.08, { duration: 9500 }), -1, true);
    ty3.value = withRepeat(withTiming(SCREEN_HEIGHT * 0.15, { duration: 8500 }), -1, true);
  }, []);

  const animatedBlob1 = useAnimatedStyle(() => ({
    transform: [{ translateX: tx1.value }, { translateY: ty1.value }, { scale: scale1.value }],
  }));

  const animatedBlob2 = useAnimatedStyle(() => ({
    transform: [{ translateX: tx2.value }, { translateY: ty2.value }, { scale: scale2.value }],
  }));

  const animatedBlob3 = useAnimatedStyle(() => ({
    transform: [{ translateX: tx3.value }, { translateY: ty3.value }, { scale: scale3.value }],
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background, zIndex: -10, overflow: 'hidden' }]}>
      {/* Blob 1 - Top Right Pink */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: SCREEN_WIDTH * 0.8,
            height: SCREEN_WIDTH * 0.8,
            borderRadius: (SCREEN_WIDTH * 0.8) / 2,
            backgroundColor: colors.pink,
            top: -SCREEN_HEIGHT * 0.05,
            right: -SCREEN_WIDTH * 0.15,
            opacity: theme === 'light' ? 0.38 : 0.18,
          },
          animatedBlob1,
        ]}
      />

      {/* Blob 2 - Center Left Blue */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: SCREEN_WIDTH * 0.9,
            height: SCREEN_WIDTH * 0.9,
            borderRadius: (SCREEN_WIDTH * 0.9) / 2,
            backgroundColor: colors.blue,
            top: SCREEN_HEIGHT * 0.25,
            left: -SCREEN_WIDTH * 0.25,
            opacity: theme === 'light' ? 0.35 : 0.16,
          },
          animatedBlob2,
        ]}
      />

      {/* Blob 3 - Bottom Right Purple */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: SCREEN_WIDTH * 0.75,
            height: SCREEN_WIDTH * 0.75,
            borderRadius: (SCREEN_WIDTH * 0.75) / 2,
            backgroundColor: colors.purple,
            bottom: -SCREEN_HEIGHT * 0.05,
            right: -SCREEN_WIDTH * 0.1,
            opacity: theme === 'light' ? 0.32 : 0.15,
          },
          animatedBlob3,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
  },
});
