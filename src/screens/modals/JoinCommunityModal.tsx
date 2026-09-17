import { CustomButton, CustomInput } from '@components'
import { useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { addCommunity } from '../../store/slices/communitySlice'
import { communityService, membershipService } from '../../services'
import { Community } from '../../types'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Props = {
  visible: boolean
  onClose: () => void
}

type JoinState =
  | 'idle'
  | 'searching'
  | 'found'
  | 'joining'
  | 'success'
  | 'error'

export default function JoinCommunityModal({ visible, onClose }: Props) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const [code, setCode] = useState('')
  const [state, setState] = useState<JoinState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [foundCommunity, setFoundCommunity] = useState<Community | null>(null)

  const userId = useAppSelector((state) => state.userProfile.id)
  const dispatch = useAppDispatch()

  const communityName = foundCommunity?.name ?? ''

  const buscarComunidad = async () => {
    if (!code.trim() || !userId) return

    setState('searching')
    try {
      const communities = await communityService.fetchCommunities()
      const term = code.trim().toUpperCase()
      const found = communities.find(
        (c) => c.code.toUpperCase() === term,
      )

      if (!found) {
        setErrorMessage(
          'No se encontró ninguna comunidad con ese código.',
        )
        setState('error')
        return
      }

      setFoundCommunity(found)
      setState('found')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Error al buscar la comunidad',
      )
      setState('error')
    }
  }

  const unirse = async () => {
    if (!userId || !foundCommunity) return

    setState('joining')
    try {
      await membershipService.joinCommunity(userId, foundCommunity.id)

      dispatch(addCommunity(foundCommunity))

      setState('success')
    } catch (error) {
      const code = (error as { code?: string }).code

      setErrorMessage(
        code === '23505'
          ? 'Ya formas parte de esta comunidad.'
          : error instanceof Error
            ? error.message
            : 'No se pudo unir a la comunidad',
      )
      setState('error')
    }
  }

  const cerrar = () => {
    setCode('')
    setFoundCommunity(null)
    setErrorMessage('')
    setState('idle')
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
          {/* CERRAR */}
          <Pressable style={styles.closeButton} onPress={cerrar}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          {/* INGRESAR CÓDIGO */}
          {state === 'idle' && (
            <>
              <Text style={styles.title}>Unirse a una comunidad</Text>

              <Text style={styles.description}>
                Ingresa el código que te proporcionó tu comunidad.
              </Text>

              <CustomInput
                value={code}
                onChangeText={setCode}
                placeholder="Ej. ABC123"
                variant="code"
              />

              <View style={styles.singleButton}>
                <CustomButton
                  text="Buscar comunidad"
                  variant="secondary"
                  onPress={buscarComunidad}
                />
              </View>
            </>
          )}

          {/* BUSCANDO */}
          {state === 'searching' && (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={colors.primary} />

              <Text style={styles.title}>Buscando...</Text>

              <Text style={styles.description}>
                Estamos buscando la comunidad {code.trim()}
              </Text>
            </View>
          )}

          {/* COMUNIDAD ENCONTRADA */}
          {state === 'found' && (
            <>
              <Text style={styles.title}>Comunidad encontrada</Text>

              <View style={styles.communityBox}>
                <Text style={styles.communityName}>{communityName}</Text>

                <Text style={styles.communityCode}>Código: {code}</Text>
              </View>

              <Text style={styles.description}>
                ¿Deseas unirte a esta comunidad?
              </Text>

              <View style={styles.buttonsRow}>
                <View style={styles.buttonWrapper}>
                  <CustomButton
                    text="Cancelar"
                    variant="default"
                    onPress={cerrar}
                  />
                </View>

                <View style={styles.buttonWrapper}>
                  <CustomButton
                    text="Unirme"
                    variant="secondary"
                    onPress={unirse}
                  />
                </View>
              </View>
            </>
          )}

          {/* UNIÉNDOSE */}
          {state === 'joining' && (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={colors.primary} />

              <Text style={styles.title}>Uniéndote...</Text>

              <Text style={styles.description}>
                Estamos agregándote a {communityName}
              </Text>
            </View>
          )}

          {/* ERROR */}
          {state === 'error' && (
            <>
              <Text style={styles.title}>No se pudo continuar</Text>

              <Text style={styles.description}>{errorMessage}</Text>

              <View style={styles.singleButton}>
                <CustomButton
                  text="Entendido"
                  variant="secondary"
                  onPress={cerrar}
                />
              </View>
            </>
          )}

          {/* ÉXITO */}
          {state === 'success' && (
            <View style={styles.centerContent}>
              <Text style={styles.successIcon}>✓</Text>

              <Text style={styles.title}>¡Te has unido!</Text>

              <Text style={styles.description}>
                Ahora formas parte de {communityName}.
              </Text>

              <View style={styles.singleButton}>
                <CustomButton
                  text="Continuar"
                  variant="secondary"
                  onPress={cerrar}
                />
              </View>
            </View>
          )}
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
      position: 'relative',
    },

    closeButton: {
      position: 'absolute',
      top: 12,
      right: 14,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },

    closeText: {
      fontSize: 28,
      color: colors.textSecondary,
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

    singleButton: {
      width: '100%',
      marginTop: 14,
    },

    buttonsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 4,
    },

    buttonWrapper: {
      flex: 1,
    },

    communityBox: {
      padding: 16,
      borderRadius: 16,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },

    communityName: {
      fontFamily: 'Inter_700Bold',
      fontSize: 17,
      color: colors.text,
      marginBottom: 4,
    },

    communityCode: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
    },

    centerContent: {
      alignItems: 'center',
    },

    successIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#D1FAE5',
      color: '#10B981',
      textAlign: 'center',
      lineHeight: 56,
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 16,
    },
  })
