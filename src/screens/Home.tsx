import { JSX } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export const Home = (): JSX.Element => {
  return (
    <View>
      <Text>Hola</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
})
