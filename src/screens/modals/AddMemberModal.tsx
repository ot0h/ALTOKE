import { useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Search, UserPlus } from 'lucide-react-native'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { UserProfile } from '../../types'
import { membershipService, userProfileService } from '../../services'

type Props = {
  visible: boolean
  communityId: string
  onClose: () => void
  onAdded: () => void
}

export default function AddMemberModal({
  visible,
  communityId,
  onClose,
  onAdded,
}: Props) {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const [term, setTerm] = useState('')
  const [searching, setSearching] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [candidates, setCandidates] = useState<UserProfile[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  const buscar = async () => {
    if (!term.trim()) return

    setSearching(true)
    setErrorMessage('')
    try {
      const [profiles, members] = await Promise.all([
        userProfileService.searchProfiles(term),
        membershipService.fetchCommunityMembers(communityId),
      ])

      const memberIds = new Set(members.map((member) => member.userId))

      setCandidates(profiles.filter((profile) => !memberIds.has(profile.id)))
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Error al buscar usuarios',
      )
    } finally {
      setSearching(false)
    }
  }

  const agregar = async (profile: UserProfile) => {
    setAddingId(profile.id)
    setErrorMessage('')
    try {
      await membershipService.joinCommunity(profile.id, communityId, 'user')

      setTerm('')
      setCandidates([])
      onAdded()
      onClose()
    } catch (error) {
      const code = (error as { code?: string }).code

      setErrorMessage(
        code === '23505'
          ? `${profile.name} ya es miembro de esta comunidad.`
          : error instanceof Error
            ? error.message
            : 'No se pudo agregar al miembro',
      )
    } finally {
      setAddingId(null)
    }
  }

  const cerrar = () => {
    setTerm('')
    setCandidates([])
    setErrorMessage('')
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={cerrar}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Agregar miembro</Text>

          <Text style={styles.description}>
            Busca al vecino por nombre o correo para agregarlo a la comunidad.
          </Text>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              value={term}
              onChangeText={setTerm}
              placeholder="Nombre o correo"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              returnKeyType="search"
              onSubmitEditing={buscar}
            />

            <Pressable style={styles.searchButton} onPress={buscar}>
              {searching ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Search size={18} color="#FFFFFF" />
              )}
            </Pressable>
          </View>

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <View style={styles.results}>
            {candidates.map((profile) => (
              <View key={profile.id} style={styles.resultRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(profile.name || profile.email).charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>
                    {profile.name || 'Sin nombre'}
                  </Text>

                  <Text style={styles.resultEmail}>{profile.email}</Text>
                </View>

                <Pressable
                  style={styles.addButton}
                  onPress={() => agregar(profile)}
                  disabled={addingId !== null}
                >
                  {addingId === profile.id ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <UserPlus size={16} color="#FFFFFF" />
                  )}
                </Pressable>
              </View>
            ))}

            {!searching &&
              term.trim() !== '' &&
              !errorMessage &&
              candidates.length === 0 && (
                <Text style={styles.description}>
                  No hay vecinos que coincidan. Todos ya son miembros o no
                  existen con ese término.
                </Text>
              )}
          </View>

          <Pressable style={styles.closeTextButton} onPress={cerrar}>
            <Text style={styles.closeText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },

    modal: {
      width: '100%',
      maxWidth: 380,
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
    },

    title: {
      fontFamily: 'MontserratAlternates_800ExtraBold',
      fontSize: 21,
      color: colors.text,
      marginBottom: 8,
    },

    description: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },

    searchRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },

    input: {
      flex: 1,
      height: 44,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.text,
    },

    searchButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    error: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.error,
      marginBottom: 12,
    },

    results: {
      flexDirection: 'column',
      gap: 10,
    },

    resultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 10,
      borderRadius: 14,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },

    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    avatarText: {
      fontFamily: 'MontserratAlternates_700Bold',
      fontSize: 15,
      color: colors.surface,
    },

    resultInfo: {
      flex: 1,
      gap: 1,
    },

    resultName: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
    },

    resultEmail: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },

    addButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    closeTextButton: {
      alignSelf: 'center',
      marginTop: 16,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },

    closeText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.primary,
    },
  })
