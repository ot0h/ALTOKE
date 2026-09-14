import { StyleSheet, TextInput, View } from 'react-native'
import SearchIcon from '@assets/search.svg'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'

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
  const { colors } = useTheme()
  const styles = createStyles(colors)
  return (
    <View style={styles.container}>
      <SearchIcon width={20} height={20} />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
      />
    </View>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      height: 40,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      gap: 8,

      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,

      backgroundColor: colors.surface,
    },

    input: {
      flex: 1,
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.text,
    },
  })
