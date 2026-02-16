import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'tenezlight': require('./assets/fonts/tenez light.ttf'),
          'tenez': require('./assets/fonts/tenez.ttf'),
          'CoFoRaffine': require('./assets/fonts/CoFo Raffine.ttf'),
          'CoFoRaffineBold': require('./assets/fonts/CoFo Raffine Bold.ttf'),
          'CoFoRaffineThin': require('./assets/fonts/CoFo Raffine Thin.ttf'),
          'CoFoRaffineMedium': require('./assets/fonts/CoFo Raffine Medium.ttf'),
        });
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // useEffect(() => {
  //   async function prepare() {
  //     try {
  //       // Load fonts
  //       await Font.loadAsync({
  //         'tenezlight': require('./assets/fonts/tenez light.ttf'),
  //         'tenez': require('./assets/fonts/tenez.ttf'),
  //         'CoFoRaffine': require('./assets/fonts/CoFo Raffine.ttf'),
  //         'CoFoRaffineBold': require('./assets/fonts/CoFo Raffine Bold.ttf'),
  //         'CoFoRaffineThin': require('./assets/fonts/CoFo Raffine Thin.ttf'),
  //         'CoFoRaffineMedium': require('./assets/fonts/CoFo Raffine Medium.ttf'),
  //       });

  //       // Check if fonts are loaded
  //       const fontNames = await Font.isLoaded('CoFoRaffine');
  //       console.log('CoFoRaffine loaded:', fontNames);

  //     } catch (e) {
  //       console.warn('Error loading fonts:', e);
  //     } finally {
  //       setAppIsReady(true);
  //       await SplashScreen.hideAsync();
  //     }
  //   }

  //   prepare();
  // }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}