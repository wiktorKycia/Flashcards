import { useQuery } from '@tanstack/react-query'
import resolvePromise from '@/helpers/resolvePromise'
import { type Quiz } from '@/types/Quiz.ts'

const getSavedQuizzes = async (userId: number): Promise<Quiz[]> => {
    const response = await fetch(`/api/users/${userId}/saved-quizzes`)
    return resolvePromise<Quiz[]>(response)
}

export const useSavedQuizzes = (userId: number) => {
    return useQuery({
        queryKey: ['savedQuizzes', userId],
        queryFn: () => getSavedQuizzes(userId),
        enabled: !!userId
    })
}
