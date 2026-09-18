import { JSX, useState } from 'react'
import { Alert, Pressable, ScrollView,   StyleSheet, Text, View,} from 'react-native'
import {  ArrowLeft,BarChart3,FileText, MessageCircle,Users,Flag,} from 'lucide-react-native'
import {SafeAreaView,useSafeAreaInsets,} from 'react-native-safe-area-context'
import { RouteProp, useNavigation,useRoute,} from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { ManageOptionCard } from '../components/ManageOptionCard'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { RootStackParamList } from '@navigation/StackNavigator'
import { CustomButton } from '@components'
import { communityService } from '../services'
import ConfirmAlert from './modals/Alert'
import { removeCommunity } from '../store/slices/communitySlice'

type ManageCommunityRouteProp = RouteProp<
  RootStackParamList,
  'ManageCommunity'
>

type ManageCommunityNavigationProp =
  NativeStackNavigationProp<RootStackParamList>

export const ManageCommunity = (): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const insets = useSafeAreaInsets()

  const navigation =
    useNavigation<ManageCommunityNavigationProp>()

  const route = useRoute<ManageCommunityRouteProp>()

  const { communityId } = route.params
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const dispatch = useAppDispatch()

  const deleteCommunity = async () => {
    setConfirmModalVisible(false)

    try {
      await communityService.deleteCommunity(communityId)
      dispatch(removeCommunity(communityId))
      navigation.goBack()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar la comunidad'
      Alert.alert('Error', message)
    }
  }

  const community = useAppSelector((state) =>
    state.community.communities.find(
      (community) => community.id === communityId
    )
  )

  const options = [
    {
      title: 'Dashboard',
      description: 'Consulta las estadísticas de tu comunidad',
      icon: BarChart3,
      onPress: () =>
        navigation.navigate('ManageDashboard', { communityId }),
    },
    {
      title: 'Gestionar noticias',
      description: 'Crea, edita y administra las noticias',
      icon: FileText,
      onPress: () =>
        navigation.navigate('ManageNotices', { communityId }),
    },
    {
      title: 'Ver miembros',
      description: 'Consulta y administra los miembros',
      icon: Users,
      onPress: () => navigation.navigate('Members', { communityId }),
    },
    {
      title: 'Ver foro',
      description: 'Consulta y administra las conversaciones',
      icon: MessageCircle,
      onPress: () =>
        navigation.navigate('Forum', { communityId }),
    },
    {
      title: 'Gestionar reportes',
      description: 'Revisa los reportes y cambia su estado',
      icon: Flag,
      onPress: () =>
        navigation.navigate('ManageReports', { communityId }),
    },
  ]

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/* HEADER */}

          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft
                size={20}
                color={colors.text}
              />
            </Pressable>

            <View style={styles.headerText}>
              <Text style={styles.title}>
                Administrar comunidad
              </Text>

              <Text style={styles.subtitle}>
                Gestiona los diferentes aspectos de tu comunidad
              </Text>
            </View>
          </View>

          {/* COMMUNITY */}

          <View style={styles.communityCard}>
            <View style={styles.communityIcon}>
              <Text style={styles.communityIconText}>
                {community?.name?.charAt(0).toUpperCase() || 'C'}
              </Text>
            </View>

            <View style={styles.communityInfo}>
              <Text style={styles.communityName}>
                {community?.name || 'Comunidad'}
              </Text>

              <Text style={styles.communityDescription}>
                {community?.description ||
                  'Administración de comunidad'}
              </Text>
            </View>
          </View>

          {/* OPTIONS */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Administración
            </Text>

            <View style={styles.options}>
              {options.map((option) => (
                <ManageOptionCard
                  key={option.title}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  onPress={option.onPress}
                />
              ))}
            </View>
            <CustomButton
            text='Eliminar comunidad'
            onPress={()=>{setConfirmModalVisible(true)}}
            variant='secondary'
            />
          </View>
              <ConfirmAlert
              text='Estas por eliminar la comunidad'
              visible= {confirmModalVisible}
              onPress={deleteCommunity}
              onCancel={()=>{setConfirmModalVisible(false)}}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      flexGrow: 1,
    },

    container: {
      flex: 1,
      paddingHorizontal: 20,
      gap: 24,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingTop: 16,
    },

    backButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerText: {
      flex: 1,
      gap: 4,
    },

    title: {
      fontFamily: 'MontserratAlternates_700Bold',
      fontSize: 22,
      color: colors.text,
    },

    subtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },

    communityCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
    },

    communityIcon: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    communityIconText: {
      fontFamily: 'MontserratAlternates_700Bold',
      fontSize: 22,
      color: colors.surface,
    },

    communityInfo: {
      flex: 1,
      gap: 4,
    },

    communityName: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      color: colors.text,
    },

    communityDescription: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },

    section: {
      gap: 12,
    },

    sectionTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 18,
      color: colors.text,
    },

    options: {
      gap: 12,
    },
  })