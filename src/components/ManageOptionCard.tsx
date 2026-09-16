import { JSX } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ChevronRight } from 'lucide-react-native'

import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Props = {
  title: string
  description: string
  icon: React.ComponentType<{
    size?: number
    color?: string
  }>
  onPress: () => void
}

export const ManageOptionCard = ({
  title,
  description,
  icon: Icon,
  onPress,
}: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon
          size={22}
          color={colors.primary}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>

      <ChevronRight
        size={20}
        color={colors.textSecondary}
      />
    </Pressable>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      minHeight: 78,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 14,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
    },

    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },

    info: {
      flex: 1,
      gap: 4,
    },

    title: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
      color: colors.text,
    },

    description: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
    },
  })