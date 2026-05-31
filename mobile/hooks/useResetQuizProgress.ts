import { useMutation } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/auth'

interface ResetQuizProgressVars {
    quizId: number
    userId: number
}

const resetQuizProgress = async ({ quizId, userId }: ResetQuizProgressVars) => {
    const response = await fetch(
        `${API_BASE_URL}/api/quizzes-progress/user/${userId}/quiz/${quizId}/reset`,
        { method: 'PATCH' }
    )

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useResetQuizProgress = () => {
    return useMutation({
        mutationFn: resetQuizProgress
    })
}
