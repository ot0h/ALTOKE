import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CustomButton } from '@components'
import ManageNoticeCard from '../components/ManageNoticeCard'
import Patronato from '@assets/patronato.png'

export const ManageNotices = () => {
  const insets = useSafeAreaInsets()

  const notices = [
    {
      id: '1',
      title: 'Paneles solares vecinales',
      time: '12 Oct 2024',
      status: 'publicada' as const,
      image: Patronato,
    },
    {
      id: '2',
      title: 'Jornada de poda general',
      time: '15 Oct 2024',
      status: 'borrador' as const,
      image: Patronato,
    },
    {
      id: '3',
      title: 'Campaña de reciclaje',
      time: '10 Oct 2024',
      status: 'publicada' as const,
      image: Patronato,
    },
  ]

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Gestión noticias
        </Text>

        <View style={styles.createButton}>
          <CustomButton
            text="+  Crear"
            variant="secondary"
            onPress={() => {}}
          />
        </View>
      </View>

      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ManageNoticeCard
            title={item.title}
            time={item.time}
            status={item.status}
            image={item.image}
            onEdit={() => {
              console.log('Editar', item.id)
            }}
            onDelete={() => {
              console.log('Eliminar', item.id)
            }}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 9,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 28,
    color: '#1E2744',
  },

  createButton: {
    width: 115,
  },

  list: {
    gap: 16,
    paddingBottom: 20,
  },
})