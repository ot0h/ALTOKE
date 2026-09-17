import { CustomButton, CustomInput } from '@components'
import { RootStackParamList } from '@navigation/StackNavigator'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { JSX, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import FixyLogin from '@assets/FIXYLOGIN.svg'
import { useAppDispatch } from '../store/hook'
import { updateProfile } from '../store/slices/userProfileSlice'
import { authService, userProfileService } from '../services'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>

export const Login = ({ navigation }: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()

  const handleLogin = async () => {
    if (loading) return
    setLoading(true)

    try {
      const user = await authService.signIn(email, password)
      if (!user) throw new Error('No se pudo iniciar sesión')

      const profile = await userProfileService.fetchProfile(user.id)

      dispatch(updateProfile(profile))
      navigation.navigate('MainTabs', { email: profile.email })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al iniciar sesión'
      Alert.alert('Error', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <FixyLogin style={styles.fixy} width={248} height={248} />

          <View style={styles.card}>
            <Text
              style={[
                {
                  fontFamily: 'MontserratAlternates_800ExtraBold',
                  fontSize: 32,
                  color: colors.text,
                },
              ]}
            >
              Iniciar Sesion
            </Text>

            <View style={styles.containerInputs}>
              <CustomInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                variant="email"
              />
              <CustomInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                variant="password"
              />
            </View>
            <View style={{ width: 272 }}>
              <CustomButton
                text="Iniciar Sesión"
                onPress={handleLogin}
                variant="primary"
              />
            </View>

            <Text
              style={[
                {
                  color: colors.primary,
                  fontSize: 11,
                  fontFamily: 'MontserratAlternates_400Regular',
                },
              ]}
            >
              Olvide mi contraseña
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.primary,
    },

    container: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      margin: 0,
      gap: 0,
    },

    card: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      width: 352,
      height: 356,
      borderRadius: 35,
      backgroundColor: colors.surface,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.25,
      shadowRadius: 18,
      elevation: 8,
      marginBottom: '25%',
    },

  containerInputs: {
    display: 'flex',
    gap: 25,
  },

  textFont: {
    fontFamily: 'MontserratAlternates_600SemiBold',
  },

  fixy: {
    position: 'relative',
    top: 32,
    alignSelf: 'center',
    zIndex: 20,
    margin: 0,
  },
})
