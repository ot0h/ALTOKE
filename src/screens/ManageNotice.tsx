import { JSX, useEffect, useMemo, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CustomButton } from '@components'
import ManageNoticeCard from '../components/ManageNoticeCard'
import Patronato from '@assets/patronato.png'
import { ArrowLeft } from 'lucide-react-native'
import { Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/StackNavigator'
import { store } from '../store'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { removePost, setPosts } from '../store/slices/postSlice'
import { postService } from '../services'
import { mergeById } from '../utils/mergeById'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type Props = NativeStackScreenProps<RootStackParamList, 'ManageNotices'>

export const ManageNotices = ({ navigation, route }: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()

  const { communityId } = route.params

  const allPosts = useAppSelector((state) => state.post.posts)

  const notices = useMemo(
    () => allPosts.filter((post) => post.communityId === communityId),
    [allPosts, communityId],
  )

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const remotePosts = await postService.fetchPosts(communityId)

        dispatch(
          setPosts(
            mergeById(store.getState().post.posts, remotePosts),
          ),
        )
      } catch (error) {
        console.error('[ManageNotices] Error al cargar noticias:', error)
      }
    }

    loadNotices()
  }, [communityId])

  const eliminarNoticia = (postId: string) => {
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
              await postService.deletePost(postId)
              dispatch(removePost(postId))
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
          <ArrowLeft size={22} color={colors.text} />
        </Pressable>

        <Text style={styles.title}>Gestión noticias</Text>

        <View style={styles.createButton}>
          <CustomButton
            text="+  Crear"
            variant="secondary"
            onPress={() => navigation.navigate('NuevaNoticia', { communityId })}
          />
        </View>
      </View>

      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ManageNoticeCard
            title={item.title}
            time={
              item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : 'Reciente'
            }
            status="publicada"
            image={
              item.image
                ? { uri: item.image }
                : Patronato
            }
            onEdit={() =>
              navigation.navigate('NuevaNoticia', { communityId })
            }
            onDelete={() => eliminarNoticia(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Aún no hay noticias para esta comunidad.
            </Text>
          </View>
        }
      />
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
      gap: 12,
      marginBottom: 20,
      marginHorizontal: 7,
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

    title: {
      flex: 1,
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
  })