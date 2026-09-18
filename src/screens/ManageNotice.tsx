import { JSX, useEffect, useMemo } from 'react'
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { CustomButton } from '@components'
import ManageNoticeCard from '../components/ManageNoticeCard'
import Patronato from '@assets/patronato.png'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { store } from '../store'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { removeNews, setNews } from '../store/slices/newsSlice'
import { newsService } from '../services'
import { mergeById } from '../utils/mergeById'
import { RootStackParamList } from '../navigation/StackNavigator'
import { ArrowLeft } from 'lucide-react-native'

type Props = NativeStackScreenProps<RootStackParamList, 'ManageNotices'>

export const ManageNotices = ({ route, navigation }: Props): JSX.Element => {
  const { communityId } = route.params

  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()

  const dispatch = useAppDispatch()

  const allNews = useAppSelector((state) => state.news.news)

  const news = useMemo(
    () => allNews.filter((notice) => notice.communityId === communityId),
    [allNews, communityId],
  )

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const remoteNews = await newsService.fetchNewsByCommunity(communityId)

        dispatch(setNews(mergeById(store.getState().news.news, remoteNews)))
      } catch (error) {
        console.error('[ManageNotices] Error al cargar noticias:', error)
      }
    }

    loadNotices()
  }, [dispatch, communityId])

  const eliminarNoticia = (noticeId: string) => {
    Alert.alert(
      'Eliminar noticia',
      '¿Seguro que deseas eliminar esta noticia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await newsService.deleteNews(noticeId)
              dispatch(removeNews(noticeId))
            } catch (error) {
              console.error('[ManageNotices] Error al eliminar:', error)
            }
          },
        },
      ],
    )
  }

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
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Gestión noticias</Text>

        <View style={styles.createButton}>
          <CustomButton
            text="+  Crear"
            variant="secondary"
            onPress={() =>
              navigation.navigate('NuevaNoticia', {
                communityId,
              })
            }
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {news.map((notice) => (
          <ManageNoticeCard
            key={notice.id}
            title={notice.title}
            time={
              notice.createdAt
                ? new Date(notice.createdAt).toLocaleDateString()
                : 'Reciente'
            }
            status={notice.status}
            image={notice.image ? { uri: notice.image } : Patronato}
            onEdit={() =>
              navigation.navigate('NuevaNoticia', {
                communityId,
              })
            }
            onDelete={() => {
              eliminarNoticia(notice.id)
            }}
          />
        ))}

        {news.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Aún no hay noticias para esta comunidad.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      color: colors.text,
    },

    createButton: {
      width: 115,
    },

    list: {
      gap: 16,
      paddingBottom: 20,
    },

    empty: {
      alignItems: 'center',
      paddingVertical: 40,
    },

    emptyText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },

    backButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
