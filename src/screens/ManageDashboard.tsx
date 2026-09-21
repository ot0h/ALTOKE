import { JSX } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ArrowLeft } from 'lucide-react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { RootStackParamList } from '../navigation/StackNavigator'
import { DashboardStats } from '@components'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Props = NativeStackScreenProps<RootStackParamList, 'ManageDashboard'>

export const ManageDashboard = ({ navigation, route }: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()

  const { communityId } = route.params

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color={colors.text} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Dashboard</Text>

            <Text style={styles.subtitle}>Estadísticas de tu comunidad</Text>
          </View>
        </View>

        <DashboardStats communityId={communityId} />
      </View>
    </SafeAreaView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
      gap: 8,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingHorizontal: 20,
      paddingTop: 16,
    },

    backButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerText: {
      flex: 1,
      gap: 2,
    },

    title: {
      fontFamily: 'MontserratAlternates_700Bold',
      fontSize: 22,
      color: colors.text,
    },

    subtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },
  })
