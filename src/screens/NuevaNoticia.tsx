import { JSX, useState } from 'react'
import {
  Alert as RNAlert,
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
import { CustomButton, CustomSwitch } from '@components'
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { addNews } from '../store/slices/newsSlice'
import { newsService } from '../services'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { ImageUpload } from '../components/ImageUpload'
import Alert from './modals/Alert'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@navigation/StackNavigator'

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NuevaNoticia'
>

export const NuevaNoticia = ({
  navigation,
  route,
}: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()

  const [foto, setFoto] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [detail, setDetail] = useState<string>('')

  const [isPublish, setIsPublish] = useState<boolean>(true)

  const [category, setCategory] = useState<
    'avisos' | 'eventos' | 'mantenimiento'
  >('avisos')

  const [modalVisible, setModalVisible] =
    useState<boolean>(false)

  const [alertText, setAlertText] =
    useState<string>('')

  const [publishing, setPublishing] = useState(false)

  const dispatch = useAppDispatch()

  const userId = useAppSelector(
    (state) => state.userProfile.id,
  )

  const { communityId } = route.params

  const publicarNoticia = async () => {
    if (publishing || !title.trim()) return

    setPublishing(true)
    try {
      const news = await newsService.createNews({
        userId,
        communityId,
        title: title.trim(),
        content: detail.trim(),
        category,
        image: foto || undefined,
        status: isPublish ? 'publicada' : 'borrador',
      })

      dispatch(addNews(news))

      setAlertText(
        isPublish
          ? 'Noticia publicada correctamente'
          : 'Noticia guardada como borrador',
      )

      setTitle('')
      setDetail('')
      setFoto('')
      setCategory('avisos')
      setIsPublish(true)

      setModalVisible(true)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo publicar la noticia'
      RNAlert.alert('Error', message)
    } finally {
      setPublishing(false)
    }
  }

  const closeAlert = () => {
    setModalVisible(false)
    navigation.goBack()
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
    >
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.wrapper,
            {
              paddingTop: insets.top,
            },
          ]}
        >
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={
              styles.scrollContainer
            }
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>

              {/* HEADER */}

              <View style={styles.header}>
                <Pressable
                  style={styles.backButton}
                  onPress={() =>
                    navigation.goBack()
                  }
                >
                  <ArrowLeft
                    size={20}
                    color={colors.text}
                  />
                </Pressable>

                <Text
                  style={styles.headerTitle}
                >
                  Nueva Noticia
                </Text>
              </View>

              {/* CARD */}

              <View style={styles.card}>

                {/* TITLE */}

                <View style={styles.field}>
                  <Text style={styles.label}>
                    Título de la noticia
                  </Text>

                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                      {
                        paddingHorizontal: 12,
                        width: '100%',
                        height: 44,
                      },
                    ]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Escribe un título descriptivo"
                    placeholderTextColor={
                      colors.textSecondary
                    }
                  />
                </View>

                {/* IMAGE */}

                <View style={styles.field}>
                  <Text style={styles.label}>
                    Imagen de portada
                  </Text>

                  <ImageUpload
                    value={foto}
                    onChange={setFoto}
                    title="Subir foto de la residencial"
                  />
                </View>

                {/* DETAIL */}

                <View style={styles.field}>
                  <Text style={styles.label}>
                    Contenido de la publicación
                  </Text>

                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                      {
                        padding: 12,
                        width: '100%',
                        height: 140,
                        fontSize: 14,
                      },
                    ]}
                    value={detail}
                    onChangeText={setDetail}
                    placeholder="Redacta el mensaje o anuncio aquí de forma clara para toda la comunidad..."
                    placeholderTextColor={
                      colors.textSecondary
                    }
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                {/* CATEGORIA */}

                <View style={styles.field}>
                  <Text style={styles.label}>
                    Categoría
                  </Text>

                  <View style={styles.categoryRow}>
                    {(
                      [
                        'avisos',
                        'eventos',
                        'mantenimiento',
                      ] as const
                    ).map((item) => (
                      <Pressable
                        key={item}
                        onPress={() =>
                          setCategory(item)
                        }
                        style={[
                          styles.categoryButton,
                          category === item &&
                          styles.categoryButtonActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            category === item &&
                            styles.categoryTextActive,
                          ]}
                        >
                          {item
                            .charAt(0)
                            .toUpperCase() +
                            item.slice(1)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* PUBLICACION TOGGLE */}

                <View style={styles.toggleRow}>
                  <View
                    style={styles.toggleTextWrap}
                  >
                    <Text
                      style={styles.toggleTitle}
                    >
                      Publicar inmediatamente
                    </Text>

                    <Text
                      style={styles.toggleSubtitle}
                    >
                      Si se desactiva, se guardará
                      como borrador
                    </Text>
                  </View>

                  <CustomSwitch
                    value={isPublish}
                    onValueChange={setIsPublish}
                  />
                </View>
              </View>

              {/* BOTON */}

              <CustomButton
                variant="secondary"
                text={
                  isPublish
                    ? 'Publicar Noticia'
                    : 'Guardar Borrador'
                }
                onPress={publicarNoticia}
              />

            </View>

            {/* ALERT */}

            <Alert
              text={alertText}
              onPress={closeAlert}
              visible={modalVisible}
            />

          </ScrollView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({

    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    wrapper: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      flex: 1,
    },

    scrollContainer: {
      paddingBottom: 100,
    },

    container: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
      gap: 10,
    },

    // HEADER

    header: {
      paddingVertical: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      height: 100,
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
      fontFamily:
        'MontserratAlternates_700Bold',
      fontSize: 24,
      color: colors.text,
    },

    // CARD

    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
      gap: 16,
      marginBottom: 10,
    },

    field: {
      gap: 8,
    },

    label: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
    },

    // INPUT

    input: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      fontWeight: '400',
      color: colors.text,
    },

    textArea: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 12,
    },

    // CATEGORIA

    categoryRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },

    categoryButton: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },

    categoryButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    categoryText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.textSecondary,
    },

    categoryTextActive: {
      color: colors.surface,
    },

    // TOGGLE

    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    toggleTextWrap: {
      flex: 1,
      paddingRight: 12,
      gap: 2,
    },

    toggleTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
    },

    toggleSubtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },
  })