import React, { JSX } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { MetricsGrid } from './MetricsGrid'
import { ReportBarChart } from './ReportBarChart'
import { Metric } from './types'
import ReportCard from '../ReportCard'

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
    <ScrollView>
      <View style={styles.container}>
        <MetricsGrid data={datos} />

        <ReportBarChart data={datosGrafico} />

        <View>
          <Text>Incidencias Recientes</Text>
          <ReportCard
            title="Fuga de agua en área común"
            status={'revision'}
            report={'#RPT-0847'}
            category={'Fontanería'}
            onPress={() => {}}
          />
          <ReportCard
            title="Luminaria fundida pasillo 3"
            status={'resuelto'}
            report={'#RPT-0839'}
            category={'Electricidad'}
            onPress={() => {}}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
})
