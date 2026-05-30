import { useQuery } from '@tanstack/react-query'
import resolvePromise from '@/helpers/resolvePromise'
import { type Quiz } from '@/types/Quiz'

const getCreatedQuizzes = async (userId: number): Promise<Quiz[]> => {
    const response = await fetch(`/api/users/${userId}/created-quizzes`)
    return resolvePromise<Quiz[]>(response)
}

export const useCreatedQuizzes = (userId: number) => {
    return useQuery({
        queryKey: ['createdQuizzes', userId],
        queryFn: () => getCreatedQuizzes(userId),
        enabled: !!userId,
    })
}
