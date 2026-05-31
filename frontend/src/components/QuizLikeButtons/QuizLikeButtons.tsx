import styles from './QuizLikeButtons.module.scss'
import { useAuth } from '@/context/AuthContext.tsx'
import { useClearUserQuizLike, useQuizLikeCounts, useSetUserQuizLike, useUserQuizLike } from '@/hooks/useQuizLikes.ts'

interface QuizLikeButtonsProps {
    quizId: number
}

export default function QuizLikeButtons(props: QuizLikeButtonsProps) {
    const auth = useAuth()
    const userId = auth.user?.id
    const isLoggedIn = !!auth.token

    const { data: counts } = useQuizLikeCounts(props.quizId)
    const { data: userLike } = useUserQuizLike(props.quizId, userId)

    const setUserQuizLike = useSetUserQuizLike()
    const clearUserQuizLike = useClearUserQuizLike()

    const isLiked = userLike?.isLiked === true
    const isDisliked = userLike?.isLiked === false
    const isUpdating = setUserQuizLike.isPending || clearUserQuizLike.isPending

    const likeCount = counts?.likes ?? 0
    const dislikeCount = counts?.dislikes ?? 0

    async function handleLikeClick() {
        if (!userId) return

        if (isLiked) {
            await clearUserQuizLike.mutateAsync({ quizId: props.quizId, userId })
            return
        }

        await setUserQuizLike.mutateAsync({ quizId: props.quizId, userId, isLiked: true })
    }

    async function handleDislikeClick() {
        if (!userId) return

        if (isDisliked) {
            await clearUserQuizLike.mutateAsync({ quizId: props.quizId, userId })
            return
        }

        await setUserQuizLike.mutateAsync({ quizId: props.quizId, userId, isLiked: false })
    }

    return (
        <div className={styles.Buttons}>
            <button
                type="button"
                onClick={handleLikeClick}
                disabled={!isLoggedIn || isUpdating}
                aria-pressed={isLiked}
                className={`${styles.Button} ${isLiked ? styles.Active : ''}`}
            >
                <svg className={styles.Icon} viewBox="0 0 24 24" role="img" aria-label="like">
                    <path d="M9 11V5.5c0-1.38 1.12-2.5 2.5-2.5.66 0 1.29.26 1.76.73L16 6h4c1.1 0 2 .9 2 2v4c0 .35-.09.69-.26 1l-3.1 6.2c-.34.68-1.03 1.1-1.79 1.1H8c-1.1 0-2-.9-2-2v-7c0-1.1.9-2 2-2h1zM2 11h3v9H2z" />
                </svg>
                <span>{likeCount}</span>
            </button>
            <button
                type="button"
                onClick={handleDislikeClick}
                disabled={!isLoggedIn || isUpdating}
                aria-pressed={isDisliked}
                className={`${styles.Button} ${isDisliked ? styles.Active : ''}`}
            >
                <svg className={styles.Icon} viewBox="0 0 24 24" role="img" aria-label="dislike">
                    <path d="M15 13v5.5c0 1.38-1.12 2.5-2.5 2.5-.66 0-1.29-.26-1.76-.73L8 18H4c-1.1 0-2-.9-2-2v-4c0-.35.09-.69.26-1l3.1-6.2C5.7 4.42 6.39 4 7.15 4H16c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2h-1zM22 13h-3V4h3z" />
                </svg>
                <span>{dislikeCount}</span>
            </button>
        </div>
    )
}
