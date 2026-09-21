import { JSX } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'lucide-react-native'

import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Props = {
  value: string
  onChange: (uri: string) => void
  title: string
  detail?: string
}

export const ImageUpload = ({
  value,
  onChange,
  title,
  detail = 'Soporta JPG, PNG (máx. 5MB)',
}: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const elegirDeGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      selectionLimit: 1,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      onChange(result.assets[0].uri)
    }
  }

  return (
    <Pressable style={styles.photoBox} onPress={elegirDeGaleria}>
      {value ? (
        <Image source={{ uri: value }} style={styles.photoPreview} />
      ) : (
        <>
          <Camera size={20} color={colors.primary} />

          <Text style={styles.photoTitle}>{title}</Text>

          <Text style={styles.photoDetail}>{detail}</Text>
        </>
      )}
    </Pressable>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    photoBox: {
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.primary,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      height: 130,
      width: '100%',
      overflow: 'hidden',
    },

    photoPreview: {
      width: '100%',
      height: '100%',
      borderRadius: 14,
    },

    photoTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.primary,
    },

    photoDetail: {
      fontFamily: 'Inter_400Regular',
      fontSize: 10,
      color: colors.textSecondary,
    },
  })
