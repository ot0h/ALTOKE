import { Image, ImageSourcePropType, Pressable, StyleSheet, } from "react-native"
import { Text, View } from "react-native"
import { JSX } from 'react'



type Props = {
    title: string,
    description?: string,
    image: ImageSourcePropType,
    time?: string,
    author?: string,
    onPress: () => void,
    variant?: "compact" | "extended"
}

export default function CommunityCard({ title, onPress, description, image, time, author, variant = "compact" }: Props) {
    return (
        <Pressable
            style={[styles.card,
            variant === 'compact' ? [styles.compactmode, styles.compact] : [styles.extendedmode, styles.extend]]}
            onPress={onPress}>

            <Image style={variant === 'compact' ? styles.imagecompact : styles.imageextended} source={image} />

            <View style={variant === 'compact' ? styles.textcontainer : styles.extendtextcontainer}>
                <Text style={variant === 'compact' ? styles.titlecompact : styles.textextend}>{title}</Text>
                <Text style={variant === 'compact' ? styles.subtitle : styles.extendsubtitle}>{time && author ? `${time} • ${author}` : time || author}{description}</Text>

            </View>
        </Pressable>

    )

}

const styles = StyleSheet.create({
    card: {
        overflow: 'hidden',
        backgroundColor: '#FFFF',
        width: 362,
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 12,
    },
    compact: {
        height: 88,
    },

    extend: {
        height: 218,
        shadowOffset: { width: 0, height: 4 },
        shadowColor: '#000000',
        shadowRadius: 8,
        shadowOpacity: 0.15,
        elevation: 4,
    },

    imagecompact: {
        width: 64,
        height: 64,
        objectFit: 'fill',
        borderRadius: 12,

    },
    extendsubtitle: {
        fontFamily: 'Inter_400Regular',
        color: '#64748B',
        fontSize: 13
    },

    textcontainer: {
        gap: 4,
        marginLeft: 12,
        marginTop: 15,
    },

    titlecompact: {
        fontFamily: 'Inter_600SemiBold',
        fontWeight: 'semibold',
        fontSize: 14,
        color: '#1E2744',
    },

    subtitle: {
        fontFamily: 'Inter_400Regular',
        color: '#64748B',
        fontSize: 11

    },

    compactmode: {
        borderColor: '#E2E8F0',
        borderRadius: 15,
        flexDirection: 'row',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 12
    },

    extendedmode: {
        flexDirection: "column"
    },

    imageextended: {
        width: 362,
        height: 140,
        objectFit: 'fill',
        borderTopStartRadius: 12
    },

    extendtextcontainer: {
        gap: 4,
        marginLeft: 16,
        marginTop: 14,
    },

    textextend: {
        fontFamily: 'MontserratAlternates_800ExtraBold',
        fontWeight: 'semibold',
        fontSize: 18,
        color: '#1E2744',
    }

}


)