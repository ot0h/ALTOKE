import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
  Text,
} from 'react-native'
import CustomLabel from './CustomLabel'

type Props = {
  title: string
  description?: string
  image: ImageSourcePropType
  time?: string
  author?: string
  //PARA LA BADGE
  category?: 'avisos' | 'mantenimiento'

  onPress: () => void

  variant?: 'compact' | 'extended' | 'notices'
}

export default function CommunityCard({
  title,
  onPress,
  description,
  image,
  time,
  author,
  variant = 'compact',
  category,
}: Props) {
  const isCompact = variant === 'compact'
  const isExtended = variant === 'extended'
  const isNotice = variant === 'notices'

  return (
    <Pressable
      style={[
        styles.card,

        isCompact && styles.compactmode,
        isCompact && styles.compact,

        isExtended && styles.extendedmode,
        isExtended && styles.extend,

        isNotice && styles.noticeMode,
        isNotice && styles.notice,
      ]}
      onPress={onPress}
    >
      <Image
        style={[
          styles.image,

          isCompact && styles.imagecompact,

          isExtended && styles.imageextended,

          isNotice && styles.imagenotice,
        ]}
        source={image}
      />
      {isCompact && (
        <View style={styles.textcontainer}>
          <Text style={styles.titlecompact}>{title}</Text>

          <Text style={styles.subtitle}>
            {time && author ? `${time} • ${author}` : time || author}
          </Text>
        </View>
      )}

      {isExtended && (
        <View style={styles.extendtextcontainer}>
          <Text style={styles.textextend}>{title}</Text>

          <Text style={styles.extendsubtitle}>{description}</Text>
        </View>
      )}

      {isNotice && (
        <View style={styles.noticecontainer}>
          <View style={styles.noticeHeader}>
            <Text style={styles.noticeTime}>{time}</Text>

            {category && <CustomLabel status={category} />}
          </View>

          <Text style={styles.noticeTitle}>{title}</Text>

          {description && (
            <Text style={styles.noticeDescription} numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: '#FFFF',
    width: 362,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
  },
  compact: {
    height: 88,
  },
  extend: {
    height: 218,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: '#000000',
    shadowRadius: 8,
    shadowOpacity: 0.15,
    elevation: 4,
  },

  extendsubtitle: {
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    fontSize: 13,
  },
  textcontainer: {
    gap: 4,
    marginLeft: 12,
    marginTop: 15,
  },
  titlecompact: {
    fontFamily: 'Inter_600SemiBold',
    fontWeight: 'semibold',
    fontSize: 14,
    color: '#1E2744',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    fontSize: 11,
  },
  compactmode: {
    borderColor: '#E2E8F0',
    borderRadius: 15,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
  },
  extendedmode: {
    flexDirection: 'column',
  },

  extendtextcontainer: {
    gap: 4,
    marginLeft: 16,
    marginTop: 14,
  },
  textextend: {
    fontFamily: 'MontserratAlternates_800ExtraBold',
    fontWeight: 'semibold',
    fontSize: 18,
    color: '#1E2744',
  },

  image: {
    objectFit: 'cover',
  },

  imagecompact: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },

  imageextended: {
    width: '100%',
    height: 140,
  },

  noticeMode: {
    flexDirection: 'column',
  },

  notice: {
    // altura según contenido o Figma
  },

  noticecontainer: {
    padding: 14,
    gap: 8,
  },

  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  noticeTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748B',
  },

  noticeTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#1E2744',
  },

  noticeDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748B',
  },

  imagenotice: {
    width: '100%',
    height: 130,
  },
})
