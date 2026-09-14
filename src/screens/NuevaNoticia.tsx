import { JSX, useState } from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { ArrowLeft, Camera } from 'lucide-react-native'
import { CustomButton, CustomSwitch } from '@components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { store } from '../store'
import { addPost } from '../store/slices/postSlice'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

export const NuevaNoticia = (): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const [foto, setFoto] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [detail, setDetail] = useState<string>('')
  const [isPublish, setIsPublish] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  const userId = useAppSelector((state) => state.userProfile.id)
  const communityId = useAppSelector((state) => state.community.id)

  const publicarNoticia = () => {
    if (!title.trim()) return

    const post = {
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

    dispatch(addPost(post))

    console.log('[Redux] useDispatch(addPost) -> payload:', post)
    console.log('[Redux] Nuevo estado de posts:', store.getState().post.posts)

    setTitle('')
    setDetail('')
    setFoto('')
  }

  const elegirDeGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      selectionLimit: 1,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [4, 3], // TODO: PEDIRLE A BYRON EL RADIO PA ESTO :V
      quality: 1,
    })

    if (!result.canceled) {
      setFoto(result.assets[0].uri)
    }
  }

  return (
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
              <Pressable style={styles.photoBox} onPress={elegirDeGaleria}>
                {foto ? (
                  <Image source={{ uri: foto }} style={styles.photoPreview} />
                ) : (
                  <>
                    <Camera size={20} color={colors.primary} />
                    <Text style={styles.photoTitle}>
                      Subir imagen de portada
                    </Text>
                    <Text style={styles.photoDetail}>
                      Soporta JPG, PNG (máx. 5MB)
                    </Text>
                  </>
                )}
              </Pressable>
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
      </ScrollView>
    </SafeAreaView>
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
