import { JSX, useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'
import CommunityCard from '../../components/CommunityCard'
import { CategoryTag } from '../../components/CategoryTag'

import Patronato from '@assets/patronato.png'
import SearchBar from '../../components/SearchBar'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { setNews } from '../../store/slices/newsSlice'
import { setCommunities } from '../../store/slices/communitySlice'
import { newsService, communityService } from '../../services'
import { store } from '../../store'
import { mergeById } from '../../utils/mergeById'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/StackNavigator'

type Category = 'todos' | 'avisos' | 'eventos' | 'mantenimiento'

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>
}

export const VerNoticias = ({ navigation }: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()

  const [selectedCategory, setSelectedCategory] = useState<Category>('todos')
  const [search, setSearch] = useState('')

  const dispatch = useAppDispatch()
  const userId = useAppSelector((state) => state.userProfile.id)
  const communities = useAppSelector((state) => state.community.communities)
  const allNews = useAppSelector((state) => state.news.news)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (!userId || !isFocused) return

    const loadNews = async () => {
      try {
        let communityIds = communities.map((community) => community.id)

        if (communityIds.length === 0) {
          const comms = await communityService.fetchCommunitiesByUser(userId)
          dispatch(setCommunities(comms))
          communityIds = comms.map((community) => community.id)
        }

        const remoteNews = await newsService.fetchNews(communityIds)

        dispatch(
          setNews(
            mergeById(store.getState().news.news, remoteNews),
          ),
        )
      } catch (error) {
        console.error(
          '[VerNoticias] Error al cargar noticias:',
          error,
        )
      }
    }

    loadNews()
  }, [dispatch, userId, isFocused])

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

  //SOLO NOTICIAS PUBLICADAS DE LAS COMUNIDADES DEL USUARIO
  const filteredNotices = allNews.filter((notice) => {
    const matchesStatus = notice.status === 'publicada'

    //FILTRADO POR ETIQUETA
    const matchesCategory =
      selectedCategory === 'todos' || notice.category === selectedCategory

    //FILTRADO POR BUSQUEDA
    const matchesSearch =
      notice.title.toLowerCase().includes(search.toLowerCase()) ||
      (notice.content ?? '').toLowerCase().includes(search.toLowerCase())

    return matchesStatus && matchesCategory && matchesSearch
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
      {filteredNotices.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Aún no hay noticias en tus comunidades.
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