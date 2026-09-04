import React, { JSX } from 'react'
import { StyleSheet, View } from 'react-native'
import { MetricCard } from './MetricCard'
import { Metric } from './types'

interface Props {
  data: Metric[]
}

export const MetricsGrid = ({ data }: Props): JSX.Element => {
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <MetricCard key={item.type} type={item.type} quantity={item.quantity} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
})
