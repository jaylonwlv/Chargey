import { router } from 'expo-router';
import Tabs from 'expo-router/js-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import { Onboarding } from '../components/Onboarding';
import { ChargeyProvider, useChargey } from '../lib/store';
import { colors } from '../lib/theme';

function icon(emoji: string) {
  return ({ focused }: { focused: boolean }) => <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>;
}

function AppTabs() {
  const { onboarded, finishOnboarding } = useChargey();
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.slime,
          tabBarInactiveTintColor: colors.faint,
          tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.card },
          tabBarLabelStyle: { fontFamily: 'ui-rounded', fontWeight: '800' },
          sceneStyle: { backgroundColor: colors.bg },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'home', tabBarIcon: icon('⚡️') }} />
        <Tabs.Screen name="sounds" options={{ title: 'sounds', tabBarIcon: icon('🔊') }} />
        <Tabs.Screen name="setup" options={{ title: 'setup', tabBarIcon: icon('🛠️') }} />
        <Tabs.Screen name="drip" options={{ title: 'drip', tabBarIcon: icon('💧') }} />
      </Tabs>
      <Onboarding
        visible={!onboarded}
        onFinish={() => {
          finishOnboarding();
          router.navigate('/setup');
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ChargeyProvider>
      <AppTabs />
    </ChargeyProvider>
  );
}
