import { JSX, useEffect, useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { CustomButton } from '@components'
import CommunityCard from '../components/CommunityCard'
import ForumPostCard from '../components/ForumPostCard'
import ReportCard from '../components/ReportCard'

import Patronato from '@assets/patronato.png'
import { store } from '../store'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { addCommunity } from '../store/slices/communitySlice'
import { setPosts } from '../store/slices/postSlice'
import { setReports } from '../store/slices/reportSlice'
import { communityService, postService, reportService } from '../services'
import { mergeById } from '../utils/mergeById'
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
    const dispatch = useAppDispatch()

    const community = useAppSelector((state) =>
        state.community.communities.find(
            (community) => community.id === communityId,
        ),
    )

    const allPosts = useAppSelector((state) => state.post.posts)
    const allReports = useAppSelector((state) => state.report.reports)

    const posts = useMemo(
        () => allPosts.filter((post) => post.communityId === communityId),
        [allPosts, communityId],
    )

    const reports = useMemo(
        () => allReports.filter((report) => report.communityId === communityId),
        [allReports, communityId],
    )

    useEffect(() => {
        const loadData = async () => {
            try {
                if (!community) {
                    const fetchedCommunity =
                        await communityService.fetchCommunity(communityId)
                    if (fetchedCommunity) {
                        dispatch(addCommunity(fetchedCommunity))
                    }
                }

                const [fetchedPosts, fetchedReports] = await Promise.all([
                    postService.fetchPosts(communityId),
                    reportService.fetchReports(communityId),
                ])

                const mergedPosts = mergeById(
                    store.getState().post.posts,
                    fetchedPosts,
                )
                const mergedReports = mergeById(
                    store.getState().report.reports,
                    fetchedReports,
                )

                dispatch(setPosts(mergedPosts))
                dispatch(setReports(mergedReports))
            } catch (error) {
                console.error('[CommunityHome] Error cargando datos:', error)
            }
        }
        loadData()
    }, [communityId, community, dispatch])

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
                    navigation.navigate('ReportProblem', { communityId })
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