import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import Patronato from "@assets/patronato.png"
import { CustomButton } from "@components"
import ProfileAvatar from "../components/ProfileAvatar"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const MyProfile = () => {

    const communities = [
        {
            id: "1",
            name: "Patronato",
            role: "Administrador",
        },
        {
            id: "2",
            name: "Colonia Centro",
            role: "Miembro",
        },
    ]
    const insets = useSafeAreaInsets()

    return (

        <ScrollView
            contentContainerStyle={[styles.container, {paddingTop:insets.top, paddingBottom: insets.bottom}]}
            showsVerticalScrollIndicator={false}
        >

            {/* HEADER */}

            <Text style={styles.title}>
                Mi Perfil
            </Text>

            {/* FOTO */}

            <View style={styles.profileSection}>
                <ProfileAvatar
                    image={Patronato}
                    onEdit={() => { }}
                />

                <Text style={styles.name}>
                    David
                </Text>

                <Text style={styles.email}>
                    david@email.com
                </Text>
            </View>

            {/* COMUNIDADES */}

            <View style={styles.section}>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Mis Comunidades
                    </Text>

                    <Text style={styles.communityCount}>
                        {communities.length}
                    </Text>
                </View>

                <View style={styles.communityList}>

                    {communities.map((community) => (
                        <View
                            key={community.id}
                            style={styles.communityCard}
                        >

                            <View style={styles.communityInfo}>

                                <Text style={styles.communityName}>
                                    {community.name}
                                </Text>

                                <Text style={styles.communityRole}>
                                    {community.role}
                                </Text>

                            </View>

                            {community.role === "Administrador" ? (
                                <Pressable
                                    style={styles.manageButton}
                                    onPress={() => { }}
                                >
                                    <Text style={styles.manageButtonText}>
                                        Administrar
                                    </Text>
                                </Pressable>
                            ) : (
                                <Pressable
                                    style={styles.viewButton}
                                    onPress={() => { }}
                                >
                                    <Text style={styles.viewButtonText}>
                                        Ver
                                    </Text>
                                </Pressable>
                            )}

                        </View>
                    ))}

                </View>

            </View>

            {/* CREAR COMUNIDAD */}

            <CustomButton
                text="Crear Comunidad"
                onPress={() => { }}
                variant="secondary"
            />

            {/* CERRAR SESIÓN */}

            <Pressable
                style={styles.logoutButton}
                onPress={() => { }}
            >
                <Text style={styles.logoutText}>
                    Cerrar sesión
                </Text>
            </Pressable>

        </ScrollView>
    )
}

const styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 32,
        gap: 24,
    },

    title: {
        fontFamily: "MontserratAlternates_700Bold_Italic",
        fontSize: 22,
        color: "#1E2744",
    },

    profileSection: {
        alignItems: "center",
        gap: 8,
    },

    name: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 18,
        color: "#1E2744",
    },

    email: {
        fontFamily: "Inter_400Regular",
        fontSize: 13,
        color: "#64748B",
    },

    section: {
        gap: 12,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    sectionTitle: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 18,
        color: "#1E2744",
    },

    communityCount: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 13,
        color: "#64748B",
    },

    communityList: {
        gap: 10,
    },

    communityCard: {
        minHeight: 76,
        paddingHorizontal: 14,
        paddingVertical: 12,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 14,

        backgroundColor: "#FFFFFF",
    },

    communityInfo: {
        flex: 1,
        gap: 4,
    },

    communityName: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
        color: "#1E2744",
    },

    communityRole: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
        color: "#64748B",
    },

    manageButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: "#1E2744",
    },

    manageButtonText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 12,
        color: "#FFFFFF",
    },

    viewButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },

    viewButtonText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 12,
        color: "#1E2744",
    },

    logoutButton: {
        alignItems: "center",
        paddingVertical: 12,
    },

    logoutText: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 14,
        color: "#DC2626",
    },

})