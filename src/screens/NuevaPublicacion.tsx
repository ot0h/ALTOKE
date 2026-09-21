import { JSX, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { ArrowLeft } from 'lucide-react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { CustomButton } from '@components'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { addPost } from '../store/slices/postSlice'
import { postService } from '@services'
import { RootStackParamList } from '@navigation/StackNavigator'
import { Alert } from 'react-native'

type NuevaPublicacionRouteProp = RouteProp<
  RootStackParamList,
  'NuevaPublicacion'
>

type NuevaPublicacionNavigationProp =
  NativeStackNavigationProp<RootStackParamList>

export const NuevaPublicacion = (): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const insets = useSafeAreaInsets()

  const navigation = useNavigation<NuevaPublicacionNavigationProp>()

  const route = useRoute<NuevaPublicacionRouteProp>()

  const { communityId } = route.params

  const dispatch = useAppDispatch()

  const userId = useAppSelector((state) => state.userProfile.id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [publishing, setPublishing] = useState(false)

  const publicar = async () => {
    if (publishing || !title.trim() || !content.trim()) {
      return
    }

    setPublishing(true)
    try {
      const post = await postService.createPost({
        title: title.trim(),
        content: content.trim(),
        userId,
        communityId,
      })

      dispatch(addPost(post))

      setTitle('')
      setContent('')

      navigation.goBack()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo publicar'
      Alert.alert('Error', message)
    } finally {
      setPublishing(false)
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
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: insets.bottom + 30,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* HEADER */}

            <View style={styles.header}>
              <Pressable
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <ArrowLeft size={20} color={colors.text} />
              </Pressable>

              <View style={styles.headerText}>
                <Text style={styles.title}>Nueva publicación</Text>

                <Text style={styles.subtitle}>
                  Comparte algo con tu comunidad
                </Text>
              </View>
            </View>

            {/* FORM */}

            <View style={styles.card}>
              {/* TÍTULO */}

              <View style={styles.field}>
                <Text style={styles.label}>Título de la publicación</Text>

                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="¿De qué quieres hablar?"
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              {/* CONTENIDO */}

              <View style={styles.field}>
                <Text style={styles.label}>Contenido</Text>

                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={content}
                  onChangeText={setContent}
                  placeholder="Escribe tu publicación..."
                  placeholderTextColor={colors.placeholder}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* BOTÓN */}

            <CustomButton
              variant="primary"
              text="Publicar"
              onPress={publicar}
            />
          </View>
        </ScrollView>
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

    scrollContent: {
      flexGrow: 1,
    },

    container: {
      paddingHorizontal: 20,
      gap: 16,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
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

    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
      gap: 18,
    },

    field: {
      gap: 8,
    },

    label: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
    },

    input: {
      width: '100%',
      height: 44,
      paddingHorizontal: 12,
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 12,
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.text,
    },

    textArea: {
      height: 150,
      padding: 12,
    },
  })
