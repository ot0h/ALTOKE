import { StyleSheet, TextInput, View } from 'react-native'
import SearchIcon from '@assets/search.svg'

type Props = {
    value: string
    onChangeText: (text: string) => void
    placeholder?: string
}

export default function SearchBar({
    value,
    onChangeText,
    placeholder = 'Buscar avisos o eventos...',
}: Props) {
    return (
        <View style={styles.container}>
            <SearchIcon width={20} height={20} />

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#64748B"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        gap: 8,

        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 20,

        backgroundColor: '#FFFFFF',
    },

    input: {
        flex: 1,
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        color: '#1E2744',
    },
})