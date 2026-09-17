import { JSX, useEffect, useState } from 'react'
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
import { CustomButton, CustomSwitch } from '@components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { RootStackParamList } from '@navigation/StackNavigator'
import { ImageUpload } from '../components/ImageUpload'
import { News, updateNews } from '../store/slices/newsSlice'
import Alert from './modals/Alert'
import { NativeStackScreenProps } from '@react-navigation/native-stack'


type Props = NativeStackScreenProps<
  RootStackParamList,
  'EditarNoticia'
>

export const EditarNoticia = ({
  navigation,
  route,
}: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const dispatch = useAppDispatch()

  const { noticeId } = route.params

  const notice = useAppSelector((state) =>
    state.news.news.find((news) => news.id === noticeId)
  )

  const [foto, setFoto] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [detail, setDetail] = useState<string>('')
  const [isPublish, setIsPublish] = useState<boolean>(true)
  const [modalVisible, setModalVisible] = useState(false)
  

  // Cargar los datos de la noticia
  useEffect(() => {
    if (notice) {
      setTitle(notice.title)
      setDetail(notice.content)
      setFoto(notice.image ?? '')
      setIsPublish(notice.status ==='publicada')
    }
  }, [notice])

  const editarNoticia = () => {
    if (!notice) return

    if (!title.trim()) return

const updatedNews: News = {
  ...notice,
  title: title.trim(),
  content: detail.trim(),
  image: foto || undefined,
  status: isPublish ? 'publicada' : 'borrador',
}

dispatch(updateNews(updatedNews))

    setModalVisible(true)
  }

  const closeAlert = () => {
    setModalVisible(false)
    navigation.goBack()
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView>
        <ScrollView
          style={styles.scrollContent}
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

              <Text style={styles.headerTitle}>
                Editar Noticia
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
                  placeholderTextColor={colors.textSecondary}
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
                  placeholderTextColor={colors.textSecondary}
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>

              {/* PUBLICACION TOGGLE */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextWrap}>
                  <Text style={styles.toggleTitle}>
                    Publicar inmediatamente
                  </Text>

                  <Text style={styles.toggleSubtitle}>
                    Si se desactiva, se guardará como borrador
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
              text="Guardar cambios"
              onPress={editarNoticia}
            />

          </View>

          <Alert
            text="Noticia actualizada correctamente"
            onPress={closeAlert}
            visible={modalVisible}
          />

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
      gap: 10,
      justifyContent: 'center',
      alignContent: 'center',
    },

    scrollContent: {
      paddingBottom: 100,
    },

    // HEADER
    header: {
      paddingVertical: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      width: 402,
      height: 132,
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

    // FOTOS
    photoBox: {
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.primary,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      height: 130,
      width: '100%',
      overflow: 'hidden',
    },

    photoPreview: {
      width: '100%',
      height: '100%',
      borderRadius: 14,
    },

    photoTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontWeight: '600',
      fontSize: 12,
      color: colors.primary,
    },

    photoDetail: {
      fontFamily: 'Inter_400Regular',
      fontSize: 10,
      fontWeight: '400',
      color: colors.textSecondary,
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
  })