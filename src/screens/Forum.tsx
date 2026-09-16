import { JSX } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Plus } from 'lucide-react-native'
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import {
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { useAppSelector } from '../store/hook'
import { RootStackParamList } from '@navigation/StackNavigator'
import ForumPostCard from '../components/ForumPostCard'

type ForumRouteProp = RouteProp<
  RootStackParamList,
  'Forum'
>

type ForumNavigationProp =
  NativeStackNavigationProp<RootStackParamList>

export const Forum = (): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const insets = useSafeAreaInsets()

  const navigation =
    useNavigation<ForumNavigationProp>()

  const route = useRoute<ForumRouteProp>()

  const { communityId } = route.params

  const posts = useAppSelector(
    (state) =>
      state.post.posts.filter(
        (post) => post.communityId === communityId,
      ),
  )

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
        <Text style={styles.title}>
          Foro Comunitario
        </Text>

        <Pressable
          style={styles.publishButton}
          onPress={() =>
            navigation.navigate('NuevaPublicacion', {
              communityId,
            })
          }
        >
          <Plus
            size={18}
            color="#FFFFFF"
          />

          <Text style={styles.publishText}>
            Publicar
          </Text>
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
            author="Usuario"
            createdAt={item.createdAt || 'Hace poco'}
            description={item.content}
            comment={item.comments.length}
            likes={item.likes}
            authorimage={require('@assets/default-avatar.png')}
            iLike={false}
            onPressComment={() => {
              console.log('Comentarios:', item.id)
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              Aún no hay publicaciones
            </Text>

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
      fontFamily: 'MontserratAlternates_700Bold',
      fontSize: 24,
      color: colors.text,
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