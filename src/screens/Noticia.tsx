import { JSX, useEffect, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  Image,
} from 'react-native'

import NoticiaImage from '@assets/noticia.svg'
import FIXYICON from '@assets/FIXYLOGIN.svg'

import { MaterialIcons, Octicons } from '@expo/vector-icons'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/StackNavigator'
import { postService } from '../services'
import { Post } from '../types'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

type NoticiaRouteProp = RouteProp<RootStackParamList, 'Noticia'>

export const Noticia = (): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const route = useRoute<NoticiaRouteProp>()

  const { postId } = route.params

  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const fetchedPost = await postService.fetchPost(postId)
        setPost(fetchedPost)
      } catch (error) {
        console.error('[Noticia] Error al cargar la noticia:', error)
      }
    }

    loadPost()
  }, [postId])

  const paragraphs = (post?.content ?? '').split(/\n+/).filter(Boolean)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons size={25} name="arrow-back" color={colors.textSecondary} />
          </Pressable>

          <Text style={styles.headerTitle}>Noticia</Text>
        </View>

        {/* IMAGEN */}
        <View style={styles.imageContainer}>
          {post?.image ? (
            <Image
              style={styles.image}
              source={{ uri: post.image }}
              resizeMode="cover"
            />
          ) : (
            <NoticiaImage
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
            />
          )}
        </View>

        {/* CONTENIDO */}
        <View style={styles.content}>
          {/* TITULO */}
          <Text style={styles.title}>
            {post?.title || 'Noticia'}
          </Text>

          {/* AUTOR */}
          <View style={styles.authorSection}>
            <View style={styles.authorRow}>
              <FIXYICON width={34} height={34} />

              <View style={styles.authorInfo}>
                <Text style={styles.textAuthor}>Administración Al Toke</Text>

                <View style={styles.detailsRow}>
                  <Text style={styles.textDetails}>
                    {post?.createdAt
                      ? `Publicado el ${new Date(
                          post.createdAt,
                        ).toLocaleDateString()}`
                      : 'Publicado recientemente'}
                  </Text>

                  <Octicons name="dot-fill" size={8} color={colors.textSecondary} />

                  <Text style={styles.textDetails}>
                    Lectura: {Math.max(1, Math.ceil((post?.content ?? '').length / 700))} min
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* LINEA */}
          <View style={styles.divider} />

          {/* DESCRIPCION */}
          <View style={styles.descriptionContainer}>
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => (
                <Text key={index} style={styles.fontDescription}>
                  {paragraph}
                </Text>
              ))
            ) : (
              <Text style={styles.fontDescription}>
                Esta noticia aún no tiene contenido.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignContent: 'center',
      alignItems: 'center',
    },

    scrollContent: { paddingBottom: 100 },

    /* HEADER */

    header: {
      height: 176,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.background,
    },

    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },

    headerTitle: {
      fontFamily: 'MontserratAlternates_700Bold',
      fontSize: 24,
      color: colors.text,
    },

    /* IMAGEN */

    imageContainer: {
      width: '100%',
      height: 222,
      overflow: 'hidden',
    },

    image: {
      width: '100%',
      height: '100%',
    },

    /* CONTENIDO */

    content: {
      paddingHorizontal: 20,
      paddingTop: 16,
    },

    title: {
      fontFamily: 'MontserratAlternates_700Bold',
      fontSize: 23,
      lineHeight: 28,
      color: colors.text,
      marginBottom: 14,
    },

    /* AUTOR */

    authorSection: {
      marginBottom: 12,
    },

    authorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },

    authorInfo: {
      flex: 1,
      justifyContent: 'center',
    },

    textAuthor: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.text,
      marginBottom: 2,
    },

    detailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    textDetails: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
    },

    /* DIVISOR */

    divider: {
      height: 1,
      backgroundColor: colors.border,
      width: '100%',
      marginBottom: 12,
    },

    /* DESCRIPCION */

    descriptionContainer: {
      gap: 14,
    },

    fontDescription: {
      fontFamily: 'Inter_400Regular',
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
    },
  })