import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from '../../store/hook'
import ReportCard from '../../components/ReportCard'

export const Reportes = () => {
  const insets = useSafeAreaInsets()
  const reports = useAppSelector((state) => state.report.reports)

  useEffect(() => {
    console.log('[Redux] useSelector(state => state.report.reports):', reports)
  }, [reports])

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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'MontserratAlternates_700Bold_Italic',
    fontSize: 22,
    color: '#1E2744',
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
    color: '#64748B',
    textAlign: 'center',
  },
})
