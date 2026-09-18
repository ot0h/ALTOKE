import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Comment, Post } from '../../types'

type PostsState = {
  posts: Post[]
  selectedPost: Post | null
  loading: boolean
}

const initialState: PostsState = {
  posts: [],
  selectedPost: null,
  loading: false,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,

  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload
    },

    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload)
    },

    setSelectedPost: (state, action: PayloadAction<Post>) => {
      state.selectedPost = action.payload
    },

    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload)
    },

    likePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((post) => post.id === action.payload)

      if (!post) return

      if (post.iLike) {
        post.iLike = false
        post.likes = Math.max(0, post.likes - 1)
      } else {
        post.iLike = true
        post.likes += 1
      }
    },

    //PARA LOS COMENTARIOS

    addComment: (
      state,
      action: PayloadAction<{
        postId: string
        comment: Comment
      }>,
    ) => {
      const post = state.posts.find((post) => post.id === action.payload.postId)

      if (post) {
        post.comments.push(action.payload.comment)
      }
    },
    unlikePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(
        (post) => post.id === action.payload
      )

      if (post && post.likes > 0) {
        post.likes -= 1
      }
    },

    removeComment: (
      state,
      action: PayloadAction<{
        postId: string
        commentId: string
      }>,
    ) => {
      const post = state.posts.find((post) => post.id === action.payload.postId)

      if (post) {
        post.comments = post.comments.filter(
          (comment) => comment.id !== action.payload.commentId,
        )
      }
    },

    incrementComments: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((post) => post.id === action.payload)

      if (post) {
        post.commentsCount += 1
      }
    },

    decrementComments: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((post) => post.id === action.payload)

      if (post) {
        post.commentsCount = Math.max(0, post.commentsCount - 1)
      }
    },
  },
})

export const {
  setPosts,
  likePost,
  unlikePost,
  addPost,
  removePost,
  addComment,
  removeComment,
  incrementComments,
  decrementComments,
} = postsSlice.actions

export default postsSlice.reducer
