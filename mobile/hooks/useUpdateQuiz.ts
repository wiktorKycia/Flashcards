import { useMutation } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/api'

export interface UpdateQuizVariables {
    id: number
    name: string
    frontLanguage: string
    backLanguage: string
    description: string | null
}

const updateQuiz = async ({
    id,
    name,
    frontLanguage,
    backLanguage,
    description
}: UpdateQuizVariables) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            name,
            description,
            frontLanguage,
            backLanguage
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useUpdateQuiz = () => {
    return useMutation({
        mutationFn: updateQuiz
    })
}
