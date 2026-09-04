import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Home, Login, Register } from '@screens'
import { TabNavigator } from './TabsNavigator'
import { DashboardStats } from '../components/dashboard/DashboardStats'

export type RootStackParamList = {
  Home: undefined
  Login: undefined
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
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </>
  )
}
