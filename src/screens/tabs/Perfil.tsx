import { JSX } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export const Perfil = (): JSX.Element => {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.center}>
        <Text>Este seria el de Perfil</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
}
