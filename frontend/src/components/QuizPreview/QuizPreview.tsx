import styles from './QuizPreview.module.scss'
import { useNavigate } from 'react-router'
import { useUserQuizLike } from '@/hooks/useQuizLikes.ts'
import { useCheckIfLoggedIn } from '@/hooks/useCheckIfLoggedIn.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import LoadingSpinner from '@/components/LoadingSpinner'

type Props = {
    className?: string
    quizId: number
    quizName: string
    quizDescription: string
    likes: number
    dislikes: number
}

export default function QuizPreview({className, quizId, quizName, quizDescription, likes, dislikes}: Props) {
    const navigate = useNavigate()
    const isLoggedIn = useCheckIfLoggedIn()
    const { user } = useAuth()

    let userId = undefined
    if (isLoggedIn && user) {
        userId = user.id
    }

    const { data, isLoading, error } = useUserQuizLike(quizId, userId)

    const likeWrapperClass = `${styles.Icon} ${
        isLoggedIn && !error && data?.isLiked === true
            ? styles.activeLike
            : ""
    }`

    const dislikeWrapperClass = `${styles.Icon} ${
        isLoggedIn && !error && data?.isLiked === false
            ? styles.activeDislike
            : ""
    }`

    const combinedClasses = [styles.previewWrapper, className].filter(Boolean).join(' ');

    return (
        <div className={combinedClasses}>
            <h3>{quizName}</h3>
            <p className={styles.description}>
                {quizDescription && quizDescription.slice(0, 50).trim()}
                {quizDescription && quizDescription.length > 50 && '...'}
            </p>
            <button onClick={() => navigate(`/quiz/${quizId}`)}>Otwórz zestaw</button>
            <div className={styles.votesWrapper}>
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <div className={styles.likesWrapper}>
                            <p>{likes}</p>
                            <svg
                                className={likeWrapperClass}
                                viewBox="0 0 24 24"
                                role="img"
                                aria-label="like"
                            >
                                <path d="M9 11V5.5c0-1.38 1.12-2.5 2.5-2.5.66 0 1.29.26 1.76.73L16 6h4c1.1 0 2 .9 2 2v4c0 .35-.09.69-.26 1l-3.1 6.2c-.34.68-1.03 1.1-1.79 1.1H8c-1.1 0-2-.9-2-2v-7c0-1.1.9-2 2-2h1zM2 11h3v9H2z" />
                            </svg>
                        </div>
                        <div className={styles.dislikesWrapper}>
                            <p>{dislikes}</p>
                            <svg
                                className={dislikeWrapperClass}
                                viewBox="0 0 24 24"
                                role="img"
                                aria-label="dislike"
                            >
                                <path d="M15 13v5.5c0 1.38-1.12 2.5-2.5 2.5-.66 0-1.29-.26-1.76-.73L8 18H4c-1.1 0-2-.9-2-2v-4c0-.35.09-.69.26-1l3.1-6.2C5.7 4.42 6.39 4 7.15 4H16c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2h-1zM22 13h-3V4h3z" />
                            </svg>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}