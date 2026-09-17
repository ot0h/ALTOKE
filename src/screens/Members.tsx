import { JSX, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { ArrowLeft, UserPlus, Users } from 'lucide-react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useIsFocused } from '@react-navigation/native'

import { RootStackParamList } from '../navigation/StackNavigator'
import {
  membershipService,
  CommunityMember,
  communityService,
} from '../services'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import AddMemberModal from './modals/AddMemberModal'

type Props = NativeStackScreenProps<RootStackParamList, 'Members'>

export const Members = ({ navigation, route }: Props): JSX.Element => {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()

  const { communityId } = route.params

  const [members, setMembers] = useState<CommunityMember[]>([])
  const [communityCode, setCommunityCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  const loadMembers = async () => {
    setLoading(true)
    try {
      const [fetched, community] = await Promise.all([
        membershipService.fetchCommunityMembers(communityId),
        communityService.fetchCommunity(communityId),
      ])
      setMembers(fetched)
      setCommunityCode(community?.code ?? '')
    } catch (error) {
      console.error('[Members] Error al cargar miembros:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isFocused) return
    loadMembers()
  }, [communityId, isFocused])

  const roleLabel = (role: CommunityMember['role']) =>
    role === 'admin' ? 'Administrador' : 'Miembro'

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
        },
      ]}
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
            <Text style={styles.title}>Miembros</Text>

            <Text style={styles.subtitle}>
              {members.length} {members.length === 1 ? 'miembro' : 'miembros'}
            </Text>
          </View>

          {communityCode ? (
            <View style={styles.codeChip}>
              <Text style={styles.codeLabel}>Código</Text>

              <Text style={styles.codeValue}>{communityCode}</Text>
            </View>
          ) : null}

          <Pressable
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
            accessibilityLabel="Agregar miembro"
          >
            <UserPlus size={20} color={colors.surface} />
          </Pressable>
        </View>

        {/* LISTA */}

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={members}
            keyExtractor={(item) => item.userId}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.memberCard}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{item.name}</Text>

                  <Text style={styles.memberEmail}>
                    {item.email || 'Sin correo'}
                  </Text>
                </View>

                <Text style={styles.memberRole}>{roleLabel(item.role)}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.center}>
                <Users size={40} color={colors.textSecondary} />

                <Text style={styles.emptyText}>
                  Todavía no hay miembros en esta comunidad.
                </Text>
              </View>
            }
          />
        )}
      </View>

      <AddMemberModal
        visible={showAddModal}
        communityId={communityId}
        onClose={() => setShowAddModal(false)}
        onAdded={() => {
          loadMembers()
        }}
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

    container: {
      flex: 1,
      paddingHorizontal: 20,
      gap: 16,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingTop: 16,
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

    addButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    codeChip: {
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primary,
      borderStyle: 'dashed',
    },

    codeLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 10,
      color: colors.textSecondary,
      textTransform: 'uppercase',
    },

    codeValue: {
      fontFamily: 'MontserratAlternates_800ExtraBold',
      fontSize: 15,
      color: colors.primary,
      letterSpacing: 1.5,
    },

    headerText: {
      flex: 1,
      gap: 2,
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

    list: {
      gap: 10,
      paddingBottom: 24,
    },

    memberCard: {
      minHeight: 64,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
    },

    memberAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    memberAvatarText: {
      fontFamily: 'MontserratAlternates_700Bold',
      fontSize: 17,
      color: colors.surface,
    },

    memberInfo: {
      flex: 1,
      gap: 2,
    },

    memberName: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
      color: colors.text,
    },

    memberEmail: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },

    memberRole: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.primary,
    },

    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingVertical: 60,
    },

    emptyText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  })