import { CustomButton, CustomInput } from '@components'
import { RootStackParamList } from '@navigation/StackNavigator'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { JSX, useState } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import FixyLogin from '@assets/FIXYLOGIN.svg'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { store } from '../store'
import { updateProfile } from '../store/slices/userProfileSlice'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>

export const Login = ({ navigation }: Props): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const storedName = useAppSelector(state => state.userProfile.name)

  const handleLogin = () => {
    const userId = Date.now().toString()

    dispatch(updateProfile({ id: userId, name: storedName, email }))

    console.log('[Redux] useDispatch(updateProfile) -> payload:', {
      id: userId,
      name: storedName,
      email,
    })
    console.log(
      '[Redux] Nuevo estado de userProfile:',
      store.getState().userProfile,
    )

    navigation.navigate('MainTabs', { email })
  }

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={styles.safeArea}
    >
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
                color: '#1E2744',
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
              variant='email'
            />
            <CustomInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              variant='password'
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
                color: '#0145EA',
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0145EA',
  },

  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0145EA',
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
    backgroundColor: '#FFFFFF',
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
