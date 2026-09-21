import { JSX, useEffect, useMemo } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Plus, ArrowLeft } from 'lucide-react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { setPosts } from '../store/slices/postSlice'
import { postService } from '@services'
import { mergeById } from '../utils/mergeById'
import { RootStackParamList } from '@navigation/StackNavigator'
import { ForumPostCard } from '@components'

type ForumRouteProp = RouteProp<RootStackParamList, 'Forum'>

type ForumNavigationProp = NativeStackNavigationProp<RootStackParamList>

export const Forum = (): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const insets = useSafeAreaInsets()

  const navigation = useNavigation<ForumNavigationProp>()

  const route = useRoute<ForumRouteProp>()

  const { communityId } = route.params

  const dispatch = useAppDispatch()

  const userId = useAppSelector((state) => state.userProfile.id)

  const allPosts = useAppSelector((state) => state.post.posts)

  const posts = useMemo(
    () => allPosts.filter((post) => post.communityId === communityId),
    [allPosts, communityId],
  )

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const remotePosts = await postService.fetchPosts(
          undefined,
          true,
          userId,
        )

        dispatch(setPosts(mergeById(posts, remotePosts)))
      } catch (error) {
        console.error('[Forum] Error al cargar publicaciones:', error)
      }
    }

    loadPosts()
  }, [dispatch, userId])

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>

        <Text style={styles.title}>Foro Comunitario</Text>

        <Pressable
          style={styles.publishButton}
          onPress={() =>
            navigation.navigate('NuevaPublicacion', {
              communityId,
            })
          }
        >
          <Plus size={18} color="#FFFFFF" />

          <Text style={styles.publishText}>Publicar</Text>
        </Pressable>
      </View>

      {/* POSTS */}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ForumPostCard
            postId={item.id}
            title={item.title}
            author={item.author || 'Usuario'}
            createdAt={item.createdAt || 'Hace poco'}
            description={item.content}
            comment={item.commentsCount}
            likes={item.likes}
            authorimage={
              item.authorAvatar
                ? { uri: item.authorAvatar }
                : require('@assets/default-avatar.png')
            }
            iLike={item.iLike}
            onPressComment={() => {
              navigation.navigate('Comments', {
                postId: item.id,
              })
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aún no hay publicaciones</Text>

            <Text style={styles.emptyText}>
              Sé el primero en compartir algo con tu comunidad.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    title: {
      flex: 1,
      fontFamily: 'MontserratAlternates_700Bold',
      fontSize: 24,
      color: colors.text,
    },

    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    publishButton: {
      height: 40,
      paddingHorizontal: 16,
      borderRadius: 18,
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },

    publishText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: '#FFFFFF',
    },

    list: {
      paddingHorizontal: 12,
      paddingTop: 10,
      gap: 14,
    },

    empty: {
      paddingHorizontal: 30,
      paddingTop: 80,
      alignItems: 'center',
    },

    emptyTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
    },

    emptyText: {
      marginTop: 6,
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  })
