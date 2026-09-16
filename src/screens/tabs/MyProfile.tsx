import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Patronato from '@assets/patronato.png'
import { CustomButton } from '@components'
import ProfileAvatar from '../../components/ProfileAvatar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from '../../store/hook'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import SettingsModal from '../modals/SettingsModal'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '@navigation/StackNavigator'



export const MyProfile = () => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const communities = [
    {
      id: '1',
      name: 'Patronato',
      role: 'Administrador',
    },
    {
      id: '2',
      name: 'Colonia Centro',
      role: 'Miembro',
    },
  ]
const navigation =
  useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const insets = useSafeAreaInsets()

  const userName = useAppSelector((state) => state.userProfile.name)
  const userEmail = useAppSelector((state) => state.userProfile.email)
  const [settingsVisible, setSettingsVisible] = useState(false)

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <Text style={styles.title}>Mi Perfil</Text>

      {/* FOTO */}

      <View style={styles.profileSection}>
        <ProfileAvatar image={Patronato} onEdit={() => { }} />

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

          <Text style={styles.communityCount}>{communities.length}</Text>
        </View>

        <View style={styles.communityList}>
          {communities.map((community) => (
            <View key={community.id} style={styles.communityCard}>
              <View style={styles.communityInfo}>
                <Text style={styles.communityName}>{community.name}</Text>

                <Text style={styles.communityRole}>{community.role}</Text>
              </View>

              {community.role === 'Administrador' ? (
                <Pressable style={styles.manageButton} onPress={()=> navigation.navigate('ManageCommunity', {communityId: community.id})}>
                  <Text style={styles.manageButtonText}>Administrar</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.viewButton} onPress={() => { }}>
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
        onPress={() => navigation.getParent()?.navigate('NuevaComunidad') }
        variant="secondary"
      />

      {/* CERRAR SESIÓN */}

      <Pressable style={styles.logoutButton} onPress={() => { }}>
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
      padding:15,
      backgroundColor: colors.surface,
      borderRadius: 60
    },

    settingsText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.primary,
    },
  })
