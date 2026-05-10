import React, { useRef } from 'react';
import { View, Text, Animated, PanResponder, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { PowerIcon, CaretIcon } from './icons';

const HANDLE_SIZE = 64;

interface Props {
  onComplete?: () => void;
}

export function SlideToStart({ onComplete }: Props) {
  const trackWidth = useRef(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => {
      const maxX = trackWidth.current - HANDLE_SIZE;
      const newX = Math.max(0, Math.min(g.dx, maxX));
      translateX.setValue(newX);
    },
    onPanResponderRelease: (_, g) => {
      const maxX = trackWidth.current - HANDLE_SIZE;
      if (g.dx >= maxX * 0.8) {
        Animated.timing(translateX, { toValue: maxX, duration: 100, useNativeDriver: true }).start(() => {
          onComplete?.();
          Animated.timing(translateX, { toValue: 0, duration: 300, useNativeDriver: true }).start();
        });
      } else {
        Animated.timing(translateX, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      }
    },
  });

  return (
    <View
      style={estilos.track}
      onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}
    >
      <Text style={estilos.label}>Deslize para dar partida</Text>
      <View style={estilos.caret}>
        <CaretIcon size={14} color={colors.textMuted} />
      </View>

      <Animated.View
        style={[estilos.handle, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <PowerIcon size={24} color={colors.text} />
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  track: {
    height: HANDLE_SIZE,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  label: {
    flex: 1,
    paddingLeft: HANDLE_SIZE + spacing[4],
    fontSize: typography.size.base,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  caret: {
    width: 38,
    height: 38,
    marginRight: spacing[3],
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    position: 'absolute',
    left: 0,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: colors.surfaceHi,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
