import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Home, Login, NuevaNoticia, Register } from '@screens'
import { TabNavigator } from './TabsNavigator'
import { DashboardStats } from '../components/dashboard/DashboardStats'
import { MyCommunity } from '../screens/MyCommunity'
import { ManageCommunity } from '../screens/ManageCommunity'
import { MyProfile } from '../screens/tabs/MyProfile'
import { ReportProblem } from '../screens/tabs/Reportar_Problema'

export type RootStackParamList = {
  Home: undefined
  Login: undefined
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
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="NuevaNoticia" component={NuevaNoticia} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </>
  )
}
