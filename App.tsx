import { Montserrat_400Regular } from '@expo-google-fonts/montserrat'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

export default function App() {
  useFonts({ Montserrat_400Regular })
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
    fontFamily: 'Montserrat_400Regular',
    fontWeight: '700',
    fontStyle: 'normal',
    fontSize: 30,
  },
})
