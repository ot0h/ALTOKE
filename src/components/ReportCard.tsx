import { Pressable, StyleSheet, Text, View } from 'react-native'
import CustomLabel from './CustomLabel'
import LocationIcon from '@assets/Icon-pin.svg'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Props = {
  title: string
  status: 'revision' | 'resuelto' | 'pendiente' | 'proceso'
  report: string
  category: string
  time?: string
  location?: string
  onPress: () => void
  variant?: 'contract' | 'expand'
}

export default function ReportCard({
  title,
  status = 'pendiente',
  report,
  category,
  time,
  location,
  onPress,
  variant = 'contract',
}: Props) {
  const isContract = variant === 'contract'
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <Pressable
      style={[
        styles.card,
        isContract ? styles.contractCard : styles.expandCard,
      ]}
      onPress={onPress}
    >
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>

          <CustomLabel status={status} />
        </View>

        {/*HOME CARD*/}

        {isContract ? (
          <Text style={styles.subtitle}>
            #{report.slice(0,8)} • {time ? new Date(time).toLocaleString('es-HN') : ''}
          </Text>
        ) : (
          //SECCION EXPANDIDA
          <>
            <Text style={styles.subtitle}>
              #{report.slice(0,8)} • {time}
            </Text>

            <View style={styles.details}>
              <Text
                style={styles.category}
                numberOfLines={1}
              >
                {category}
              </Text>
              <LocationIcon width={12} height={12} />
              <Text style={styles.subtitle} numberOfLines={1}>
                {location}
              </Text>
            </View>
          </>
        )}
      </View>
    </Pressable>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      width: 362,

      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 20,

      padding: 12,

      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',

      backgroundColor: colors.surface,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    contractCard: {
      height: 56,
    },

    expandCard: {
      height: 98,
    },

    container: {
      flex: 1,
      flexDirection: 'column',
      gap: 4,
    },

    title: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      color: colors.text,
    },

    subtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
      
    },

    details: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 4,
    },

    category: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.text,

      backgroundColor: colors.background,

      paddingHorizontal: 8,
      paddingVertical: 3,

      borderRadius: 8,

      maxWidth: '45%',
      overflow: 'hidden',
    },
  })
