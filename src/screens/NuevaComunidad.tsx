import { JSX, useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Camera, MapPin } from 'lucide-react-native'
import { CustomButton, ImageUpload } from '@components'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { addCommunity } from '../store/slices/communitySlice'
import { communityService, membershipService } from '@services'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { Alert as AlertModal } from './modals'
import { Community } from '../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@navigation/StackNavigator'

type Props = NativeStackScreenProps<RootStackParamList, 'NuevaComunidad'>

export const NuevaComunidad = ({ navigation }: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const [foto, setFoto] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [rules, setRules] = useState<string>('')
  const dispatch = useAppDispatch()
  const userId = useAppSelector((state) => state.userProfile.id)
  const insets = useSafeAreaInsets()
  const [visibleAlert, setVisibleAlert] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createdCommunity, setCreatedCommunity] = useState<Community | null>(
    null,
  )

  const crearComunidad = async () => {
    if (creating || !name.trim()) return

    setCreating(true)
    try {
      const community = await communityService.createCommunity({
        ownerId: userId,
        name: name.trim(),
        description: description.trim(),
        address: address.trim(),
        rules: rules.trim(),
        image: foto,
      })

      await membershipService.joinCommunity(userId, community.id, 'admin')

      dispatch(addCommunity(community))
      setCreatedCommunity(community)
      setVisibleAlert(true)

      setName('')
      setDescription('')
      setAddress('')
      setRules('')
      setFoto('')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo crear la comunidad'
      Alert.alert('Error', message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: 50,
          backgroundColor: colors.background,
        }}
      >
        <ScrollView style={styles.scrollContent}>
          <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Nueva Comunidad</Text>
              <Text style={styles.headerSubtitle}>
                Registra un nuevo condominio o residencial al sistema
              </Text>
            </View>

            {/* CARD */}
            <View style={styles.card}>
              {/* NOMBRE */}
              <View style={styles.field}>
                <Text style={styles.label}>Nombre de la comunidad</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    { paddingHorizontal: 12, width: '100%', height: 44 },
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Ej. Condominio San Andrés"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              {/* DESCRIPCION */}
              <View style={styles.field}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    { padding: 12, width: '100%', height: 80, fontSize: 14 },
                  ]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Escribe una breve descripción para los residentes..."
                  placeholderTextColor={colors.textSecondary}
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>

              {/* IMAGEN */}
              <View style={styles.field}>
                <Text style={styles.label}>Imagen de portada</Text>
                <ImageUpload
                  value={foto}
                  onChange={setFoto}
                  title="Subir foto de la residencial"
                />
              </View>

              {/* DIRECCION */}

              <View style={styles.field}>
                <Text style={styles.label}>Dirección de la comunidad</Text>
                <View style={styles.addressInputWrap}>
                  <MapPin size={16} color={colors.primary} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Calle Principal, #102 Zona Norte"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>
              {/* NORMAS */}
              <View style={styles.field}>
                <Text style={styles.label}>Normas básicas de convivencia</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    { padding: 12, width: '100%', height: 90, fontSize: 14 },
                  ]}
                  value={rules}
                  onChangeText={setRules}
                  placeholder={
                    'Ej. 1. Respetar horarios de ruido (10 PM - 8 AM)\n2. Uso responsable de áreas comunes...'
                  }
                  placeholderTextColor={colors.textSecondary}
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* BOTON */}
            <CustomButton
              variant="primary"
              text="Crear Comunidad"
              onPress={crearComunidad}
            />
          </View>
          <AlertModal
            text={`Comunidad Creada Correctamente\n\nCódigo de unión: ${createdCommunity?.code ?? ''}`}
            onPress={() =>
              createdCommunity
                ? navigation.replace('CommunityHome', {
                    communityId: createdCommunity.id,
                  })
                : navigation.goBack()
            }
            visible={visibleAlert}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
      gap: 16,
    },
    scrollContent: { paddingBottom: 100 },

    // HEADER
    header: {
      paddingTop: 20,
      gap: 4,
    },
    headerTitle: {
      fontFamily: 'MontserratAlternates_700Bold',
      fontSize: 24,
      color: colors.text,
    },
    headerSubtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
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

    // DIRECCION
    addressInputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 44,
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
