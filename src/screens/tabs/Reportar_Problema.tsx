import { JSX, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Camera, MapPin, ArrowLeft } from 'lucide-react-native' // o tus iconos actuales

type CategoriasType =
  | 'alumbrado'
  | 'agua'
  | 'bache'
  | 'basura'
  | 'mantenimiento'
  | 'infraestructura'
  | 'seguridad'
  | 'otros'

type PrioridadType = 'baja' | 'media' | 'alta'

export const ReportProblem = (): JSX.Element => {
  const [selected, setSelected] = useState<CategoriasType | null>('agua')
  const [prioridad, setPrioridad] = useState<PrioridadType>('media')
  const [titulo, setTitulo] = useState('')
  const [detalles, setDetalles] = useState('')

  const CATEGORIAS: Record<CategoriasType, string> = {
    agua: 'Agua',
    alumbrado: 'Alumbrado',
    bache: 'Bache',
    basura: 'Basura',
    mantenimiento: 'Mantenimiento',
    infraestructura: 'Infraestructura',
    seguridad: 'Seguridad',
    otros: 'Otros',
  }

  const PRIORIDADES: Record<PrioridadType, string> = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <ArrowLeft size={20} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Reportar problema</Text>
      </View>

      {/* Categorías */}
      <View style={styles.section}>
        <Text style={styles.label}>Selecciona la categoría</Text>
        <View style={styles.chipsWrap}>
          {Object.entries(CATEGORIAS).map(([categoria, label]) => {
            const isSelected = selected === categoria
            return (
              <Pressable
                key={categoria}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setSelected(categoria as CategoriasType)}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      {/* Card principal */}
      <View style={styles.card}>
        <Text style={styles.label}>¿Cuál es el problema?</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Tubo roto frente a casa 14"
          placeholderTextColor="#94A3B8"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={[styles.label, styles.spacedLabel]}>
          Detalles de la situación
        </Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Describe lo que ocurre para que el personal correspondiente pueda solucionarlo..."
          placeholderTextColor="#94A3B8"
          value={detalles}
          onChangeText={setDetalles}
          multiline
          textAlignVertical="top"
        />

        <Text style={[styles.label, styles.spacedLabel]}>
          Ubicación aproximada
        </Text>
        <View style={styles.locationBox}>
          <MapPin size={16} color="#0145EA" />
          <Text style={styles.locationText}>
            Área verde principal (junto a canchas)
          </Text>
        </View>

        <Text style={[styles.label, styles.spacedLabel]}>
          Evidencia fotográfica
        </Text>
        <Pressable style={styles.photoBox}>
          <Camera size={20} color="#0145EA" />
          <Text style={styles.photoText}>Tomar o subir foto</Text>
        </Pressable>

        <Text style={[styles.label, styles.spacedLabel]}>Prioridad</Text>
        <View style={styles.priorityRow}>
          {Object.entries(PRIORIDADES).map(([key, label]) => {
            const isSelected = prioridad === key
            return (
              <Pressable
                key={key}
                style={[
                  styles.priorityChip,
                  isSelected && styles.priorityChipSelected,
                ]}
                onPress={() => setPrioridad(key as PrioridadType)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    isSelected && styles.priorityTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <Pressable style={styles.submitButton}>
        <Text style={styles.submitText}>Enviar reporte</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#0F172A',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 8,
  },
  spacedLabel: {
    marginTop: 16,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipSelected: {
    backgroundColor: '#0145EA',
    borderColor: '#0145EA',
  },
  chipText: {
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    fontSize: 12,
    color: '#0F172A',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  textarea: {
    minHeight: 90,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  locationText: {
    fontSize: 13,
    color: '#0F172A',
    flexShrink: 1,
  },
  photoBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFF',
  },
  photoText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#0145EA',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  priorityChipSelected: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FBBF24',
  },
  priorityText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#0F172A',
  },
  priorityTextSelected: {
    color: '#B45309',
  },
  submitButton: {
    backgroundColor: '#0145EA',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
})
