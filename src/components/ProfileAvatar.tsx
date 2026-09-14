import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import EditIcon from '@assets/Edit.svg'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Props = {
  image: ImageSourcePropType
  onEdit: () => void
}

export default function ProfileAvatar({ image, onEdit }: Props) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />

      <Pressable style={styles.editButton} onPress={onEdit}>
        <EditIcon width={16} height={16} />
      </Pressable>
    </View>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      width: 104,
      height: 104,
      position: 'relative',
    },

    image: {
      width: '100%',
      height: '100%',
      borderRadius: 52,
      objectFit: 'cover',
    },

    editButton: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',

      elevation: 3,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
  })
