import { View, Text, StyleSheet, ScrollView } from 'react-native'
import CommunityCard from '../components/CommunityCard'
import Patronato from '@assets/patronato.png'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CustomButton } from '@components'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

export const ManageCommunity = () => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.topsection}>
            <Text style={styles.title}>Gestionar Comunidades</Text>
            <View style={styles.createsection}>
              <Text style={styles.description}>
                En esta seccion puedes administrar tus comunidades
              </Text>

              <View style={styles.button}>
                <CustomButton
                  text="Crear Nueva"
                  onPress={() => {}}
                  variant="secondary"
                />
              </View>
            </View>
          </View>

          <View style={styles.cards}>
            <CommunityCard
              title="Patronato"
              image={Patronato}
              onPress={() => {}}
              description="Patronato Vecinal"
              variant="extended"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safearea: {
      flex: 1,
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },

    container: {
      marginTop: 40,
      gap: 52.5,
      width: 362,
    },
    title: {
      fontFamily: 'MontserratAlternates_700Bold_Italic',
      fontWeight: 'bold',
      fontSize: 22,
      color: colors.text,
    },
    cards: {
      width: '100%',
      gap: 16,
    },

    createsection: {
      flexDirection: 'row',
      gap: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    description: {
      fontFamily: 'MontserratAlternates_400Regular',
      fontWeight: 'regular',
      fontSize: 12,
      textAlign: 'left',
      width: 172,
      color: colors.textSecondary,
    },
    button: {
      width: 154,
      marginRight: 2,
    },
    topsection: {
      gap: 20,
    },
  })
