import Container from '@/components/Container'
import { useCreatedQuizzes } from '@/hooks/useCreatedQuizzes.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import LoadingSpinner from '@/components/LoadingSpinner'
import styles from './CreatedQuizzesList.module.scss'
import ListableQuiz from '@/components/ListableQuiz'

interface CreatedQuizzesListProps {
    userId: number
}

export default function CreatedQuizzesList(props: CreatedQuizzesListProps) {
    const auth = useAuth()

    const { data, isLoading, isError } = useCreatedQuizzes(props.userId)

    if (!auth.user) {
        return <LoadingSpinner />
    }

    return (
        <div className={styles.CreatedQuizzesList}>
            <h2>Utworzone quizy</h2>
            {isError && <div>Wystąpił błąd</div>}
            {isLoading && <LoadingSpinner />}
            {!isError && !isLoading && data && (
                <Container cssClassName={'quiz-container'}>
                    {data.map((quiz) => (
                        <ListableQuiz id={quiz.id} name={quiz.name} description={quiz.description} />
                    ))}
                </Container>
            )}
        </div>
    )
}
