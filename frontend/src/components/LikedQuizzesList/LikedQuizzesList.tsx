import styles from './LikedQuizzesList.module.scss'
import LoadingSpinner from '@/components/LoadingSpinner'
import type FullQuiz from '@/types/FullQuiz.ts'
import { useUserLikedQuizzes } from '@/hooks/useQuizLikes.ts'
import Container from '@/components/Container'
import ListableQuiz from '@/components/ListableQuiz'

interface LikedQuizzesListProps {
    userId: number
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
                <Container cssClassName={`quiz-container ${styles.PreviewBox}`}>
                    {quizzes.length > 0 ? (
                        quizzes.map((quiz: FullQuiz) => (
                            <ListableQuiz id={quiz.id} name={quiz.name} description={quiz.description} />
                        ))
                    ) : (
                        <p className={styles.infoMessage}>Nie masz jeszcze żadnych polubionych zestawów</p>
                    )}
                </Container>
            )}
        </div>
    )
}
