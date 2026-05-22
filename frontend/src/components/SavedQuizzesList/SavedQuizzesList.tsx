import { Link } from 'react-router'
import { useSavedQuizzes } from '@/hooks/useSavedQuizzes.ts'
import Container from '@/components/Container'
import LoadingSpinner from '@/components/LoadingSpinner'
import styles from './SavedQuizzesList.module.scss'

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
                        <Link to={`/quiz/${quiz.id}`} key={quiz.id} className={'quiz-item'}>
                            <h2>{quiz.name}</h2>
                            <p>{quiz.description}</p>
                        </Link>
                    ))}
                </Container>
            )}
        </div>
    )
}