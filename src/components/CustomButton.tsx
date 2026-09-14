import { JSX } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Variants = 'default' | 'primary' | 'secondary'

type Props = {
  text: string
  onPress: () => void
  variant?: Variants
}

export const CustomButton = ({
  text,
  onPress,
  variant = 'default',
}: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = getStyles(variant, colors)
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  )
}

const getStyles = (variant: Variants, colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      backgroundColor:
        variant === 'primary'
          ? colors.primaryDark
          : variant === 'secondary'
            ? colors.primary
            : colors.surface,

      borderColor:
        variant === 'primary' ? colors.primaryDark : colors.primary,
      borderWidth: 1,
      borderRadius: 17,
      width: '100%',
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 14,
      fontFamily: 'MontserratAlternates_600SemiBold',
      fontWeight: 'semibold',
      color: variant === 'default' ? colors.primary : colors.surface,
      textAlign: 'center',
    },
  })
