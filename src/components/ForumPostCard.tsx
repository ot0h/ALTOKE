import { useState } from 'react'
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import CommentIcon from '@assets/comments.svg'
import LikesIcon from '@assets/likes.svg'
import ILikesIcon from '@assets/Ilikes.svg'

import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { useAppDispatch } from '../store/hook'
import {
  likePost,
  unlikePost,
} from '../store/slices/postSlice'

type Props = {
  postId: string
  title: string
  author: string
  createdAt: string
  description: string
  comment: number
  likes: number
  onPressComment: () => void
  authorimage: ImageSourcePropType
  iLike?: boolean
}

export default function ForumPostCard({
  postId,
  iLike = false,
  title,
  author,
  createdAt,
  description,
  comment = 0,
  likes = 0,
  onPressComment,
  authorimage,
}: Props) {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const dispatch = useAppDispatch()

  const [liked, setLiked] = useState(iLike)
  const [likeCount, setLikeCount] = useState(likes)

  const handleLike = () => {
    dispatch(likePost(postId))
  }

  return (
    <View style={styles.container}>

      {/* AUTOR */}

      <View style={styles.topsection}>
        <Image
          style={styles.profilephoto}
          source={authorimage}
        />

        <View>
          <Text style={styles.author}>
            {author}
          </Text>

          <Text style={styles.time}>
            {createdAt}
          </Text>
        </View>
      </View>

      {/* TÍTULO */}

      <Text
        style={styles.title}
        numberOfLines={1}
      >
        {title}
      </Text>

      {/* DESCRIPCIÓN */}

      <Text
        numberOfLines={3}
        style={styles.description}
      >
        {description}
      </Text>

      {/* COMENTARIOS / LIKES */}

      <View style={styles.bothsection}>

        {/* COMENTARIOS */}

        <View style={styles.iconssection}>
          <Pressable onPress={onPressComment}>
            <CommentIcon height={16} />
          </Pressable>

          <Text style={styles.commentslikes}>
            {comment}
          </Text>
        </View>

        {/* LIKES */}

        <View style={styles.iconssection}>
          <Pressable onPress={handleLike}>
            {iLike ? (
              <ILikesIcon height={16} />
            ) : (
              <LikesIcon height={16} />
            )}
          </Pressable>

          <Text style={styles.commentslikes}>
            {likes}
          </Text>
        </View>

      </View>
    </View>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      width: 362,
      height: 202,
      alignItems: 'flex-start',
      padding: 16,
      borderWidth: 1.5,
      borderRadius: 20,
      borderColor: colors.border,
      justifyContent: 'center',
      gap: 8,
    },

    profilephoto: {
      width: 36,
      height: 36,
      borderRadius: 100,
    },

    topsection: {
      flexDirection: 'row',
      gap: 8,
    },

    author: {
      fontFamily: 'Inter_700Bold',
      fontWeight: 'bold',
      fontSize: 14,
      color: colors.text,
    },

    time: {
      fontFamily: 'Inter_400Regular',
      color: colors.textSecondary,
      fontSize: 13,
    },

    title: {
      fontFamily: 'Inter_700Bold',
      fontWeight: 'bold',
      fontSize: 16,
      color: colors.text,
    },

    description: {
      fontFamily: 'Inter_400Regular',
      color: colors.textSecondary,
      fontSize: 13,
    },

    bothsection: {
      flexDirection: 'row',
      gap: 16,
      marginTop: 20,
    },

    iconssection: {
      flexDirection: 'row',
      gap: 8,
    },

    commentslikes: {
      fontFamily: 'Inter_400Regular',
      color: colors.textSecondary,
      fontSize: 13,
    },
  })