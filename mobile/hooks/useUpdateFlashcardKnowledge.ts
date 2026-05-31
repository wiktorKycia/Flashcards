import { useMutation, useQueryClient } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/api'
import { getQuizDataQueryKey } from '@/hooks/useQuizData'

interface UpdateFlashcardKnowledgeVars {
    quizId: number
    userId: number
    flashcardId: number
    isKnown: boolean
}

const updateFlashcardKnowledge = async ({
    quizId,
    userId,
    flashcardId,
    isKnown
}: UpdateFlashcardKnowledgeVars) => {
    const response = await fetch(
        `${API_BASE_URL}/api/quizzes-progress/user/${userId}/quiz/${quizId}/flashcard/${flashcardId}`,
        {
            method: 'PATCH',
            body: JSON.stringify({ isKnown }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useUpdateFlashcardKnowledge = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateFlashcardKnowledge,
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({
                queryKey: getQuizDataQueryKey(variables.quizId, variables.userId)
            })
        }
    })
}
