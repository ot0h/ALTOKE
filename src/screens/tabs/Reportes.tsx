import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { setReports } from '../../store/slices/reportSlice'
import { reportService } from '../../services'
import { mergeById } from '../../utils/mergeById'
import ReportCard from '../../components/ReportCard'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

export const Reportes = () => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()
  const reports = useAppSelector((state) => state.report.reports)
  const userId = useAppSelector((state) => state.userProfile.id)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!userId) return

    const loadReports = async () => {
      try {
        const remoteReports = await reportService.fetchReports(userId)

        dispatch(setReports(mergeById(reports, remoteReports)))
      } catch (error) {
        console.error(
          '[Reportes] Error al cargar reportes:',
          error,
        )
      }
    }

    loadReports()
  }, [userId])

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Text style={styles.title}>Mis Reportes</Text>

      {reports.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Aún no hay reportes. Ve a «Reportar problema» para agregar uno.
          </Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ReportCard
              title={item.title}
              status={item.status}
              report={item.id}
              category={item.category}
              time={new Date(item.createdAt).toLocaleDateString()}
              location={item.location}
              onPress={() => {}}
              variant="expand"
            />
          )}
        />
      )}
    </View>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
    },
    title: {
      fontFamily: 'MontserratAlternates_700Bold_Italic',
      fontSize: 22,
      color: colors.text,
      marginBottom: 16,
      marginTop: 8,
    },
    list: {
      gap: 12,
      paddingBottom: 24,
    },
    empty: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  })
