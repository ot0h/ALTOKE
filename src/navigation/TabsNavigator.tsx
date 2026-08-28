import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useRoute, RouteProp } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { RootStackParamList } from './StackNavigator'
import { Inicio, Notificaciones, Perfil, Reportes } from '@tabs'

export type TabsParamList = {
  Inicio: { email: string }
  Notificasiones: undefined
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
        animation: 'fade',
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline'

          switch (route.name) {
            case 'Inicio':
              iconName = focused ? 'home' : 'home-outline'
              break
            case 'Notificasiones':
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
          display: 'flex',
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          borderRadius: 24,
          width: 344,
          height: 72,
          marginBottom: 20,
          backgroundColor: '#F8FAFC',
          borderColor: '#0145EA',
          borderWidth: 1,
          justifyContent: 'space-between',
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: 'Inter_500Medium',
          fontWeight: '500',
          textAlign: 'center',
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          height: '50%',
        },
      })}
    >
      <Tab.Screen name="Inicio" component={Inicio} initialParams={{ email }} />
      <Tab.Screen name="Notificasiones" component={Notificaciones} />
      <Tab.Screen name="Reportes" component={Reportes} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  )
}
