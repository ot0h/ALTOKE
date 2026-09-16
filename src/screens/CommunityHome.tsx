import { JSX } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { CustomButton } from '@components'
import CommunityCard from '../components/CommunityCard'
import ForumPostCard from '../components/ForumPostCard'
import ReportCard from '../components/ReportCard'

import Patronato from '@assets/patronato.png'
import { useAppSelector } from '../store/hook'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { RootStackParamList } from '../navigation/StackNavigator'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { NativeStackScreenProps } from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<
    RootStackParamList,
    'CommunityHome'
>

export const CommunityHome = ({
    navigation,
    route,
}: Props): JSX.Element => {

    const { communityId } = route.params
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const insets = useSafeAreaInsets()

    const community = useAppSelector((state) =>
        state.community.communities.find(
            (community) => community.id === communityId,
        ),
    )

    const posts = useAppSelector((state) =>
        state.post.posts.filter(
            (post) => post.communityId === communityId,
        ),
    )

    const reports = useAppSelector((state) =>
        state.report.reports.filter(
            (report) => report.communityId === communityId,
        ),
    )

    const post = posts[0]
    const recentReports = reports.slice(0, 2)

    return (
        <ScrollView
            style={[styles.container, { paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* HEADER */}

            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <View style={styles.backButton}>
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color={colors.text}
                        />
                    </View>
                </Pressable>

                <Text
                    style={styles.headerTitle}
                    numberOfLines={1}
                >
                    {community?.name || 'Comunidad'}
                </Text>
            </View>

            {/* IMAGEN DE COMUNIDAD */}

            <Image
                source={
                    community?.image
                        ? { uri: community.image }
                        : Patronato
                }
                style={styles.communityImage}
                resizeMode="cover"
            />

            {/* CREAR REPORTE */}

            <CustomButton
                text="+ Crear Reporte"
                variant="secondary"
                onPress={() =>
                    navigation.navigate('ReportProblem' as never)
                }
            />

            {/* FORO */}

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                    Foro de la comunidad
                </Text>

                <Pressable onPress={() => navigation.navigate("Forum", { communityId })}>
                    <Text style={styles.sectionLink}>
                        Ver Foro
                    </Text>
                </Pressable>
            </View>

            {post ? (
                <ForumPostCard
                    postId={post.id}
                    title={post.title}
                    author="Vecino"
                    createdAt={post.createdAt || 'Reciente'}
                    description={post.content}
                    comment={post.comments.length}
                    likes={post.likes}
                    authorimage={Patronato}
                    onPressComment={() => { }}
                />
            ) : (
                <Text style={styles.emptyText}>
                    Todavía no hay publicaciones.
                </Text>
            )}

            {/* NOTICIAS */}

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                    Noticias
                </Text>

                <Pressable onPress={() => { }}>
                    <Text style={styles.sectionLink}>
                        Ver Noticias
                    </Text>
                </Pressable>
            </View>

            <CommunityCard
                variant="notices"
                title="Novedades de la comunidad"
                description="Mantente informado sobre lo que ocurre en tu comunidad."
                image={community?.image || Patronato}
                time="Reciente"
                category="avisos"
                onPress={() => { }}
            />

            {/* REPORTES */}

            {recentReports.length > 0 && (
                <>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Reportes recientes
                        </Text>
                    </View>

                    {recentReports.map((report) => (
                        <ReportCard
                            key={report.id}
                            title={report.title}
                            status={report.status}
                            report={report.id}
                            category={report.category}
                            time={report.createdAt}
                            location={report.location}
                            onPress={() => { }}
                        />
                    ))}
                </>
            )}
        </ScrollView>
    )
}

const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },

        content: {
            padding: 20,
            paddingBottom: 100,
            gap: 16,
        },

        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
        },

        backButton: {
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
        },

        headerTitle: {
            flex: 1,
            fontFamily: 'MontserratAlternates_700Bold_Italic',
            fontSize: 22,
            color: colors.text,
        },

        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
        },

        sectionTitle: {
            fontFamily: 'Inter_600SemiBold',
            fontSize: 18,
            color: colors.text,
        },
        communityImage: {
            width: '100%',
            height: 180,
            borderRadius: 20,
        },

        sectionLink: {
            fontFamily: 'Inter_600SemiBold',
            fontSize: 13,
            color: colors.primary,
        },

        emptyText: {
            fontFamily: 'Inter_400Regular',
            fontSize: 13,
            color: colors.textSecondary,
        },
    })