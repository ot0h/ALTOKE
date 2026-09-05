import { JSX, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import {
  Camera,
  MapPin,
  ArrowLeft,
  ImagePlus,
  X,
} from 'lucide-react-native'

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
  const [ubicacion, setUbicacion] = useState<string>('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [fotos, setFotos] = useState<string[]>([])

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

  const obtenerUbicacion = async () => {
    setLocationLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setUbicacion('Permiso de ubicación denegado')
        return
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      setCoords({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      })
      const [place] = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      })
      if (place) {
        const partes = [
          place.street,
          place.district,
          place.city,
          place.region,
        ].filter(Boolean)
        setUbicacion(partes.join(', '))
      } else {
        setUbicacion(
          `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`
        )
      }
    } catch {
      setUbicacion('No se pudo obtener tu ubicación')
    } finally {
      setLocationLoading(false)
    }
  }

  const pedirPermisoCamara = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    return status === 'granted'
  }

  const tomarFoto = async () => {
    const ok = await pedirPermisoCamara()
    if (!ok) return
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    })
    if (!result.canceled) {
      setFotos((prev) => [...prev, result.assets[0].uri])
    }
  }

  const elegirDeGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 4,
    })
    if (!result.canceled) {
      setFotos((prev) => [
        ...prev,
        ...result.assets.map((asset) => asset.uri),
      ])
    }
  }

  const quitarFoto = (uri: string) => {
    setFotos((prev) => prev.filter((f) => f !== uri))
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
          {locationLoading ? (
            <View style={styles.locationLoading}>
              <ActivityIndicator size="small" color="#0145EA" />
              <Text style={styles.locationText}>Obteniendo ubicación...</Text>
            </View>
          ) : (
            <Text style={styles.locationText} numberOfLines={2}>
              {ubicacion || 'Toca para usar tu ubicación actual'}
            </Text>
          )}
          {coords && (
            <Text style={styles.coordsText}>
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </Text>
          )}
          <Pressable
            style={styles.locationButton}
            onPress={obtenerUbicacion}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator size="small" color="#0145EA" />
            ) : (
              <MapPin size={16} color="#0145EA" />
            )}
            <Text style={styles.locationButtonText}>
              {coords ? 'Actualizar' : 'Usar mi ubicación'}
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.label, styles.spacedLabel]}>
          Evidencia fotográfica
        </Text>
        <View style={styles.photoWrap}>
          {fotos.length > 0 && (
            <View style={styles.photoPreviewRow}>
              {fotos.map((uri) => (
                <View key={uri} style={styles.photoPreview}>
                  <Image source={{ uri }} style={styles.photoPreviewImg} />
                  <Pressable style={styles.removePhoto} onPress={() => quitarFoto(uri)}>
                    <X size={14} color="#FFFFFF" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
          <View style={styles.photoActions}>
            <Pressable style={[styles.photoBox, styles.photoAction]} onPress={tomarFoto}>
              <Camera size={20} color="#0145EA" />
              <Text style={styles.photoText}>Cámara</Text>
            </Pressable>
            <Pressable style={[styles.photoBox, styles.photoAction]} onPress={elegirDeGaleria}>
              <ImagePlus size={20} color="#0145EA" />
              <Text style={styles.photoText}>Galería</Text>
            </Pressable>
          </View>
        </View>

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
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  locationText: {
    fontSize: 13,
    color: '#0F172A',
    flexShrink: 1,
  },
  coordsText: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Inter_600SemiBold',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  locationButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#0145EA',
  },
  photoWrap: {
    gap: 10,
  },
  photoPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoPreview: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoPreviewImg: {
    width: '100%',
    height: '100%',
  },
  removePhoto: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 12,
    padding: 3,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
  },
  photoAction: {
    flex: 1,
    paddingVertical: 18,
  },
  photoBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    borderRadius: 12,
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
