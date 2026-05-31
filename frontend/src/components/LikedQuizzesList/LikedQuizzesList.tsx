import styles from './LikedQuizzesList.module.scss'
import LoadingSpinner from '@/components/LoadingSpinner'
import type FullQuiz from '@/types/FullQuiz.ts'
import QuizPreview from '@/components/QuizPreview'
import { useUserLikedQuizzes } from '@/hooks/useQuizLikes.ts'
import Container from '@/components/Container'

interface LikedQuizzesListProps {
    userId: number,
    isSmallVersion: boolean
}

export default function LikedQuizzesList(props: LikedQuizzesListProps) {
    console.log(props.userId)
    const { data: quizzes = [], isLoading, isError } = useUserLikedQuizzes(props.userId)

    return (
        <div className={styles.LikedQuizzesList}>
            <h2>Polubione zestawy</h2>
            {isError && <div className={styles.errorMessage}>Wystąpił błąd</div>}
            {isLoading && <LoadingSpinner />}
            {!isLoading && !isError && quizzes && (
                <Container cssClassName={`quiz-container ${styles.previewBox}`}>
                    {quizzes.length > 0 ? quizzes.map((quiz: FullQuiz) => (
                        <QuizPreview
                            className={props.isSmallVersion ? styles.smallPreview : ""}
                            key={`liked-quiz-${quiz.id}`}
                            quizId={quiz.id}
                            quizName={quiz.name}
                            quizDescription={quiz.description}
                            likes={quiz.likes}
                            dislikes={quiz.dislikes}
                        />
                    )) : (
                        <p className={styles.infoMessage}>Nie masz jeszcze żadnych polubionych zestawów</p>
                    )}
                </Container>
            )}
        </div>
    )
}