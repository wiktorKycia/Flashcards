import { useMutation } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/auth'

export interface CreateQuizPayload {
    name: string
    description: string | null
    frontLanguage: string
    backLanguage: string
    authorId: number
}

interface CreatedQuiz {
    id: number
    name: string
    description: string | null
    authorId: number
    frontLanguage: string
    backLanguage: string
}

const createQuiz = async (payload: CreateQuizPayload): Promise<CreatedQuiz> => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useCreateQuiz = () => {
    return useMutation({
        mutationFn: createQuiz
    })
}
