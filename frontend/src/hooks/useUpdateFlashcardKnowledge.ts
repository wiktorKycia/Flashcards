import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UpdateFlashcardKnowledgeVars {
    quizId: number
    userId: number
    flashcardId: number
    isKnown: boolean
}

const updateFlashcardKnowledge = async ({ quizId, userId, flashcardId, isKnown }: UpdateFlashcardKnowledgeVars): Promise<FlashcardKnowledge> => {
    const response = await fetch(`/api/quizzes-progress/user/${userId}/quiz/${quizId}/flashcard/${flashcardId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isKnown: isKnown }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}


export const useUpdateFlashcardKnowledge = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateFlashcardKnowledge,
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ['quiz', variables.quizId, variables.userId]
            })
        }
    })
}

interface FlashcardKnowledge {
    isKnown: boolean
}