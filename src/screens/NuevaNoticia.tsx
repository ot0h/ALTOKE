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

export const NuevaNoticia = (): JSX.Element => {
  const [foto, setFoto] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [detail, setDetail] = useState<string>('')
  const [isPublish, setIsPublish] = useState<boolean>(true)

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
              <ArrowLeft size={20} color="#0F172A" />
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
                placeholderTextColor="#64748B"
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
                    <Camera size={20} color={'#0145EA'} />
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
                placeholderTextColor="#64748B"
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
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
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
    backgroundColor: '#E8EDF3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'MontserratAlternates_700Bold',
    fontSize: 24,
    color: '#1E2744',
  },

  // CARD
  card: {
    backgroundColor: '#FFFFFF',
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
    color: '#1E2744',
  },

  // FOTOS
  photoBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#3E6CB0',
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
    color: '#0145EA',
  },
  photoDetail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    fontWeight: '400',
    color: '#64748B',
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
    color: '#1E2744',
  },
  toggleSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748B',
  },

  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#1E2744',
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
  },
})
