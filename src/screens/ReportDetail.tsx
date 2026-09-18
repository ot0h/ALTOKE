import { JSX, useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Send,
  StickyNote,
  Tag,
  Trash2,
} from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import CustomLabel from '../components/CustomLabel'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { useAppSelector } from '../store/hook'
import { Report, ReportNote, ReportStatus } from '../types'
import { reportService } from '../services'
import { RootStackParamList } from '../navigation/StackNavigator'

type Props = {
  route: {
    params: {
      reportId: string
      communityId: string
      canManage: boolean
    }
  }
}

const STATUS_OPTIONS: ReportStatus[] = [
  'revision',
  'pendiente',
  'proceso',
  'resuelto',
]

const STATUS_LABELS: Record<ReportStatus, { label: string; color: string }> = {
  revision: { label: 'Revisión', color: '#3B82F6' },
  pendiente: { label: 'Pendiente', color: '#F59E0B' },
  proceso: { label: 'Proceso', color: '#3E6CB0' },
  resuelto: { label: 'Resuelto', color: '#10B981' },
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export const ReportDetail = ({ route }: Props): JSX.Element => {
  const { reportId, communityId, canManage } = route.params

  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()

  const navigation = useNavigation<NavigationProp>()
  const isFocused = useIsFocused()

  const userId = useAppSelector((state) => state.userProfile.id)

  const [report, setReport] = useState<Report | null>(null)
  const [notes, setNotes] = useState<ReportNote[]>([])
  const [notesAvailable, setNotesAvailable] = useState(true)
  const [noteText, setNoteText] = useState('')
  const [saving, setSaving] = useState(false)
  const [failedFotos, setFailedFotos] = useState<Record<string, boolean>>({})

  const loadDetail = useCallback(async () => {
    try {
      const remote = await reportService.fetchReport(reportId)
      setReport(remote)
      setNotes(remote.notes ?? [])
      setNotesAvailable(remote.notes !== undefined)
    } catch (error) {
      console.error('[ReportDetail] Error al cargar reporte:', error)
    }
  }, [reportId])

  const fotoFallback = (uri: string) => {
    setFailedFotos((current) => ({ ...current, [uri]: true }))
  }

  useEffect(() => {
    if (!isFocused) return
    loadDetail()
  }, [isFocused, loadDetail])

  const cambiarStatus = async (status: ReportStatus) => {
    try {
      const updated = await reportService.updateReportStatus(reportId, status)
      setReport((current) => (current ? { ...current, status } : updated))
    } catch (error) {
      console.error('[ReportDetail] Error al cambiar status:', error)
    }
  }

  const agregarNota = async () => {
    const content = noteText.trim()
    if (!content || !userId || saving) return

    setSaving(true)
    setNoteText('')

    try {
      const note = await reportService.addReportNote(reportId, userId, content)
      setNotes((current) => [...current, note])
    } catch (error) {
      console.error('[ReportDetail] Error al agregar nota:', error)
      Alert.alert('Error', 'No se pudo agregar la nota.')
    } finally {
      setSaving(false)
    }
  }

  const eliminarNota = (noteId: string) => {
    Alert.alert(
      'Eliminar nota',
      '¿Seguro que deseas eliminar esta anotación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await reportService.removeReportNote(noteId)
              setNotes((current) =>
                current.filter((note) => note.id !== noteId),
              )
            } catch (error) {
              console.error('[ReportDetail] Error al eliminar nota:', error)
            }
          },
        },
      ],
    )
  }

  const fotos = report?.fotos && report.fotos.length > 0 ? report.fotos : []
  const foto = fotos[0]

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top + 16 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>

        <Text style={styles.title}>Detalle del reporte</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {report && (
          <>
            <View style={styles.card}>
              <Text style={styles.reportTitle}>{report.title}</Text>

              <Text style={styles.reportMeta}>
                #{report.id.slice(0, 8).toUpperCase()}
              </Text>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <CalendarDays size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <MapPin size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{report.location}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Tag size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>{report.category}</Text>
              </View>
            </View>

            {foto ? (
              <View style={styles.fotoGallery}>
                {fotos.map((uri) => {
                  const source = failedFotos[uri]
                    ? { uri: uri.split('?')[0] }
                    : { uri }

                  return (
                    <Image
                      key={uri}
                      source={source}
                      style={styles.foto}
                      resizeMode="cover"
                      onError={() => fotoFallback(uri)}
                    />
                  )
                })}
              </View>
            ) : null}

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>
                {report.description || 'Sin descripción.'}
              </Text>
            </View>

            {canManage && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Estado</Text>
                <CustomLabel status={report.status} />

                <View style={styles.statusRow}>
                  {STATUS_OPTIONS.map((option) => {
                    const active = report.status === option
                    const config = STATUS_LABELS[option]

                    return (
                      <Pressable
                        key={option}
                        style={[
                          styles.statusChip,
                          active && {
                            backgroundColor: config.color,
                            borderColor: config.color,
                          },
                        ]}
                        onPress={() => cambiarStatus(option)}
                      >
                        <Text
                          style={[
                            styles.statusChipText,
                            active && { color: colors.surface },
                          ]}
                        >
                          {config.label}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>
            )}
          </>
        )}

        <View style={styles.card}>
          <View style={styles.notesHeader}>
            <StickyNote size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Anotaciones</Text>
          </View>

          {!notesAvailable ? (
            <Text style={styles.noNotes}>
              Las anotaciones aún no están disponibles para este reporte.
            </Text>
          ) : notes.length === 0 ? (
            <Text style={styles.noNotes}>
              {canManage
                ? 'Aún no hay anotaciones. Agrega la primera para dar seguimiento.'
                : 'Aún no hay anotaciones para este reporte.'}
            </Text>
          ) : (
            <View style={styles.notesList}>
              {notes.map((note) => (
                <View key={note.id} style={styles.note}>
                  <Image
                    style={styles.noteAvatar}
                    source={
                      note.authorAvatar
                        ? { uri: note.authorAvatar }
                        : require('@assets/default-avatar.png')
                    }
                  />

                  <View style={styles.noteContent}>
                    <View style={styles.noteHeader}>
                      <Text style={styles.noteAuthor}>
                        {note.author || 'Vecino'}
                      </Text>

                      {note.userId === userId && (
                        <Pressable
                          hitSlop={8}
                          onPress={() => eliminarNota(note.id)}
                        >
                          <Trash2
                            size={15}
                            color={colors.textSecondary}
                          />
                        </Pressable>
                      )}
                    </View>

                    <Text style={styles.noteText}>{note.content}</Text>

                    <Text style={styles.noteDate}>
                      {new Date(note.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {canManage && notesAvailable && (
        <View
          style={[
            styles.noteInputRow,
            { paddingBottom: insets.bottom + 8 },
          ]}
        >
          <TextInput
            style={styles.noteInput}
            placeholder="Agregar anotación…"
            placeholderTextColor={colors.textSecondary}
            value={noteText}
            onChangeText={setNoteText}
            multiline
            maxLength={500}
          />

          <Pressable
            style={[
              styles.sendButton,
              !noteText.trim() && styles.sendButtonDisabled,
            ]}
            disabled={!noteText.trim() || saving}
            onPress={agregarNota}
          >
            <Send size={18} color={colors.surface} />
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingHorizontal: 16,
      marginBottom: 16,
    },

    backButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    title: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 22,
      color: colors.text,
    },

    scrollContent: {
      paddingHorizontal: 16,
      gap: 14,
      paddingBottom: 24,
    },

    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 16,
      gap: 10,
    },

    reportTitle: {
      fontFamily: 'MontserratAlternates_700Bold',
      fontSize: 18,
      color: colors.text,
    },

    reportMeta: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },

    infoRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 14,
    },

    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    infoText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
    },

    fotoGallery: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },

    foto: {
      width: '48%',
      aspectRatio: 4 / 3,
      borderRadius: 18,
      backgroundColor: colors.surface,
    },

    sectionTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      color: colors.text,
    },

    description: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },

    statusRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    statusChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 100,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },

    statusChipText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.textSecondary,
    },

    notesHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    noNotes: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.textSecondary,
    },

    notesList: {
      gap: 14,
    },

    note: {
      flexDirection: 'row',
      gap: 10,
    },

    noteAvatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.primary,
    },

    noteContent: {
      flex: 1,
      gap: 2,
    },

    noteHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    noteAuthor: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
    },

    noteText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.text,
      lineHeight: 19,
    },

    noteDate: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
    },

    noteInputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 10,
      paddingHorizontal: 16,
      paddingTop: 8,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    noteInput: {
      flex: 1,
      minHeight: 42,
      maxHeight: 110,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.text,
    },

    sendButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    sendButtonDisabled: {
      opacity: 0.5,
    },
  })