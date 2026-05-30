import { useMutation, useQueryClient } from '@tanstack/react-query'

interface ResetQuizProgressVars {
    quizId: number
    userId: number
}

interface ResetQuizProgressResponse {
    count: number
}

const resetQuizProgress = async ({ quizId, userId }: ResetQuizProgressVars): Promise<ResetQuizProgressResponse> => {
    const response = await fetch(`/api/quizzes-progress/user/${userId}/quiz/${quizId}/reset`, {
        method: 'PATCH'
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useResetQuizProgress = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: resetQuizProgress,
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ['quiz', variables.quizId, variables.userId]
            })
        }
    })
}
