import { ThemeColors, useTheme } from "@contexts/ThemeContext";
import { Modal, StyleSheet, Text, View, Pressable, Switch } from "react-native";

type Props = {
    visible: boolean
    onClose: () => void
}

export default function SettingsModal({ visible, onClose }: Props) {
    const { colors, isDark, toggleTheme } = useTheme()
    const styles = createStyles(colors)

    const cerrar = () => {
        onClose()
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={cerrar}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.title}>Configuración</Text>

                        <Pressable onPress={cerrar}>
                            <Text style={styles.close}>×</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.sectionTitle}>
                        Apariencia
                    </Text>

                    <View style={styles.option}>
                        <View>
                            <Text style={styles.optionTitle}>
                                Modo oscuro
                            </Text>

                            <Text style={styles.optionDescription}>
                                Cambiar entre modo claro y oscuro
                            </Text>
                        </View>

                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{
                                false: colors.border,
                                true: colors.primary,
                            }}
                            thumbColor={colors.surface}
                        />
                    </View>

                </View>
            </View>
        </Modal>
    )
}

const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            justifyContent: 'flex-end',
        },

        container: {
            backgroundColor: colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            paddingBottom: 40,
        },

        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 28,
        },

        title: {
            fontSize: 22,
            fontFamily: 'MontserratAlternates_600SemiBold',
            color: colors.text,
        },

        close: {
            fontSize: 30,
            color: colors.textSecondary,
        },

        sectionTitle: {
            fontSize: 14,
            fontFamily: 'MontserratAlternates_600SemiBold',
            color: colors.textSecondary,
            marginBottom: 12,
        },

        option: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },

        optionTitle: {
            fontSize: 16,
            fontFamily: 'MontserratAlternates_600SemiBold',
            color: colors.text,
        },

        optionDescription: {
            marginTop: 4,
            fontSize: 12,
            fontFamily: 'Inter_400Regular',
            color: colors.textSecondary,
        },
    })