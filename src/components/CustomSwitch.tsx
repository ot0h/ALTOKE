import { useRef, useEffect } from 'react'
import { Animated, Pressable, StyleSheet } from 'react-native'

interface CustomSwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
}

export const CustomSwitch = ({ value, onValueChange }: CustomSwitchProps) => {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start()
  }, [value])

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#CBD5E1', '#0145EA'],
  })

  const thumbPosition = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  })

  return (
    <Pressable onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View
          style={[styles.thumb, { transform: [{ translateX: thumbPosition }] }]}
        />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F8FAFC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
})
