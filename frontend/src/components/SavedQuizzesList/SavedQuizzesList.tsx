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
            <h2>Zapisane zestawy</h2>
            {isError && (
                <div className={styles.errorMessage}>Wystąpił błąd</div>
            )}
            {isLoading && (
                <LoadingSpinner/>
            )}
            {!isError && !isLoading && data && (
                <Container cssClassName={'quiz-container'}>
                    {data.length > 0 ? data.map((quiz) => (
                        <ListableQuiz key={`saved-quiz-${quiz.id}`} id={quiz.id} name={quiz.name} description={quiz.description}/>
                    )) : (
                        <p className={styles.infoMessage}>Nie masz jeszcze zapisanych zestawów</p>
                    )}
                </Container>
            )}
        </div>
    )
}