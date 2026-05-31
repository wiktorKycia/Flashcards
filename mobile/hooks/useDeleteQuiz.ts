import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Alert } from 'react-native'

import { API_BASE_URL } from '@/lib/api'

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
    const queryClient = useQueryClient()
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: deleteQuiz,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['quizzes'] })
        }
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
                onPress: () => {
                    setDeleteError(null)
                    mutation.mutate(
                        { id },
                        {
                            onSuccess: () => onSuccess?.(),
                            onError: () => setDeleteError('Nie udało się usunąć quizu')
                        }
                    )
                }
            }
        ])
    }

    return {
        isDeleting: mutation.isPending,
        deleteError,
        handleDeleteQuiz
    }
}
