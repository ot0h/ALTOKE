import { JSX, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'
import { CustomButton } from '@components'
import CommunityCard from '../../components/CommunityCard'
import ReportCard from '../../components/ReportCard'
import JoinCommunityModal from '../modals/JoinCommunityModal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { setCommunities } from '../../store/slices/communitySlice'
import { setReports } from '../../store/slices/reportSlice'
import { communityService, reportService } from '../../services'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '@navigation/StackNavigator'
import { useIsFocused } from '@react-navigation/native'

export const Inicio = (): JSX.Element => {
  const [joinModalVisible, setJoinModalVisible] = useState(false)
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()
  const userName = useAppSelector((state) => state.userProfile.name)
  const userId = useAppSelector((state) => state.userProfile.id)
  const avatar = useAppSelector((state) => state.userProfile.avatar)
  const communities = useAppSelector((state) => state.community.communities)
  const reports = useAppSelector((state) => state.report.reports)
  const navigation = useNavigation()
  const isFocused = useIsFocused()


 useEffect(() => {
  if (!userId || !isFocused) return

  const loadData = async () => {
    try {
      const [comms, reps] = await Promise.all([
        communityService.fetchCommunitiesByUser(userId),
        reportService.fetchReports(userId),
      ])

      dispatch(setCommunities(comms))
      dispatch(setReports(reps))
    } catch (e) {
      console.error('[Inicio] Error cargando datos:', e)
    }
  }

  loadData()
}, [dispatch, userId, isFocused])


  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: 20, backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola, {userName || 'vecino'}! 👋</Text>
        <Image
          style={styles.avatar}
          source={
            avatar
              ? { uri: avatar }
              : require('@assets/default-avatar.png')
          }
        />
      </View>

      {/* Banner código */}
      <View style={styles.codeCard}>
        <Text style={styles.codeTitle}>Tienes un{'\n'}codigo?</Text>
        <View style={styles.codeRight}>
          <Text style={styles.codeSubtitle}>Unete al toke a tu comunidad</Text>
          <CustomButton
            variant="secondary"
            text={'CLICK AQUI'}
            onPress={() => setJoinModalVisible(true)}
          />
        </View>
      </View>

      {/* Mis Comunidades */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mis Comunidades</Text>
        <Pressable onPress={()=>navigation.getParent()?.navigate('MyCommunity')} >
          <Text style={styles.sectionLink}>Ver todas</Text>
          </Pressable>
      </View>

      {/*SE AGREGO EL .MAP PARA RENDERIZAR LAS COMMUNITY CARDS Y LOS REPORTS, QUITE EL FLAT LIST porque no se puede usar con el scroll view*/}
      <View style= {[{gap:20}]}>
      {communities.map((item) => (
        <CommunityCard
          key={item.id}
          title={item.name}
          description={item.description}
          image={item.image}
          onPress={() =>
            navigation
              .getParent<NativeStackNavigationProp<RootStackParamList>>()
              ?.navigate('CommunityHome', { communityId: item.id })
          }
        />
      ))}

      {/* Reportes Recientes */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Reportes Recientes</Text>
      </View>

    
      {reports
        .filter((report) => report.status !== 'resuelto')
        .map((item) => (
          <ReportCard
            key={item.id}
            title={item.title}
            status={item.status}
            report={item.id}
            category={item.category}
            onPress={() => {}}
          />
        ))}
      </View>
      {reports.every((report) => report.status === 'resuelto') && reports.length > 0 && (
        <Text style={styles.noActiveText}>
          No tienes reportes activos.
        </Text>
      )}

      <JoinCommunityModal
        visible={joinModalVisible}
        onClose={() => setJoinModalVisible(false)}
      />
    </ScrollView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      paddingBottom: 100,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    greeting: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
    },
    codeCard: {
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderRadius: 16,
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 28,
    },
    codeTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
      flexShrink: 1,
    },
    codeRight: {
      alignItems: 'flex-end',
      gap: 10,
      maxWidth: 160,
    },
    codeSubtitle: {
      fontSize: 12,
      color: colors.primary,
      textAlign: 'right',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    sectionLink: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
    noActiveText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingVertical: 12,
    },
  })