import { JSX, useCallback, useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import {
  ArrowLeft,
  ChevronRight,
  FileWarning,
  Inbox,
} from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import CustomLabel from '../components/CustomLabel'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { ReportStatus } from '../types'
import { reportService } from '../services'
import { RootStackParamList } from '../navigation/StackNavigator'

type Props = {
  route: { params: { communityId: string } }
}

const STATUS_OPTIONS: ReportStatus[] = [
  'revision',
  'pendiente',
  'proceso',
  'resuelto',
]

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

type LocalReport = {
  id: string
  title: string
  category: string
  location: string
  status: ReportStatus
  createdAt: string
}

export const ManageReports = ({ route }: Props): JSX.Element => {
  const { communityId } = route.params

  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()

  const navigation = useNavigation<NavigationProp>()
  const isFocused = useIsFocused()

  const [reports, setReports] = useState<LocalReport[]>([])

  const loadReports = useCallback(async () => {
    try {
      const remoteReports = await reportService.fetchReports(
        undefined,
        communityId,
      )

      setReports(
        remoteReports.map((report) => ({
          id: report.id,
          title: report.title,
          category: report.category,
          location: report.location,
          status: report.status,
          createdAt: report.createdAt,
        })),
      )
    } catch (error) {
      console.error('[ManageReports] Error al cargar reportes:', error)
    }
  }, [communityId])

  useEffect(() => {
    if (!isFocused) return
    loadReports()
  }, [isFocused, loadReports])

  const cambiarStatus = async (
    reportId: string,
    status: ReportStatus,
  ) => {
    setReports((current) =>
      current.map((report) =>
        report.id === reportId ? { ...report, status } : report,
      ),
    )

    try {
      await reportService.updateReportStatus(reportId, status)
    } catch (error) {
      console.error('[ManageReports] Error al cambiar status:', error)
      loadReports()
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>

        <Text style={styles.title}>Gestión reportes</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {reports.length === 0 ? (
          <View style={styles.empty}>
            <Inbox size={40} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              Aún no hay reportes en esta comunidad.
            </Text>
          </View>
        ) : (
          reports.map((report) => (
            <View key={report.id} style={styles.card}>
              <Pressable
                style={styles.cardContent}
                onPress={() =>
                  navigation.navigate('ReportDetail', {
                    reportId: report.id,
                    communityId,
                    canManage: true,
                  })
                }
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardIcon}>
                    <FileWarning size={18} color={colors.surface} />
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{report.title}</Text>

                    <Text style={styles.cardMeta}>
                      #{report.id.slice(0, 8).toUpperCase()} •{' '}
                      {report.category} •{' '}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <CustomLabel status={report.status} />

                  <View style={styles.previewLink}>
                    <Text style={styles.previewText}>Ver detalle</Text>
                    <ChevronRight size={16} color={colors.primary} />
                  </View>
                </View>
              </Pressable>

              <View style={styles.statusRow}>
                {STATUS_OPTIONS.map((option) => {
                  const active = report.status === option
                  const config = STATUS_LABELS[option]

                  return (
                    <Pressable
                      key={option}
                      style={[
                        styles.statusChip,
                        active && {
                          backgroundColor: config.color,
                          borderColor: config.color,
                        },
                      ]}
                      onPress={() => cambiarStatus(report.id, option)}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          active && { color: colors.surface },
                        ]}
                      >
                        {config.label}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const STATUS_LABELS: Record<ReportStatus, { label: string; color: string }> = {
  revision: { label: 'Revisión', color: '#3B82F6' },
  pendiente: { label: 'Pendiente', color: '#F59E0B' },
  proceso: { label: 'Proceso', color: '#3E6CB0' },
  resuelto: { label: 'Resuelto', color: '#10B981' },
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginBottom: 20,
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

    title: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 22,
      color: colors.text,
    },

    list: {
      gap: 14,
      paddingBottom: 24,
    },

    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 14,
      gap: 12,
    },

    cardContent: {
      gap: 12,
    },

    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    cardIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardInfo: {
      flex: 1,
      gap: 2,
    },

    cardTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
      color: colors.text,
    },

    cardMeta: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },

    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    previewLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },

    previewText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.primary,
    },

    statusRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    statusChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 100,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },

    statusChipText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.textSecondary,
    },

    empty: {
      alignItems: 'center',
      gap: 10,
      paddingVertical: 48,
    },

    emptyText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  })