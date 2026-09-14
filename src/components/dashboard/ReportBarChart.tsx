import React, { JSX } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

export interface BarData {
  value: number
  label: string
}

interface Props {
  data: BarData[]
}

export const ReportBarChart = ({ data }: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Reportes Recibidos Mensuales</Text>

      <View style={styles.chartWrapper}>
        <BarChart
          data={data}
          barWidth={22}
          spacing={24}
          initialSpacing={12}
          endSpacing={12}
          height={130}
          frontColor={colors.primary}
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    chartCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 8,
      alignItems: 'center',
      display: 'flex',
    },
    chartTitle: {
      fontSize: 14,
      fontFamily: 'Inter_700Bold',
      color: colors.text,
      marginBottom: 20,
    },
    chartWrapper: {},
    labelEjeX: {
      color: colors.textSecondary,
      fontSize: 13,
      fontFamily: 'Inter_600SemiBold',
    },
  })
