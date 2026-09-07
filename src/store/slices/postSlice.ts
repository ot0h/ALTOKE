import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type Comment = {
  id: string
  userId: string
  content: string
  createdAt: string
}

type Post = {
  id: string
  userId: string
  communityId: string
  title: string
  content: string
  comments: Comment[]
  likes: number
}


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
    setPosts: (
      state,
      action: PayloadAction<Post[]>
    ) => {
      state.posts = action.payload
    },

    addPost: (
      state,
      action: PayloadAction<Post>
    ) => {
      state.posts.push(action.payload)
    },

    setSelectedPost: (
      state,
      action: PayloadAction<Post>
    ) => {
      state.selectedPost = action.payload
    },

    removePost: (
      state,
      action: PayloadAction<string>
    ) => {
      state.posts = state.posts.filter(
        post => post.id !== action.payload
      )
    },

    likePost: (
      state,
      action: PayloadAction<string>
    ) => {
      const post = state.posts.find(
        post => post.id === action.payload
      )

      if (post) {
        post.likes += 1
      }
    },

    //PARA LOS COMENTARIOS 

      addComment: (
    state,
    action: PayloadAction<{
      postId: string
      comment: Comment
    }>
  ) => {
    const post = state.posts.find(
      post => post.id === action.payload.postId
    )

    if (post) {
      post.comments.push(action.payload.comment)
    }
  },

  removeComment: (
    state,
    action: PayloadAction<{
      postId: string
      commentId: string
    }>
  ) => {
    const post = state.posts.find(
      post => post.id === action.payload.postId
    )

    if (post) {
      post.comments = post.comments.filter(
        comment => comment.id !== action.payload.commentId
      )
    }
  },
}
})

export const{

    setPosts,
    likePost,
    addPost,
    removePost,
} = postsSlice.actions

export default postsSlice.reducer