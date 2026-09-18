import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Home, Login, NuevaNoticia, Register } from '@screens'
import { TabNavigator } from './TabsNavigator'
import { MyCommunity } from '../screens/MyCommunity'
import { ManageCommunity } from '../screens/ManageCommunity'
import { ManageNotices } from '../screens/ManageNotice'
import { ManageDashboard } from '../screens/ManageDashboard'
import { Members } from '../screens/Members'
import { Noticia } from '../screens/Noticia'
import { MyProfile } from '../screens/tabs/MyProfile'
import { ReportProblem } from '../screens/tabs/Reportar_Problema'
import { CommunityHome } from '../screens/CommunityHome'
import { NuevaComunidad } from '../screens/NuevaComunidad'
import { Forum } from '../screens/Forum'
import { NuevaPublicacion } from '../screens/NuevaPublicacion'

export type RootStackParamList = {
  Home: undefined
  Login: undefined
  NuevaNoticia: {communityId: string}
  Register: undefined
  MainTabs: { email: string }
  MyCommunity: undefined
  CommunityHome: {communityId: string}
  ReportProblem: {communityId: string}
  NuevaComunidad: undefined
  ManageCommunity: {communityId: string}
  ManageNotices: {communityId: string}
  ManageDashboard: {communityId: string}
  Members: {communityId: string}
  Noticia: {noticeId: string}
  Forum: {communityId: string}
  NuevaPublicacion: {communityId: string}
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
        <Stack.Screen name="MyCommunity" component={MyCommunity} />
        <Stack.Screen name="CommunityHome" component={CommunityHome} />        
        <Stack.Screen name="ReportProblem" component={ReportProblem} />
        <Stack.Screen name="NuevaComunidad" component={NuevaComunidad} />
        <Stack.Screen name="ManageCommunity" component={ManageCommunity}/>
        <Stack.Screen name="ManageNotices" component={ManageNotices} />
        <Stack.Screen name="ManageDashboard" component={ManageDashboard} />
        <Stack.Screen name="Members" component={Members} />
        <Stack.Screen name="Noticia" component={Noticia} />
        <Stack.Screen name="Forum" component={Forum}/>
        <Stack.Screen name="NuevaPublicacion" component={NuevaPublicacion}/>
      </Stack.Navigator>
    </>
  )
}
