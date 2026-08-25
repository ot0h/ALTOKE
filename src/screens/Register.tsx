  import { CustomButton, CustomInput } from '@components'
  import { RootStackParamList } from '@navigation/StackNavigator'
  import { NativeStackScreenProps } from '@react-navigation/native-stack'
  import { JSX, useState } from 'react'
  import { View, Text, StyleSheet } from 'react-native'
  import FixyLogin from '@assets/FIXYLOGIN.svg'

  type Props = NativeStackScreenProps<RootStackParamList, 'Register'>

  export const Register = ({navigation}: Props): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState ('')
  const handleRegister = () => navigation.navigate('Login')
  
  return (
    <View style={styles.container}>
      <FixyLogin style={styles.fixy} width={248} height={248} />

      <View style={styles.card}>
        <Text
          style={[
            {
              fontFamily: 'MontserratAlternates_800ExtraBold',
              fontSize: 32,
              color: '#1E2744',
              paddingTop: 25,
            },
          ]}
        >
        Registrarse
        </Text>

        <View style={styles.containerInputs}>
          <CustomInput
            placeholder='Nombre'
            value = {name}
            onChangeText= {setName}          
          />
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <CustomInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <CustomButton
          text="Registrarse"
          onPress={handleRegister}
          variant="primary"
        />

        <Text
          style={[
            {
              color: '#0145EA',
              fontSize: 11,
              fontFamily: 'MontserratAlternates_400Regular',
            },
          ]}
        >
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
    height: 390,
    marginTop: +40,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },

  containerInputs: {
    display: 'flex',
    gap: 25,
    
  },

  textFont: {
    fontFamily: 'MontserratAlternates_600SemiBold',
    
  },

  fixy: {
    position: 'absolute',
    top: 28,
    alignSelf: 'center',
    zIndex: 20,
    margin: 0,
  },
})
