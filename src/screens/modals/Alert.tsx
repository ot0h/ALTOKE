import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

type Props = {
  text: string
  onPress: () => void
  visible: boolean
  onCancel?: () => void
}

export default function Alert({
  text,
  onPress,
  visible = false,
  onCancel,
}: Props) {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.text}>
            {text}
          </Text>

          {onCancel && (
            <Pressable
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>
                Cancelar
              </Text>
            </Pressable>
          )}

          <Pressable
            style={styles.button}
            onPress={onPress}
          >
            <Text style={styles.buttonText}>
              {onCancel ? 'Eliminar' : 'Aceptar'}
            </Text>
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
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    modal: {
      width: 280,
      padding: 24,
      borderRadius: 18,
      backgroundColor: colors.surface,
      alignItems: 'center',
      gap: 20,
    },

    text: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
    },

    button: {
      paddingHorizontal: 28,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },

    buttonText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.surface,
    },
    cancelButton: {
  paddingHorizontal: 28,
  paddingVertical: 10,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: colors.border,
  alignItems: 'center',
},

cancelText: {
  fontFamily: 'Inter_600SemiBold',
  fontSize: 14,
  color: colors.text,
},
  })