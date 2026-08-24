import { MontserratAlternates_400Regular } from '@expo-google-fonts/montserrat-alternates'
import { StackNavigator } from '@navigation/StackNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { JSX } from 'react'

export default function App(): JSX.Element {
  useFonts({ MontserratAlternates_400Regular })
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  )
}
