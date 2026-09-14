import {
  Image,
  Text,
  ImageSourcePropType,
  Pressable,
  View,
  StyleSheet,
} from 'react-native'
import CustomLabel from './CustomLabel'
import DeletIcon from '@assets/Delete.svg'
import EditIcon from '@assets/Edit.svg'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Props = {
  time: string
  status: 'publicada' | 'borrador'
  title: string
  image: ImageSourcePropType
  onEdit: () => void
  onDelete: () => void
}

export default function ({
  time,
  status = 'borrador',
  title,
  image,
  onEdit,
  onDelete,
}: Props) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.info}>
          <Text style={styles.subtitle}>{time}</Text>
          <CustomLabel status={status} />
        </View>
      </View>

      <View style={styles.icons}>
        <Pressable onPress={onEdit}>
          <EditIcon />
        </Pressable>
        <Pressable onPress={onDelete}>
          <DeletIcon />
        </Pressable>
      </View>
    </View>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      flex: 1,
      gap: 4,
    },

    title: {
      fontFamily: 'Inter_600SemiBold',
      fontWeight: 'semibold',
      fontSize: 14,
      color: colors.text,
    },

    info: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    icons: {
      height: 40,
      flexDirection: 'row',
      gap: 14,
      objectFit: 'fill',
    },

    subtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      fontFamily: 'Inter_400Regular',
    },

    container: {
      width: 362,
      height: 80,
      padding: 10,
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 16,
      borderColor: colors.border,
      gap: 12,
      alignItems: 'center',
    },

    image: {
      width: 56,
      height: 56,
      objectFit: 'cover',
      borderRadius: 10,
    },
  })
