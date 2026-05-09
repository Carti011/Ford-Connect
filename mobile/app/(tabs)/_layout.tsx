import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { VehicleIcon, BoltIcon, WrenchIcon } from '../../components/icons';
import { colors } from '../../constants/colors';
import { layout } from '../../constants/layout';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: false,
        tabBarStyle: estilos.tabBar,
        tabBarBackground: () => (
          <LinearGradient
            colors={['transparent', colors.bg]}
            locations={[0, 0.4]}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <VehicleIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          tabBarIcon: ({ color }) => <BoltIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color }) => <WrenchIcon size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

const estilos = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: layout.tabbarHeight,
  },
});
