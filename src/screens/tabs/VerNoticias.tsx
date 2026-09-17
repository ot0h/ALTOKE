import { useState } from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CommunityCard from '../../components/CommunityCard'
import { CategoryTag } from '../../components/CategoryTag'

import Patronato from '@assets/patronato.png'
import SearchBar from '../../components/SearchBar'
import { useAppSelector } from '../../store/hook'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@navigation/StackNavigator'

type Category = 'todos' | 'avisos' | 'eventos' | 'mantenimiento'

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>
}

export const VerNoticias = ({ navigation }: Props) => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()

  const [selectedCategory, setSelectedCategory] = useState<Category>('todos')
  const [search, setSearch] = useState('')

  const notices = useAppSelector((state) => state.news.news)

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
  const filteredNotices = notices.filter((notice) => {
    const matchesCategory =
      selectedCategory === 'todos' || notice.category === selectedCategory

    //FILTRADO POR BUSQUEDA
    const matchesSearch =
      notice.title.toLowerCase().includes(search.toLowerCase()) ||
      (notice.content ?? '').toLowerCase().includes(search.toLowerCase())

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

        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      {/* CATEGORÍAS */}
      <View style={styles.categories}>
        {categories.map((category) => (
          <CategoryTag
            key={category.value}
            text={category.text}
            selected={selectedCategory === category.value}
            onPress={() => setSelectedCategory(category.value)}
          />
        ))}
      </View>

      {/* NOTICIAS */}
      {notices.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Aún no hay noticias. Publica la primera desde «Nueva Noticia».
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommunityCard
              title={item.title}
              description={item.content}
              image={item.image ? { uri: item.image } : Patronato}
              time={
                item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : undefined
              }
              category={item.category}
              variant="notices"
              onPress={() => navigation.getParent()?.navigate('Noticia', {
                noticeId: item.id,
              })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      )}
    </View>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 15,
    },

    header: {
      marginBottom: 14,
    },

    title: {
      fontFamily: 'MontserratAlternates_800ExtraBold',
      fontSize: 26,
      color: colors.text,
    },

    subtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.textSecondary,
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
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  })
