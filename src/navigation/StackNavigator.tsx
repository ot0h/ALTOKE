import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Home, Login, Noticia, NuevaNoticia, Register } from '@screens'
import { TabNavigator } from './TabsNavigator'

export type RootStackParamList = {
  Home: undefined
  Login: undefined
  Noticia: undefined
  NuevaNoticia: undefined
  Register: undefined
  MainTabs: { email: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export const StackNavigator = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={NuevaNoticia} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Noticia" component={Noticia} />
        <Stack.Screen name="NuevaNoticia" component={NuevaNoticia} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </>
  )
}
