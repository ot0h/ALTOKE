import { Pressable, StyleSheet, Text } from 'react-native'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Props = {
  text: string
  selected?: boolean
  onPress?: () => void
}

export const CategoryTag = ({ text, selected = false, onPress }: Props) => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  return (
    <Pressable
      style={[styles.tag, selected && styles.selected]}
      onPress={onPress}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{text}</Text>
    </Pressable>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    tag: {
      paddingHorizontal: 20,
      paddingVertical: 12,

      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,

      backgroundColor: colors.surface,

      alignItems: 'center',
      justifyContent: 'center',
    },

    selected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    text: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      color: colors.text,
    },

    selectedText: {
      color: colors.surface,
    },
  })
