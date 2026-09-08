import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native"
import CommentIcon from "@assets/comments.svg"
import LikesIcon from "@assets/likes.svg"
import ILikesIcon from "@assets/Ilikes.svg"

type Props = {
    title: string
    author: string
    createdAt: string
    description: string
    comment: number
    likes: number
    onPressComment: () => void
    onPressLike: () => void
    authorimage: ImageSourcePropType
    iLike?: boolean
}


export default function ForumPostCard({ iLike = true, title, author, createdAt, description, comment = 0, likes = 0, onPressComment, onPressLike, authorimage }: Props) {
    return (

        <View style={styles.container}>
            <View style = {styles.topsection}>
                <Image style={styles.profilephoto} source={authorimage} />
                <View>
                <Text style = {styles.author}>{author}</Text>
                <Text style = {styles.time}>{createdAt}</Text>
                </View>
            </View>
            <Text style= {styles.title} numberOfLines={1} >{title}</Text>
            <Text numberOfLines={3} style = {styles.description}>{description}</Text>

            <View style = {styles.bothsection}>
             <View style = {styles.iconssection}>
            <Pressable>
                <CommentIcon height={16} />
            </Pressable>
            <Text style= {styles.commentslikes}>{comment}</Text>
            </View>
            <View style = {styles.iconssection}>
            <Pressable >
                {!iLike && (<LikesIcon height={16}/>)}
                {iLike && (<ILikesIcon height={16}/>)}
            </Pressable>
            <Text style= {styles.commentslikes}>{likes}</Text>
            </View>
            </View>
        </View>


    )

}

const styles = StyleSheet.create({
    container: {
        width: 362,
        height: 202,
        alignItems: 'flex-start',
        padding: 16,
        borderWidth: 1.5,
        borderRadius: 20,
        borderColor: "#E2E8F0",
        justifyContent: 'center',
        gap:8

    },

    profilephoto: {
        width: 36,
        height: 36,
        borderRadius: 100

    },

    topsection:{
        flexDirection: 'row',
        gap: 8
    },

    author:{
        fontFamily:'Inter_700Bold',
        fontWeight:'bold',
        fontSize: 14,
        color: "#1E2744"
    },

    time:{
        fontFamily: "Inter_400Regular",
        color: "#64748B",
        fontSize: 13
    },
    title:{
        fontFamily:'Inter_700Bold',
        fontWeight:'bold',
        fontSize: 16,
        color: "#1E2744"
    },

    description:{
        fontFamily: "Inter_400Regular",
        color: "#64748B",
        fontSize: 13
    },
    bothsection:{
        flexDirection: 'row',
        gap:16,
        marginTop: 20
    },

    iconssection:{
        flexDirection: "row",
        gap:8
    },

    commentslikes:{
        fontFamily: "Inter_400Regular",
        color: "#64748B",
        fontSize: 13
        }

})