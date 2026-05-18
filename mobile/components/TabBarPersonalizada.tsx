import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

export function TabBarPersonalizada({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={['bottom']} style={estilos.safe}>
      <View style={estilos.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const ativo = state.index === index;
          const renderIcon = options.tabBarIcon;
          const corIcone = ativo ? colors.text : colors.textMuted;

          const aoPressionar = () => {
            const evento = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!ativo && !evento.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={aoPressionar}
              accessibilityRole="button"
              accessibilityState={ativo ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              hitSlop={8}
              style={({ pressed }) => [estilos.tab, pressed && estilos.tabPressionado]}
            >
              {renderIcon
                ? renderIcon({ color: corIcone, focused: ativo, size: 26 })
                : null}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -2,
    backgroundColor: colors.bg,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: spacing[2],
    paddingBottom: spacing[1],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPressionado: {
    opacity: 0.6,
  },
});