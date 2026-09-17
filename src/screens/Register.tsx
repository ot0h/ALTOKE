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
import { authService } from '../services'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>

export const Register = ({ navigation }: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (loading) return
    setLoading(true)

    try {
      const user = await authService.signUp({ email, password, name })
      if (!user) throw new Error('No se pudo crear la cuenta')

      Alert.alert('Éxito', 'Cuenta creada. Ahora inicia sesión.')
      navigation.navigate('Login')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al registrarse'
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
                  paddingTop: 25,
                },
              ]}
            >
              Registrarse
            </Text>

            <View style={styles.containerInputs}>
              <CustomInput
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
              />
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
                text="Registrarse"
                onPress={handleRegister}
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
            ></Text>
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
      height: 390,
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
