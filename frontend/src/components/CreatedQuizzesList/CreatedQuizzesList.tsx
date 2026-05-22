import { Link } from 'react-router'
import Container from '@/components/Container'
import { useCreatedQuizzes } from '@/hooks/useCreatedQuizzes.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import LoadingSpinner from '@/components/LoadingSpinner'

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
        <>
            <h2>Utworzone quizy</h2>
            {isError && (
                <div>Wystąpił błąd</div>
            )}
            {isLoading && (
                <LoadingSpinner/>
            )}
            {!isError && !isLoading && data && (
                <Container cssClassName={'quiz-container'}>
                    {data.map((quiz) => (
                        <Link to={`/quiz/${quiz.id}`} key={quiz.id} className={'quiz-item'}>
                            <h2>{quiz.name}</h2>
                            <p>{quiz.description}</p>
                        </Link>
                    ))}
                </Container>
            )}
        </>
    )
}