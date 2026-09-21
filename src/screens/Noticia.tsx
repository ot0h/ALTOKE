import { JSX } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
} from 'react-native'

import NoticiaImage from '@assets/noticia.svg'
import { MaterialIcons, Octicons } from '@expo/vector-icons'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { useAppSelector } from '../store/hook'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@navigation/StackNavigator'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'Noticia'>

export const Noticia = ({ route, navigation }: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const { noticeId } = route.params

  const notice = useAppSelector((state) =>
    state.news.news.find((news) => news.id === noticeId),
  )

  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons
              size={25}
              name="arrow-back"
              color={colors.textSecondary}
            />
          </Pressable>

          <Text style={styles.headerTitle}>Noticia</Text>
        </View>

        {/* IMAGEN */}
        <View style={styles.imageContainer}>
          {notice?.image ? (
            <Image
              source={{ uri: notice.image }}
              style={{ width: '100%', height: '100%' }}
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
          <Text style={styles.title}>{notice?.title}</Text>

          {/* AUTOR */}
          <View style={styles.authorSection}>
            <View style={styles.authorRow}>
              <Image
                style={styles.authorImage}
                source={
                  notice?.authorAvatar
                    ? { uri: notice.authorAvatar }
                    : require('@assets/default-avatar.png')
                }
              />

              <View style={styles.authorInfo}>
                <Text style={styles.textAuthor}>
                  {notice?.author || 'Administración Al Toke'}
                </Text>

                <View style={styles.detailsRow}>
                  <Text style={styles.textDetails}>
                    {notice?.createdAt
                      ? new Date(notice.createdAt).toLocaleDateString('es-HN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : ''}
                  </Text>

                  <Octicons
                    name="dot-fill"
                    size={8}
                    color={colors.textSecondary}
                  />

                  <Text style={styles.textDetails}>Lectura: 3 min</Text>
                </View>
              </View>
            </View>
          </View>

          {/* LINEA */}
          <View style={styles.divider} />

          {/* DESCRIPCION */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.fontDescription}>{notice?.content}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
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

    scrollView: {
      flex: 1,
      width: '100%',
    },

    scrollContent: {
      paddingBottom: 100,
    },

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

    authorImage: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.primary,
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
