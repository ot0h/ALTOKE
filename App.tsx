import {
  MontserratAlternates_400Regular,
  MontserratAlternates_600SemiBold,
} from '@expo-google-fonts/montserrat-alternates'
import { StackNavigator } from '@navigation/StackNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { JSX, useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'

export default function App(): JSX.Element | null {
  const [loaded, error] = useFonts({
    MontserratAlternates_400Regular,
    MontserratAlternates_600SemiBold,
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  )
}
