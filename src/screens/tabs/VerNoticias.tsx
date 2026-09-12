import { useState } from 'react'
import { FlatList, StyleSheet, Text, View, } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CommunityCard from '../../components/CommunityCard'
import { CategoryTag } from '../../components/CategoryTag'

import Patronato from '@assets/patronato.png'
import SearchBar from '../../components/SearchBar'

type Category = 'todos' | 'avisos' | 'eventos' | 'mantenimiento'

export const VerNoticias = () => {
  const insets = useSafeAreaInsets()

  const [selectedCategory, setSelectedCategory] =
    useState<Category>('todos')
  const [search, setSearch] = useState('')

  const notices = [
    // las 3 que ya tienes...

    {
      id: '4',
      title: 'Mantenimiento de áreas comunes',
      description:
        'Se realizará mantenimiento general durante el fin de semana.',
      time: '06 Oct 2024',
      category: 'mantenimiento' as const,
      image: Patronato,
    },
    {
      id: '5',
      title: 'Nueva reunión comunitaria',
      description:
        'Los vecinos están invitados a la próxima reunión mensual.',
      time: '04 Oct 2024',
      category: 'eventos' as const,
      image: Patronato,
    },
    {
      id: '6',
      title: 'Aviso importante para residentes',
      description:
        'Recuerda mantener actualizados tus datos de contacto.',
      time: '01 Oct 2024',
      category: 'avisos' as const,
      image: Patronato,
    },
  ]

  const categories: {
    text: string
    value: Category
  }[] = [
      {
        text: 'Todos',
        value: 'todos',
      },
      {
        text: 'Avisos',
        value: 'avisos',
      },
      {
        text: 'Eventos',
        value: 'eventos',
      },
      {
        text: 'Mantenimiento',
        value: 'mantenimiento',
      },
    ]
  //FILTRADO POR ETIQUETA
  const filteredNotices = notices.filter(notice => {
    const matchesCategory =
      selectedCategory === 'todos' ||
      notice.category === selectedCategory

      //FILTRADO POR BUSQUEDA
    const matchesSearch =
      notice.title.toLowerCase().includes(search.toLowerCase()) ||
      notice.description.toLowerCase().includes(search.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* ENCABEZADO */}
      <View style={styles.header}>
        <Text style={styles.title}>Novedades</Text>

        <Text style={styles.subtitle}>
          Infórmate sobre lo que pasa en tu comunidad
        </Text>

        <SearchBar
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* CATEGORÍAS */}
      <View style={styles.categories}>
        {categories.map(category => (
          <CategoryTag
            key={category.value}
            text={category.text}
            selected={
              selectedCategory === category.value
            }
            onPress={() =>
              setSelectedCategory(category.value)
            }
          />
        ))}
      </View>

      {/* NOTICIAS */}
      <FlatList
        data={filteredNotices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CommunityCard
            title={item.title}
            description={item.description}
            image={item.image}
            time={item.time}
            category={item.category}
            variant="notices"
            onPress={() => { }}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 15,
  },

  header: {
    marginBottom: 14,
  },

  title: {
    fontFamily: 'MontserratAlternates_800ExtraBold',
    fontSize: 26,
    color: '#1E2744',
  },

  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },

  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  list: {
    gap: 14,
    paddingBottom: 20,
  },
})