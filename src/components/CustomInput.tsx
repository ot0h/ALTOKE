import { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Props = {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  variant?: 'code' | 'password' | 'primary' | 'email'
}
export const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  variant = 'primary',
}: Props) => {
  const [isSecureText, setisSecureText] = useState(true)
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          variant === 'code' ? { textTransform: 'uppercase' } : null,
        ]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        onChangeText={onChangeText}
        maxLength={variant === 'code' ? 8 : undefined}
        keyboardType={variant === 'email' ? 'email-address' : 'default'}
        secureTextEntry={variant === 'password' && isSecureText}
      />
      {variant === 'password' && (
        <Pressable
          style={styles.eyeButton}
          onPress={() => setisSecureText(!isSecureText)}
        >
          <Ionicons
            name={isSecureText ? 'eye-off' : 'eye'}
            size={20}
            color={colors.textMuted}
          />
        </Pressable>
      )}
    </View>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    input: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderColor: colors.borderInput,
      borderWidth: 1,
      height: 40,
      fontSize: 16,
      fontFamily: 'MontserratAlternates_600SemiBold',
      color: colors.textMuted,
      textAlign: 'left',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      paddingLeft: 15,
      paddingRight: 40,
    },

    inputContainer: {
      width: 266,
      position: 'relative',
      justifyContent: 'center',
    },
    eyeButton: {
      position: 'absolute',
      right: 12,
      zIndex: 1,
    },
  })
