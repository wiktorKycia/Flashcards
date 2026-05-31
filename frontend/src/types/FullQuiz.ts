interface UserQuizLike {
    id: number
    isLiked: boolean
    userId: number
    quizId: number
}

export default interface FullQuiz {
    id: number
    name: string
    description: string
    authorId: number
    frontLanguage: string
    backLanguage: string
    UserQuizLike?: UserQuizLike[]
    likes: number
    dislikes: number
}
