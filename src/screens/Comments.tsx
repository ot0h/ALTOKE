import { JSX, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { ArrowLeft, Send, Trash2 } from 'lucide-react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { RootStackParamList } from '../navigation/StackNavigator'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { useAppDispatch, useAppSelector } from '../store/hook'
import {
  addComment,
  decrementComments,
  incrementComments,
  removeComment,
} from '../store/slices/postSlice'
import { postService } from '@services'
import { Comment } from '../types'

type Props = NativeStackScreenProps<RootStackParamList, 'Comments'>

export const Comments = ({ route, navigation }: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()

  const dispatch = useAppDispatch()

  const { postId } = route.params

  const userId = useAppSelector((state) => state.userProfile.id)
  const userName = useAppSelector((state) => state.userProfile.name)

  const post = useAppSelector((state) =>
    state.post.posts.find((item) => item.id === postId),
  )

  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    const loadComments = async () => {
      try {
        const remote = await postService.fetchComments(postId)
        setComments(remote)
      } catch (error) {
        console.error('[Comments] Error al cargar comentarios:', error)
      } finally {
        setLoading(false)
      }
    }

    loadComments()
  }, [postId])

  const enviar = async () => {
    const content = text.trim()
    if (posting || !content || !userId) return

    setPosting(true)
    try {
      const comment = await postService.addComment(postId, userId, content)

      setComments((prev) => [...prev, comment])
      dispatch(addComment({ postId, comment }))
      dispatch(incrementComments(postId))
      setText('')
    } catch (error) {
      console.error('[Comments] Error al enviar comentario:', error)
    } finally {
      setPosting(false)
    }
  }

  const eliminar = async (comment: Comment) => {
    if (comment.userId !== userId) return

    try {
      await postService.removeComment(comment.id)

      setComments((prev) => prev.filter((item) => item.id !== comment.id))
      dispatch(removeComment({ postId, commentId: comment.id }))
      dispatch(decrementComments(postId))
    } catch (error) {
      console.error('[Comments] Error al eliminar comentario:', error)
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color={colors.text} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Comentarios</Text>

            <Text style={styles.subtitle}>
              Mira y participa en la conversación
            </Text>
          </View>
        </View>

        {/* POST ORIGINAL */}

        {post ? (
          <View style={styles.postCard}>
            <Text style={styles.postTitle} numberOfLines={1}>
              {post.title}
            </Text>

            <Text style={styles.postContent} numberOfLines={2}>
              {post.content}
            </Text>

            <Text style={styles.postAuthor}>
              {userName || 'Vecino'} · {comments.length}{' '}
              {comments.length === 1 ? 'comentario' : 'comentarios'}
            </Text>
          </View>
        ) : null}

        {/* LISTA DE COMENTARIOS */}

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.list,
              {
                paddingBottom: insets.bottom + 20,
              },
            ]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.commentCard}>
                <Image
                  style={styles.avatar}
                  source={
                    item.authorAvatar
                      ? { uri: item.authorAvatar }
                      : require('@assets/default-avatar.png')
                  }
                />

                <View style={styles.commentBody}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>
                      {item.author || 'Vecino'}
                    </Text>

                    <Text style={styles.commentTime}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>

                  <Text style={styles.commentContent}>{item.content}</Text>
                </View>

                {item.userId === userId ? (
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => eliminar(item)}
                  >
                    <Trash2 size={16} color={colors.error} />
                  </Pressable>
                ) : null}
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>Aún no hay comentarios</Text>

                <Text style={styles.emptyText}>
                  Sé el primero en comentar esta publicación.
                </Text>
              </View>
            }
          />
        )}

        {/* INPUT */}

        <View
          style={[
            styles.inputBar,
            {
              paddingBottom: Math.max(insets.bottom, 8),
            },
          ]}
        >
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Escribe un comentario..."
            placeholderTextColor={colors.placeholder}
            multiline
            editable={!posting}
            onSubmitEditing={enviar}
          />

          <Pressable
            style={[
              styles.sendButton,
              (!text.trim() || posting) && styles.sendButtonDisabled,
            ]}
            onPress={enviar}
            disabled={!text.trim() || posting}
          >
            <Send size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    keyboard: {
      flex: 1,
    },

    /* HEADER */

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
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

    headerText: {
      flex: 1,
      gap: 3,
    },

    title: {
      fontFamily: 'MontserratAlternates_700Bold',
      fontSize: 22,
      color: colors.text,
    },

    subtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },

    /* POST ORIGINAL */

    postCard: {
      marginHorizontal: 20,
      marginBottom: 12,
      padding: 16,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 4,
    },

    postTitle: {
      fontFamily: 'Inter_700Bold',
      fontSize: 15,
      color: colors.text,
    },

    postContent: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
    },

    postAuthor: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 2,
    },

    /* LISTA */

    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    list: {
      paddingHorizontal: 20,
      paddingTop: 4,
      gap: 12,
    },

    commentCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      padding: 12,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },

    commentBody: {
      flex: 1,
      gap: 3,
    },

    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    commentAuthor: {
      fontFamily: 'Inter_700Bold',
      fontSize: 13,
      color: colors.text,
    },

    commentTime: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textMuted,
    },

    commentContent: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
    },

    deleteButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
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

    /* INPUT */

    inputBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 10,
      paddingHorizontal: 20,
      paddingTop: 10,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    input: {
      flex: 1,
      minHeight: 42,
      maxHeight: 100,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 12,
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.text,
    },

    sendButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    sendButtonDisabled: {
      backgroundColor: colors.disabled,
    },
  })
