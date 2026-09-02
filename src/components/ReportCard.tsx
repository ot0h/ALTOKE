import { Pressable, StyleSheet, Text, View } from 'react-native'
import CustomLabel from './CustomLabel'
import LocationIcon from '@assets/Icon-pin.svg'

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
            #{report} • {time}
          </Text>
        ) : (
          //SECCION EXPANDIDA
          <>
            <Text style={styles.subtitle}>
              #{report} • {time}
            </Text>

            <View style={styles.details}>
              <Text style={styles.category}>{category}</Text>
              <LocationIcon width={12} height={12} />{' '}
              <Text style={styles.subtitle}>{location}</Text>
            </View>
          </>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 362,

    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 20,

    padding: 12,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',
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
    color: '#1E2744',
  },

  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#64748B',
  },

  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },

  category: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#1E2744',

    backgroundColor: '#F8FAFC',

    paddingHorizontal: 8,
    paddingVertical: 4,

    borderRadius: 8,
  },
})
