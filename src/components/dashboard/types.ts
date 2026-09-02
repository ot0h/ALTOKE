export type MetricType =
  | 'residentes'
  | 'active_alerts'
  | 'pagos_pendientes'
  | 'solucionados'

export interface Metric {
  type: MetricType
  quantity: number
}