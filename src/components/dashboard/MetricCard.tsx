import React, { JSX } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MetricType } from './types'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

interface Props {
  type: MetricType
  quantity: number
}

export const MetricCard = ({
  type = 'residentes',
  quantity,
}: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = getStyles(type, colors)

  const labels: Record<MetricType, string> = {
    residentes: 'Residentes',
    active_alerts: 'Alertas Activas',
    pagos_pendientes: 'Pagos Pendientes',
    solucionados: 'Solucionados',
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{labels[type]}</Text>
      <Text style={styles.quantity_color}>{quantity}</Text>
    </View>
  )
}

const getStyles = (tipo: MetricType, colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      width: '48%',
      height: 81,
      padding: 14,
      borderRadius: 16,
      gap: 4,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      justifyContent: 'center',
      borderWidth: 1,
    },
    header: {
      color: colors.textSecondary,
      fontSize: 12,
      fontFamily: 'Inter_600SemiBold',
      textTransform: 'capitalize',
    },
    quantity_color: {
      color:
        tipo === 'residentes'
          ? colors.text
          : tipo === 'active_alerts'
            ? colors.error
            : tipo === 'pagos_pendientes'
              ? colors.warning
              : colors.success,
      fontFamily: 'Inter_800ExtraBold',
      fontSize: 28,
    },
  })
