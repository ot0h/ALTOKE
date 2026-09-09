import { Pressable, StyleSheet, Text } from 'react-native'

type Props = {
    text: string
    selected?: boolean
    onPress?: () => void
}

export const CategoryTag = ({
    text,
    selected = false,
    onPress,
}: Props) => {
    return (
        <Pressable
            style={[
                styles.tag,
                selected && styles.selected,
            ]}
            onPress={onPress}
        >
            <Text
                style={[
                    styles.text,
                    selected && styles.selectedText,
                ]}
            >
                {text}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    tag: {
        paddingHorizontal: 20,
        paddingVertical: 12,

        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 24,

        backgroundColor: '#FFFFFF',

        alignItems: 'center',
        justifyContent: 'center',
    },

    selected: {
        backgroundColor: '#0145EA',
        borderColor: '#0145EA',
    },

    text: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: '#1E2744',
    },

    selectedText: {
        color: '#FFFFFF',
    },
})