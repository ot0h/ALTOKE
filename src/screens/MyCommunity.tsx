import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import CommunityCard from '../components/CommunityCard'
import Patronato from '@assets/patronato.png'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@navigation/StackNavigator'

type Props = NativeStackScreenProps<RootStackParamList, 'MyCommunity'>

export const MyCommunity = ({ navigation }: Props) => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const onPressCommunity = () => {
    navigation.navigate('CommunityHome', {
      communityId: '1',
    })
  }
  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons size={25} name="arrow-back" color={colors.textSecondary} />
        </Pressable>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Mis Comunidades</Text>
          </View>

          <View style={styles.cards}>
            <CommunityCard
              title="Patronato"
              image={Patronato}
              onPress={onPressCommunity}
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
      marginTop: 52,
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

    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
