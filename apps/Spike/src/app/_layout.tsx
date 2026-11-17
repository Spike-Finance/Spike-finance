import '../../global.css'
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    'Figtree-Light': require('../../assets/fonts/Figtree-Light.ttf'),
    'Figtree-Regular': require('../../assets/fonts/Figtree-Regular.ttf'),
    'Figtree-Medium': require('../../assets/fonts/Figtree-Medium.ttf'),
    'Figtree-Bold': require('../../assets/fonts/Figtree-Bold.ttf'),
    'Inter_18pt-Regular': require('../../assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter_18pt-Medium': require('../../assets/fonts/Inter_18pt-Medium.ttf'),
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
