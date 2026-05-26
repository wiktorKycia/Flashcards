import { useGetAPI } from '@/hooks/useGetAPI.ts'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useQuizzes } from '@/hooks/useQuizzes.ts'

export default function Home() {
    const { quizzes, isLoading, isError } = useQuizzes()


    return (
        <>
            {isLoading && <LoadingSpinner />}
            {isError && <div>Wystąpił błąd</div>}
            {!isLoading && !isError && quizzes && (
                quizzes.length > 0 ? (
                    <div>
                        {quizzes.map((quiz) => (

                        ))}
                    </div>
                ) : (
                    <p>Nie znaleziono żadnych quizów</p>
                )
            )}
        </>
    )
}
