import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { CustomButton } from '@components'
import ProfileAvatar from '../../components/ProfileAvatar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { updateProfile } from '../../store/slices/userProfileSlice'
import { setCommunities } from '../../store/slices/communitySlice'
import { setReports } from '../../store/slices/reportSlice'
import { setPosts } from '../../store/slices/postSlice'
import { updateMemberShip } from '../../store/slices/memberShipSlice'
import {
  authService,
  avatarService,
  communityService,
  membershipService,
  userProfileService,
} from '../../services'
import { updateAvatar } from '../../store/slices/userProfileSlice'
import * as ImagePicker from 'expo-image-picker'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import SettingsModal from '../modals/SettingsModal'
import { useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/StackNavigator'
import { MemberShip } from '../../types'

type MyCommunity = {
  id: string
  name: string
  role: 'Administrador' | 'Miembro'
}

export const MyProfile = () => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const insets = useSafeAreaInsets()

  const dispatch = useAppDispatch()
  const isFocused = useIsFocused()

  const userName = useAppSelector((state) => state.userProfile.name)
  const userEmail = useAppSelector((state) => state.userProfile.email)
  const userId = useAppSelector((state) => state.userProfile.id)
  const avatar = useAppSelector((state) => state.userProfile.avatar)

  const [myCommunities, setMyCommunities] = useState<MyCommunity[]>([])
  const [settingsVisible, setSettingsVisible] = useState(false)

  useEffect(() => {
    if (!userId || !isFocused) return

    const loadCommunities = async () => {
      try {
        const [allCommunities, owned, memberships] = await Promise.all([
          communityService.fetchCommunities(),
          communityService.fetchCommunities(userId),
          membershipService.fetchMemberships(userId),
        ])

        const nameMap = new Map(
          allCommunities.map((community) => [community.id, community.name]),
        )

        const byId = new Map<string, 'Administrador' | 'Miembro'>()

        owned.forEach((community) => byId.set(community.id, 'Administrador'))

        memberships.forEach((membership: MemberShip) =>
          byId.set(
            membership.communityId,
            membership.role === 'admin' ? 'Administrador' : 'Miembro',
          ),
        )

        setMyCommunities(
          Array.from(byId.entries()).map(([id, role]) => ({
            id,
            name: nameMap.get(id) ?? 'Comunidad',
            role,
          })),
        )
      } catch (error) {
        console.error('[MyProfile] Error cargando comunidades:', error)
      }
    }

    loadCommunities()
  }, [userId, isFocused])

  const cambiarFoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!permission.granted) {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a tus fotos para cambiar la imagen de perfil.',
        )
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        selectionLimit: 1,
        allowsMultipleSelection: false,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      })

      if (result.canceled || !result.assets[0]) return

      const uri = result.assets[0].uri

      if (!userId) return

      const url = await avatarService.uploadAvatar(userId, uri)
      await userProfileService.updateProfile(userId, { avatar: url })
      dispatch(updateAvatar(url))
    } catch (error) {
      console.error('[MyProfile] Error al cambiar la foto:', error)
      Alert.alert('Error', 'No se pudo actualizar la foto de perfil.')
    }
  }

  const cerrarSesion = async () => {
    try {
      await authService.signOut()

      dispatch(updateProfile({ id: '', name: '', email: '', avatar: '' }))
      dispatch(setCommunities([]))
      dispatch(setReports([]))
      dispatch(setPosts([]))
      dispatch(updateMemberShip({ userId: '', role: 'user', communityId: '' }))

      navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo cerrar la sesión'
      Alert.alert('Error', message)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: 90,
          backgroundColor: colors.background,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <Text style={styles.title}>Mi Perfil</Text>

      {/* FOTO */}

      <View style={styles.profileSection}>
        <ProfileAvatar
          image={
            avatar ? { uri: avatar } : require('@assets/default-avatar.png')
          }
          onEdit={cambiarFoto}
        />

        <Text style={styles.name}>{userName || 'Invitado'}</Text>

        <Text style={styles.email}>{userEmail || 'Sin sesión iniciada'}</Text>
        <Pressable
          style={styles.settingsButton}
          onPress={() => setSettingsVisible(true)}
        >
          <Text style={styles.settingsText}>Configuración</Text>
        </Pressable>
      </View>

      {/* COMUNIDADES */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis Comunidades</Text>

          <Text style={styles.communityCount}>{myCommunities.length}</Text>
        </View>

        <View style={styles.communityList}>
          {myCommunities.map((community) => (
            <View key={community.id} style={styles.communityCard}>
              <View style={styles.communityInfo}>
                <Text style={styles.communityName}>{community.name}</Text>

                <Text style={styles.communityRole}>{community.role}</Text>
              </View>

              {community.role === 'Administrador' ? (
                <Pressable
                  style={styles.manageButton}
                  onPress={() =>
                    navigation.navigate('ManageCommunity', {
                      communityId: community.id,
                    })
                  }
                >
                  <Text style={styles.manageButtonText}>Administrar</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.viewButton}
                  onPress={() =>
                    navigation.navigate('CommunityHome', {
                      communityId: community.id,
                    })
                  }
                >
                  <Text style={styles.viewButtonText}>Ver</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* CREAR COMUNIDAD */}

      <CustomButton
        text="Crear Comunidad"
        onPress={() => navigation.navigate('NuevaComunidad')}
        variant="secondary"
      />

      {/* CERRAR SESIÓN */}

      <Pressable style={styles.logoutButton} onPress={cerrarSesion}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </ScrollView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 32,
      gap: 24,
      backgroundColor: colors.background,
    },

    title: {
      fontFamily: 'MontserratAlternates_700Bold_Italic',
      fontSize: 22,
      color: colors.text,
    },

    profileSection: {
      alignItems: 'center',
      gap: 8,
    },

    name: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 18,
      color: colors.text,
    },

    email: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
    },

    section: {
      gap: 12,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    sectionTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 18,
      color: colors.text,
    },

    communityCount: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.textSecondary,
    },

    communityList: {
      gap: 10,
    },

    communityCard: {
      minHeight: 76,
      paddingHorizontal: 14,
      paddingVertical: 12,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',

      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,

      backgroundColor: colors.surface,
    },

    communityInfo: {
      flex: 1,
      gap: 4,
    },

    communityName: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
      color: colors.text,
    },

    communityRole: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },

    manageButton: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.primaryDark,
    },

    manageButtonText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.surface,
    },

    viewButton: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },

    viewButtonText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.text,
    },

    logoutButton: {
      alignItems: 'center',
      paddingVertical: 12,
    },

    logoutText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.error,
    },
    settingsButton: {
      alignSelf: 'center',
      paddingVertical: 8,
      borderColor: colors.border,
      borderWidth: 1,
      padding: 15,
      backgroundColor: colors.surface,
      borderRadius: 60,
    },

    settingsText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.primary,
    },
  })
