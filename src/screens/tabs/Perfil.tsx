import { JSX } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

export const Perfil = (): JSX.Element => {
  const { colors } = useTheme()
  const styles = {
    safeArea: { flex: 1, backgroundColor: colors.background },
    center: {
      flex: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
  }
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.center}>
        <Text style={{ color: colors.text }}>Este seria el de Perfil</Text>
      </View>
    </SafeAreaView>
  )
}
