import { JSX, useState } from 'react'
import {KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet,Text, TextInput,  View,} from 'react-native'
import { ArrowLeft, Camera } from 'lucide-react-native'
import { CustomButton, CustomSwitch } from '@components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { store } from '../store'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { RootStackParamList } from '@navigation/StackNavigator'
import { RouteProp, useRoute } from '@react-navigation/native'
import { ImageUpload } from '../components/ImageUpload'
import { addNews } from '../store/slices/newsSlice'
import Alert from './modals/Alert'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NuevaNoticia'
>


export const NuevaNoticia = ({navigation, route}: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const [foto, setFoto] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [detail, setDetail] = useState<string>('')
  const [isPublish, setIsPublish] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  const userId = useAppSelector((state) => state.userProfile.id)

  const { communityId } = route.params


  const publicarNoticia = () => {
    if (!title.trim()) return

    const news = {
      id: Date.now().toString(),
      userId,
      communityId,
      title: title.trim(),
      content: detail.trim(),
      comments: [],
      likes: 0,
      category: 'avisos' as const,
      createdAt: new Date().toISOString(),
      image: foto || undefined,
    }
    dispatch(addNews(news))
    console.log('[Redux] useDispatch(addPost) -> payload:', news)
    console.log('[Redux] Nuevo estado de posts:', store.getState().news.news)

    setTitle('')
    setDetail('')
    setFoto('')
    setModalVisible(true)
  }
  const [modalVisible, setModalVisible]= useState(false)

    const closeAlert= () => {
      setModalVisible(false)
      navigation.goBack
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
            <Pressable style={styles.backButton}>
              <ArrowLeft size={20} color={colors.text} />
            </Pressable>
            <Text style={styles.headerTitle}>Nueva Noticia</Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            {/* TITLE */}
            <View style={styles.field}>
              <Text style={styles.label}>Título de la noticia</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { paddingHorizontal: 12, width: '100%', height: 44 },
                ]}
                value={title}
                onChangeText={setTitle}
                placeholder="Escribe un título descriptivo"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* IMAGE */}
            <View style={styles.field}>
              <Text style={styles.label}>Imagen de portada</Text>
              <ImageUpload
                value={foto}
                onChange={setFoto}
                title="Subir foto de la residencial"
              />
            </View>

            {/* DETAIL */}
            <View style={styles.field}>
              <Text style={styles.label}>Contenido de la publicación</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { padding: 12, width: '100%', height: 140, fontSize: 14 },
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
                <Text style={styles.toggleTitle}>Publicar inmediatamente</Text>
                <Text style={styles.toggleSubtitle}>
                  Si se desactiva, se guardará como borrador
                </Text>
              </View>
              <CustomSwitch value={isPublish} onValueChange={setIsPublish} />
            </View>
          </View>

          {/* BOTON */}
          <CustomButton
            variant="secondary"
            text="Publicar Noticia"
            onPress={publicarNoticia}
          />
        </View>
        <Alert
        text='Noticia creada correctamente'
        onPress={closeAlert}
        visible= {modalVisible}
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
    scrollContent: { paddingBottom: 100 },

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
