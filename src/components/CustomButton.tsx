import { JSX } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

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
  const styles = getStyles(variant)
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  )
}

const getStyles = (variant: Variants) =>
  StyleSheet.create({
    button: {
      backgroundColor:
        variant === 'primary'
          ? '#1E2744'
          : variant === 'secondary'
            ? '#0145ea'
            : '#FFFFFF',

      borderColor: variant === 'primary' ? '#1E2744' : '#0145ea',
      borderWidth: 1,
      borderRadius: 17,
      width: 272,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 14,
      fontFamily: 'MontserratAlternates_400Regular',
      fontWeight: 'semibold',
      color: variant === 'default' ? '#0145ea' : '#FFFFFF',
    },
  })
