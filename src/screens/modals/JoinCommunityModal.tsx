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

type Props = {
  visible: boolean
  onClose: () => void
}

type JoinState =
  | 'idle'
  | 'found'
  | 'joining'
  | 'success'
  | 'error'

export default function JoinCommunityModal({
  visible,
  onClose,
}: Props) {
  const [code, setCode] = useState('')
  const [state, setState] = useState<JoinState>('idle')
  const [communityName, setCommunityName] = useState('')

  const buscarComunidad = () => {
    if (!code.trim()) return

    // MOCK TEMPORAL
    // AQUÍ IRÁ LA CONSULTA A SUPABASE
    setCommunityName('Patronato Los Castaños')
    setState('found')
  }

  const unirse = () => {
    setState('joining')

    // MOCK TEMPORAL
    setTimeout(() => {
      setState('success')
    }, 1200)
  }

  const cerrar = () => {
    setCode('')
    setCommunityName('')
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
          <Pressable
            style={styles.closeButton}
            onPress={cerrar}
          >
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          {/* INGRESAR CÓDIGO */}
          {state === 'idle' && (
            <>
              <Text style={styles.title}>
                Unirse a una comunidad
              </Text>

              <Text style={styles.description}>
                Ingresa el código que te proporcionó tu
                comunidad.
              </Text>

              <CustomInput
                value={code}
                onChangeText={setCode}
                placeholder="Ej. ABC123"
                variant = "code"
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

          {/* COMUNIDAD ENCONTRADA */}
          {state === 'found' && (
            <>
              <Text style={styles.title}>
                Comunidad encontrada
              </Text>

              <View style={styles.communityBox}>
                <Text style={styles.communityName}>
                  {communityName}
                </Text>

                <Text style={styles.communityCode}>
                  Código: {code}
                </Text>
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
              <ActivityIndicator
                size="large"
                color="#0145EA"
              />

              <Text style={styles.title}>
                Uniéndote...
              </Text>

              <Text style={styles.description}>
                Estamos agregándote a{' '}
                {communityName}
              </Text>
            </View>
          )}

          {/* ÉXITO */}
          {state === 'success' && (
            <View style={styles.centerContent}>
              <Text style={styles.successIcon}>
                ✓
              </Text>

              <Text style={styles.title}>
                ¡Te has unido!
              </Text>

              <Text style={styles.description}>
                Ahora formas parte de{' '}
                {communityName}.
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

const styles = StyleSheet.create({
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
    backgroundColor: '#FFFFFF',
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
    color: '#64748B',
  },

  title: {
    fontFamily: 'MontserratAlternates_800ExtraBold',
    fontSize: 21,
    color: '#1E2744',
    marginBottom: 8,
  },

  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748B',
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },

  communityName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: '#1E2744',
    marginBottom: 4,
  },

  communityCode: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#64748B',
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