import { useGetAPI } from '@/hooks/useGetAPI.ts'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useQuizzes } from '@/hooks/useQuizzes.ts'
import QuizPreview from '@/components/QuizPreview'
import type Quiz from '@/types/Quiz.ts'

export default function Home() {
    const { data: quizzes = [], isLoading, isError } = useQuizzes()


    return (
        <>
            {isLoading && <LoadingSpinner />}
            {isError && <div>Wystąpił błąd</div>}
            {!isLoading && !isError && quizzes && (
                quizzes.length > 0 ? (
                    <div>
                        {quizzes.map((quiz: Quiz) => (
                            <QuizPreview
                                quizId={quiz.id}
                                quizName={quiz.name}
                                quizDescription={quiz.description}
                                likes={quiz.likes}
                                dislikes={quiz.dislikes}
                            />
                        ))}
                    </div>
                ) : (
                    <p>Nie znaleziono żadnych quizów</p>
                )
            )}
        </>
    )
}
