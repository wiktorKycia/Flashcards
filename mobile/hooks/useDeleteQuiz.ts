import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Alert } from 'react-native'

import { API_BASE_URL } from '@/lib/auth'

interface DeleteQuizVariables {
    id: number
}

const deleteQuiz = async ({ id }: DeleteQuizVariables): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }
}

export const useDeleteQuiz = () => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: deleteQuiz
    })

    const handleDeleteQuiz = ({
        id,
        onSuccess,
        confirmMessage
    }: {
        id: number
        onSuccess?: () => void
        confirmMessage?: string
    }) => {
        const message =
            confirmMessage ??
            'Na pewno chcesz usunąć ten quiz? Ta akcja jest nieodwracalna.'

        Alert.alert('Usuń quiz', message, [
            { text: 'Anuluj', style: 'cancel' },
            {
                text: 'Usuń',
                style: 'destructive',
                onPress: async () => {
                    setIsDeleting(true)
                    setDeleteError(null)

                    try {
                        await mutation.mutateAsync({ id })
                        onSuccess?.()
                    } catch {
                        setDeleteError('Nie udało się usunąć quizu')
                    } finally {
                        setIsDeleting(false)
                    }
                }
            }
        ])
    }

    return {
        isDeleting,
        deleteError,
        handleDeleteQuiz
    }
}
