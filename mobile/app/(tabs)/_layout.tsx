import { Tabs } from 'expo-router';
import { VehicleIcon, GaugeIcon, ClockIcon } from '../../components/icons';
import { TabBarPersonalizada } from '../../components/TabBarPersonalizada';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBarPersonalizada {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <VehicleIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vitals"
        options={{
          tabBarIcon: ({ color }) => <GaugeIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color }) => <ClockIcon size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}