import { JSX, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
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
import { Camera, MapPin, ArrowLeft, ImagePlus, X } from 'lucide-react-native'
import { CategoryTag } from '../../components/CategoryTag'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { addReport } from '../../store/slices/reportSlice'
import { reportService, storageService } from '../../services'
import { makeImagePath } from '../../services/storageService'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@navigation/StackNavigator'

type Props = NativeStackScreenProps<RootStackParamList, 'ReportProblem'>

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

export const ReportProblem = ({ navigation, route }: Props): JSX.Element => {
  const { communityId } = route.params
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()
  const userId = useAppSelector((state) => state.userProfile.id)
  const [sending, setSending] = useState(false)
  const [selected, setSelected] = useState<CategoriasType | null>('agua')
  const [prioridad, setPrioridad] = useState<PrioridadType>('media')
  const [titulo, setTitulo] = useState('')
  const [detalles, setDetalles] = useState('')
  const [ubicacion, setUbicacion] = useState<string>('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  )
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriasType>('otros')
  const [locationLoading, setLocationLoading] = useState(false)
  const [fotos, setFotos] = useState<string[]>([])

  const categories: {
    text: string
    value: CategoriasType
  }[] = [
    {
      text: 'Agua',
      value: 'agua',
    },
    {
      text: 'Bache',
      value: 'bache',
    },
    {
      text: 'Basura',
      value: 'basura',
    },
    {
      text: 'Mantenimiento',
      value: 'mantenimiento',
    },
    {
      text: 'Infraestructura',
      value: 'infraestructura',
    },
    {
      text: 'Seguridad',
      value: 'seguridad',
    },
    {
      text: 'Otros',
      value: 'otros',
    },
  ]

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
          `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
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
      allowsMultipleSelection: false,
      selectionLimit: 4,
    })
    if (!result.canceled) {
      setFotos((prev) => [...prev, ...result.assets.map((asset) => asset.uri)])
    }
  }

  const quitarFoto = (uri: string) => {
    setFotos((prev) => prev.filter((f) => f !== uri))
  }

  const enviarReporte = async () => {
    if (sending || !titulo.trim()) return

    if (!communityId) {
      Alert.alert('Error', 'No se encontró la comunidad.')
      return
    }

    setSending(true)
    try {
      const uploadedFotos: string[] = []

      for (const uri of fotos) {
        const publicUrl = await storageService.uploadImage(
          'report-photos',
          makeImagePath('reportes'),
          uri,
        )

        uploadedFotos.push(publicUrl)
      }

      const report = await reportService.createReport({
        title: titulo.trim(),
        description: detalles.trim(),
        category: selectedCategory,
        location: ubicacion,
        userId,
        communityId,
        fotos: uploadedFotos,
      })

      dispatch(addReport(report))
      Alert.alert('Éxito', 'Reporte enviado correctamente.')

      setTitulo('')
      setDetalles('')
      setFotos([])
      setUbicacion('')
      setCoords(null)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo enviar el reporte'
      Alert.alert('Error', message)
    } finally {
      setSending(false)
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Reportar problema</Text>
      </View>

      {/* CATEGORÍAS */}
      <View style={styles.categories}>
        {categories.map((category) => (
          <CategoryTag
            key={category.value}
            text={category.text}
            selected={selectedCategory === category.value}
            onPress={() => setSelectedCategory(category.value)}
          />
        ))}
      </View>

      {/* Card principal */}
      <View style={styles.card}>
        <Text style={styles.label}>¿Cuál es el problema?</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Tubo roto frente a casa 14"
          placeholderTextColor={colors.placeholder}
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={[styles.label, styles.spacedLabel]}>
          Detalles de la situación
        </Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Describe lo que ocurre para que el personal correspondiente pueda solucionarlo..."
          placeholderTextColor={colors.placeholder}
          value={detalles}
          onChangeText={setDetalles}
          multiline
          textAlignVertical="top"
        />

        <Text style={[styles.label, styles.spacedLabel]}>
          Ubicación aproximada
        </Text>
        <View style={styles.locationBox}>
          <MapPin size={16} color={colors.primary} />
          {locationLoading ? (
            <View style={styles.locationLoading}>
              <ActivityIndicator size="small" color={colors.primary} />
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
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <MapPin size={16} color={colors.primary} />
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
                  <Pressable
                    style={styles.removePhoto}
                    onPress={() => quitarFoto(uri)}
                  >
                    <X size={14} color={colors.surface} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
          <View style={styles.photoActions}>
            <Pressable
              style={[styles.photoBox, styles.photoAction]}
              onPress={tomarFoto}
            >
              <Camera size={20} color={colors.primary} />
              <Text style={styles.photoText}>Cámara</Text>
            </Pressable>
            <Pressable
              style={[styles.photoBox, styles.photoAction]}
              onPress={elegirDeGaleria}
            >
              <ImagePlus size={20} color={colors.primary} />
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
        <Pressable
          style={styles.submitButton}
          onPress={enviarReporte}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text style={styles.submitText}>Enviar reporte</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    categories: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
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
      backgroundColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontFamily: 'Inter_700Bold',
      fontSize: 18,
      color: colors.text,
    },
    label: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.text,
      marginBottom: 8,
    },
    spacedLabel: {
      marginTop: 16,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 13,
      color: colors.text,
    },
    textarea: {
      minHeight: 90,
    },
    locationBox: {
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.text,
      flexShrink: 1,
    },
    coordsText: {
      fontSize: 11,
      color: colors.textSecondary,
      fontFamily: 'Inter_600SemiBold',
    },
    locationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.disabled,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    locationButtonText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.primary,
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
      borderColor: colors.border,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.background,
    },
    photoText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.primary,
    },
    priorityRow: {
      flexDirection: 'row',
      gap: 8,
    },
    priorityChip: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
    },
    priorityChipSelected: {
      backgroundColor: colors.warning,
      borderColor: colors.warning,
    },
    priorityText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.text,
    },
    priorityTextSelected: {
      color: colors.warning,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    submitText: {
      fontFamily: 'Inter_700Bold',
      fontSize: 15,
      color: colors.surface,
    },
  })
