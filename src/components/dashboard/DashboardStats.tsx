import React, { JSX, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { MetricsGrid } from './MetricsGrid'
import { ReportBarChart } from './ReportBarChart'
import { Metric } from './types'
import ReportCard from '../ReportCard'
import { membershipService, reportService } from '../../services'
import { CommunityMember } from '../../services'
import { Report } from '../../types'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

interface BarDatum {
  value: number
  label: string
}

const MONTHS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
]

interface Props {
  communityId: string
}

export const DashboardStats = ({ communityId }: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const [members, setMembers] = useState<CommunityMember[]>([])
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [fetchedMembers, fetchedReports] = await Promise.all([
          membershipService.fetchCommunityMembers(communityId),
          reportService.fetchReports(undefined, communityId),
        ])

        setMembers(fetchedMembers)
        setReports(fetchedReports)
      } catch (error) {
        console.error('[DashboardStats] Error cargando datos:', error)
      }
    }

    load()
  }, [communityId])

  const resolved = reports.filter(
    (report) => report.status === 'resuelto',
  ).length
  const pending = reports.filter(
    (report) => report.status === 'pendiente',
  ).length
  const active = reports.length - resolved

  const datos: Metric[] = [
    { type: 'residentes', quantity: members.length },
    { type: 'active_alerts', quantity: active },
    { type: 'pagos_pendientes', quantity: pending },
    { type: 'solucionados', quantity: resolved },
  ]

  const now = new Date()
  const buckets: { key: string; label: string; count: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({
      key: `${date.getFullYear()}-${date.getMonth() + 1}`,
      label: MONTHS[date.getMonth()],
      count: 0,
    })
  }

  reports.forEach((report) => {
    const date = new Date(report.createdAt)
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`
    const bucket = buckets.find((item) => item.key === key)

    if (bucket) {
      bucket.count += 1
    }
  })

  const reportesMensuales: BarDatum[] = buckets
    .filter((item) => item.count > 0)
    .map((item) => ({ value: item.count, label: item.label }))

  const recentReports = reports.slice(0, 3)

  return (
    <ScrollView>
      <View style={styles.container}>
        <MetricsGrid data={datos} />

        <ReportBarChart data={reportesMensuales} />

        {recentReports.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Incidencias Recientes</Text>

            {recentReports.map((report) => (
              <ReportCard
                key={report.id}
                title={report.title}
                status={report.status}
                report={`RPT-${report.id.slice(0, 6).toUpperCase()}`}
                category={report.category}
                time={
                  report.createdAt
                    ? new Date(report.createdAt).toLocaleDateString()
                    : 'Reciente'
                }
                onPress={() => {}}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 16,
      gap: 16,
      backgroundColor: colors.background,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter_700Bold',
      color: colors.text,
      marginBottom: 12,
    },
  })