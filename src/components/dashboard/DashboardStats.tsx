import React, { JSX } from 'react'
import { StyleSheet, View } from 'react-native'
import { MetricsGrid } from './MetricsGrid'
import { ReportBarChart } from './ReportBarChart'
import { Metric } from './types'

interface ReporteMes {
  mes: string
  cantidad: number
}

export const DashboardStats = (): JSX.Element => {
  const datos: Metric[] = [
    { type: 'residentes', quantity: 342 },
    { type: 'active_alerts', quantity: 12 },
    { type: 'pagos_pendientes', quantity: 8 },
    { type: 'solucionados', quantity: 48 },
  ]

  const reportesMensuales: ReporteMes[] = [
    { mes: 'Ene', cantidad: 0 }, // No aparecerá
    { mes: 'Jun', cantidad: 35 },
    { mes: 'Jul', cantidad: 60 },
    { mes: 'Ago', cantidad: 45 },
    { mes: 'Sep', cantidad: 80 },
    { mes: 'Oct', cantidad: 65 },
  ]

  const datosGrafico = reportesMensuales
    .filter((item) => item.cantidad > 0)
    .map((item) => ({
      value: item.cantidad,
      label: item.mes,
    }))

  return (
    <View style={styles.container}>
      <MetricsGrid data={datos} />

      <ReportBarChart data={datosGrafico} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
})
