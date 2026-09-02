import React, { JSX } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'

export interface BarData {
  value: number
  label: string
}

interface Props {
  data: BarData[]
}

export const ReportBarChart = ({ data }: Props): JSX.Element => {
  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Reportes Recibidos Mensuales</Text>

      <View style={styles.chartWrapper}>
        <BarChart
          data={data}
          barWidth={22}
          spacing={24}
          initialSpacing={12}
          height={130}
          frontColor="#0052FF"
          barBorderTopLeftRadius={8}
          barBorderTopRightRadius={8}
          hideRules
          yAxisThickness={0}
          hideYAxisText
          isAnimated
          xAxisThickness={0}
          xAxisLabelTextStyle={styles.labelEjeX}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelEjeX: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
})
