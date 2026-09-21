import { JSX, useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Variants = 'default' | 'primary' | 'secondary'

type Props = {
  text: string
  onPress: () => void
  variant?: Variants
  loading?: boolean
}

export const CustomButton = ({
  text,
  onPress,
  variant = 'default',
  loading = false,
}: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = getStyles(variant, colors)

  const dots = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current

  useEffect(() => {
    if (!loading) return

    const animations = dots.map((dot, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.timing(dot, {
            toValue: -5,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ),
    )

    animations.forEach((animation) => animation.start())

    return () => {
      animations.forEach((animation) => animation.stop())
    }
  }, [loading])

  return (
    <Pressable style={styles.button} onPress={onPress} disabled={loading}>
      {loading ? (
        <View style={styles.dots}>
          {dots.map((dot, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.dot,
                {
                  transform: [{ translateY: dot }],
                },
              ]}
            >
              •
            </Animated.Text>
          ))}
        </View>
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
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

      borderColor: variant === 'primary' ? colors.primaryDark : colors.primary,
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

    dots: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 20,
    },

    dot: {
      fontSize: 20,
      fontWeight: 'bold',
      color: variant === 'default' ? colors.primary : colors.surface,
      marginHorizontal: 2,
    },
  })
