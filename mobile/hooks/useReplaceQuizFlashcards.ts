import { useMutation, useQueryClient } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/api'
import { getQuizDataQueryKey } from '@/hooks/useQuizData'

export interface ReplaceQuizFlashcard {
    front: string
    back: string
}

interface ReplaceQuizFlashcardsVariables {
    quizId: number
    flashcards: ReplaceQuizFlashcard[]
}

const replaceQuizFlashcards = async ({
    quizId,
    flashcards
}: ReplaceQuizFlashcardsVariables) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/flashcards`, {
        method: 'PUT',
        body: JSON.stringify(flashcards),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useReplaceQuizFlashcards = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: replaceQuizFlashcards,
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({
                queryKey: getQuizDataQueryKey(variables.quizId)
            })
        }
    })
}
