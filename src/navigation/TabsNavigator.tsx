import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useRoute, RouteProp } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { RootStackParamList } from './StackNavigator'
import { Inicio, Notificaciones, Perfil, Reportes } from '@tabs'
import { MyProfile } from '../screens/tabs/MyProfile'
import { VerNoticias } from '../screens/tabs/VerNoticias'

export type TabsParamList = {
  Inicio: { email: string }
  Noticia: undefined
  Reportes: undefined
  Perfil: undefined
}

const Tab = createBottomTabNavigator<TabsParamList>()

export const TabNavigator = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'MainTabs'>>()
  const { email } = route.params

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        animation: 'shift',
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline'

          switch (route.name) {
            case 'Inicio':
              iconName = focused ? 'home' : 'home-outline'
              break
            case 'Noticia':
              iconName = focused ? 'notifications' : 'notifications-outline'
              break
            case 'Reportes':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline'
              break
            case 'Perfil':
              iconName = focused ? 'person' : 'person-outline'
              break
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#0145EA',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarPosition: 'bottom',
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 28,
          marginHorizontal: 20,
          height: 64,

          borderRadius: 26,
          borderWidth: 1,
          borderColor: '#0145EA',
          backgroundColor: '#F8FAFC',

          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 8,
        },
        tabBarItemStyle: {
          height: 64,
          paddingVertical: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
      })}
    >
      <Tab.Screen name="Inicio" component={Inicio} initialParams={{ email }} />
      <Tab.Screen name="Noticia" component={VerNoticias} />
      <Tab.Screen name="Reportes" component={Reportes} />
      <Tab.Screen name="Perfil" component={MyProfile} />
    </Tab.Navigator>
  )
}

