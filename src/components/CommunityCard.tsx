import { Image, ImageSourcePropType, Pressable, StyleSheet,  } from "react-native"
import { Text } from "react-native"

type Props = {
    title: string,
    description?: string,
    image: ImageSourcePropType,
    time?: string,
    author?: string,
    onPress: () => void,
    variant?: "compact" | "extended"
}

export default function CommunityCard({title, onPress, description, image, time, author, variant = "compact"}: Props){
    
    return(
        <Pressable
        style = {[styles.card,
                  variant === 'compact'? styles.compactmode : styles.extended]}
        onPress={onPress}>
            <Image source={image}/>
            <Text>{title}</Text>
            <Text>{author}</Text>
            <Text>{description}</Text>
            <Text>{time}</Text>
        </Pressable>

    )

}

const styles = StyleSheet.create({
card:{
    overflow: 'hidden',
    backgroundColor: '#FFFF'
},

compactmode:{
borderColor: '#E2E8F0',
borderRadius: 15,
flexDirection : 'row'
},

extended:{

}

}

)