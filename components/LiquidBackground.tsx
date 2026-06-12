import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function LiquidBackground() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  // Shared values for slower, more graceful organic drifts
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
    // Blob 1: Rose Pink Capsule
    scale1.value = withRepeat(withTiming(1.18, { duration: 15000 }), -1, true);
    tx1.value = withRepeat(withTiming(SCREEN_WIDTH * 0.18, { duration: 18000 }), -1, true);
    ty1.value = withRepeat(withTiming(SCREEN_HEIGHT * 0.08, { duration: 22000 }), -1, true);

    // Blob 2: Sky Blue/Teal Capsule
    scale2.value = withRepeat(withDelay(1000, withTiming(1.22, { duration: 17000 })), -1, true);
    tx2.value = withRepeat(withTiming(-SCREEN_WIDTH * 0.22, { duration: 20000 }), -1, true);
    ty2.value = withRepeat(withTiming(-SCREEN_HEIGHT * 0.12, { duration: 19000 }), -1, true);

    // Blob 3: Lilac Purple Capsule
    scale3.value = withRepeat(withDelay(2200, withTiming(1.15, { duration: 16000 })), -1, true);
    tx3.value = withRepeat(withTiming(SCREEN_WIDTH * 0.12, { duration: 21000 }), -1, true);
    ty3.value = withRepeat(withTiming(SCREEN_HEIGHT * 0.14, { duration: 18000 }), -1, true);
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
      {/* Blob 1 - Top Right Pink Organic Capsule */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: SCREEN_WIDTH * 0.9,
            height: SCREEN_HEIGHT * 0.52,
            borderRadius: (SCREEN_WIDTH * 0.9) / 2,
            backgroundColor: theme === 'light' ? '#FFB5C5' : colors.pink,
            top: -SCREEN_HEIGHT * 0.08,
            right: -SCREEN_WIDTH * 0.18,
            opacity: theme === 'light' ? 0.38 : 0.22,
          },
          animatedBlob1,
        ]}
      />

      {/* Blob 2 - Center Left Sky Blue/Teal Organic Capsule */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: SCREEN_WIDTH * 1.0,
            height: SCREEN_HEIGHT * 0.62,
            borderRadius: (SCREEN_WIDTH * 1.0) / 2,
            backgroundColor: theme === 'light' ? '#9FEBE8' : colors.blue,
            top: SCREEN_HEIGHT * 0.18,
            left: -SCREEN_WIDTH * 0.28,
            opacity: theme === 'light' ? 0.35 : 0.22,
          },
          animatedBlob2,
        ]}
      />

      {/* Blob 3 - Bottom Right Soft Lilac Organic Capsule */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: SCREEN_WIDTH * 0.82,
            height: SCREEN_HEIGHT * 0.58,
            borderRadius: (SCREEN_WIDTH * 0.82) / 2,
            backgroundColor: theme === 'light' ? '#E2C3F5' : colors.purple,
            bottom: -SCREEN_HEIGHT * 0.12,
            right: -SCREEN_WIDTH * 0.12,
            opacity: theme === 'light' ? 0.35 : 0.22,
          },
          animatedBlob3,
        ]}
      />

      {/* Heavy BlurView overlay to blend blobs into soft iOS-style liquid wallpaper gradients */}
      <BlurView
        tint={theme === 'light' ? 'light' : 'dark'}
        intensity={Platform.OS === 'ios' ? 75 : 90}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
  },
});
