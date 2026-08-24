import { MontserratAlternates_400Regular } from '@expo-google-fonts/montserrat-alternates'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

export default function App() {
  useFonts({ MontserratAlternates_400Regular })
  return (
    <View style={styles.container}>
      <Text style={styles.text}>El dizque font</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'MontserratAlternates_400Regular',
    fontWeight: '700',
    fontStyle: 'normal',
    fontSize: 30,
  },
})
