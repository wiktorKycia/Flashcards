import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import resolvePromise from '@/helpers/resolvePromise'
import type FullQuiz from '@/types/FullQuiz.ts'
import { API_BASE_URL } from '@/lib/api'

interface QuizLikeCounts {
    likes: number
    dislikes: number
}

interface UserQuizLike {
    id: number
    isLiked: boolean
    userId: number
    quizId: number
}

interface UserQuizLikeVars {
    quizId: number
    userId: number
}

interface SetUserQuizLikeVars extends UserQuizLikeVars {
    isLiked: boolean
}

const getUserLikedQuizzes = async(userId: number): Promise<FullQuiz[]> => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/liked-quizzes`)
    return resolvePromise<FullQuiz[]>(response)
}

const fetchQuizLikeCounts = async (quizId: number): Promise<QuizLikeCounts> => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`)

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

const fetchUserQuizLike = async ({ quizId, userId }: UserQuizLikeVars): Promise<UserQuizLike | null> => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/quiz/${quizId}`)

    if (response.status === 404) {
        return null
    }

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

const setUserQuizLike = async ({ quizId, userId, isLiked }: SetUserQuizLikeVars): Promise<UserQuizLike> => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes-likes/user/${userId}/quiz/${quizId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isLiked })
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

const clearUserQuizLike = async ({ quizId, userId }: UserQuizLikeVars): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes-likes/user/${userId}/quiz/${quizId}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }
}

export const useUserLikedQuizzes = (userId: number) => {
    return useQuery({
        queryKey: ['likedQuizzes', userId],
        queryFn: () => getUserLikedQuizzes(userId),
        enabled: !!userId,
    })
}

export const useQuizLikeCounts = (quizId: number) => {
    return useQuery({
        queryKey: ['quiz-likes', quizId],
        queryFn: () => fetchQuizLikeCounts(quizId)
    })
}

export const useUserQuizLike = (quizId: number, userId?: number) => {
    return useQuery({
        queryKey: ['quiz-like', quizId, userId],
        queryFn: () => fetchUserQuizLike({ quizId, userId: userId as number }),
        enabled: userId != null
    })
}

export const useSetUserQuizLike = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: setUserQuizLike,
        onSuccess: async (_data, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['quiz-likes', variables.quizId]
                }),
                queryClient.invalidateQueries({
                    queryKey: ['quiz-like', variables.quizId, variables.userId]
                })
            ])
        }
    })
}

export const useClearUserQuizLike = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: clearUserQuizLike,
        onSuccess: async (_data, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['quiz-likes', variables.quizId]
                }),
                queryClient.invalidateQueries({
                    queryKey: ['quiz-like', variables.quizId, variables.userId]
                })
            ])
        }
    })
}
