import { StyleSheet, TextInput } from 'react-native'

type Props = {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
}
export const CustomInput = ({ placeholder, value, onChangeText }: Props) => {
  return (
    <>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />
    </>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#B8B8B8',
    borderWidth: 1,
    height: 40,
    width: 266,
    fontSize: 16,
    fontFamily: 'MontserratAlternates_600SemiBold',
    color: '#919191',
    textAlign: 'left',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingLeft: 15,
  },
})
