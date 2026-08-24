import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Home } from '@screens'

export type RootStackParamList = {
  Home: undefined
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
      </Stack.Navigator>
    </>
  )
}
