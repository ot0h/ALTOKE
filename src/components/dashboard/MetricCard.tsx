import React, { JSX } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MetricType } from './types'

interface Props {
  type: MetricType
  quantity: number
}

export const MetricCard = ({ type = 'residentes', quantity }: Props): JSX.Element => {
  const styles = getStyles(type)

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

const getStyles = (tipo: MetricType) =>
  StyleSheet.create({
    container: {
      width: '48%',
      height: 81,
      padding: 14,
      borderRadius: 16,
      gap: 4,
      backgroundColor: '#FFFFFF',
      borderColor: '#E2E8F0',
      justifyContent: 'center',
      borderWidth: 1,
    },
    header: {
      color: '#64748B',
      fontSize: 12,
      fontFamily: 'Inter_600SemiBold',
      textTransform: 'capitalize',
    },
    quantity_color: {
      color:
        tipo === 'residentes'
          ? '#1E2744'
          : tipo === 'active_alerts'
            ? '#EF4444'
            : tipo === 'pagos_pendientes'
              ? '#F59E0B'
              : '#10B981',
      fontFamily: 'Inter_800ExtraBold',
      fontSize: 28,
    },
  })