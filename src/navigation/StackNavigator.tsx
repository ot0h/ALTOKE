import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Home, Login, Register } from '@screens'

export type RootStackParamList = {
  Home: undefined
  Login: undefined
  Register: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export const StackNavigator = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </>
  )
}
