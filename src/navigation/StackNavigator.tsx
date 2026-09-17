import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Home, Login, NuevaNoticia, Register } from '@screens'
import { TabNavigator } from './TabsNavigator'
import { MyCommunity } from '../screens/MyCommunity'
import { ManageCommunity } from '../screens/ManageCommunity'
import { MyProfile } from '../screens/tabs/MyProfile'
import { ReportProblem } from '../screens/tabs/Reportar_Problema'
import { CommunityHome } from '../screens/CommunityHome'
import { NuevaComunidad } from '../screens/NuevaComunidad'
import { Forum } from '../screens/Forum'
import { NuevaPublicacion } from '../screens/NuevaPublicacion'
import { ManageNotices } from '../screens/ManageNotice'
import { Noticia } from '../screens/Noticia'

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
  Forum: {communityId: string}
  NuevaPublicacion: {communityId: string}
  ManageNotice: {communityId: string}
  Noticia: {noticeId: string}
  
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
        <Stack.Screen name="Forum" component={Forum}/>
        <Stack.Screen name="NuevaPublicacion" component={NuevaPublicacion}/>
        <Stack.Screen name="ManageNotice" component={ManageNotices}/>
        <Stack.Screen name="Noticia" component={Noticia}/>
      </Stack.Navigator>
    </>
  )
}
