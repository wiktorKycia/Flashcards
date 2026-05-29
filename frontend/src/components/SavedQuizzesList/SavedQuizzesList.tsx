import { useSavedQuizzes } from '@/hooks/useSavedQuizzes.ts'
import Container from '@/components/Container'
import LoadingSpinner from '@/components/LoadingSpinner'
import styles from './SavedQuizzesList.module.scss'
import ListableQuiz from '@/components/ListableQuiz'

interface SavedQuizzesListProps {
    userId: number
}

export default function SavedQuizzesList(props: SavedQuizzesListProps) {

    const { data, isLoading, isError } = useSavedQuizzes(props.userId)

    return (
        <div className={styles.SavedQuizzesList}>
            <h2>Zapisane quizy</h2>
            {isError && (
                <div>Wystąpił błąd</div>
            )}
            {isLoading && (
                <LoadingSpinner/>
            )}
            {!isError && !isLoading && data && (
                <Container cssClassName={'quiz-container'}>
                    {data && data.map((quiz) => (
                        <ListableQuiz id={quiz.id} name={quiz.name} description={quiz.description}/>
                    ))}
                </Container>
            )}
        </div>
    )
}