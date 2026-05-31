import { useQuery } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/api'
import resolvePromise from '@/lib/resolvePromise'
import type { Quiz } from '@/types/Quiz'

const getSavedQuizzes = async (userId: number): Promise<Quiz[]> => {
    const response = await fetch(
        `${API_BASE_URL}/api/users/${userId}/saved-quizzes`
    )
    return resolvePromise<Quiz[]>(response)
}

export const useSavedQuizzes = (userId: number) => {
    return useQuery({
        queryKey: ['savedQuizzes', userId],
        queryFn: () => getSavedQuizzes(userId),
        enabled: !!userId
    })
}
