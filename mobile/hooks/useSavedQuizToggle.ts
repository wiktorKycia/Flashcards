import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/api'

const checkIsSaved = async (userId: number, quizId: number): Promise<boolean> => {
    const response = await fetch(
        `${API_BASE_URL}/api/saved-quizzes/user/${userId}/quiz/${quizId}`
    )
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }
    const data = await response.json()
    return data.isSaved
}

const toggleSaved = async ({
    userId,
    quizId,
    isCurrentlySaved
}: {
    userId: number
    quizId: number
    isCurrentlySaved: boolean
}) => {
    if (isCurrentlySaved) {
        const response = await fetch(
            `${API_BASE_URL}/api/saved-quizzes?userId=${userId}&quizId=${quizId}`,
            { method: 'DELETE' }
        )
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }
    } else {
        const response = await fetch(`${API_BASE_URL}/api/saved-quizzes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, quizId })
        })
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }
    }
}

export const useSavedQuizToggle = (userId: number | undefined, quizId: number | undefined) => {
    const queryClient = useQueryClient()
    const queryKey = ['savedQuiz', userId, quizId]

    const {
        data: isSaved = false,
        isLoading,
        isError
    } = useQuery({
        queryKey,
        queryFn: () => checkIsSaved(userId!, quizId!),
        enabled: userId !== undefined && quizId !== undefined
    })

    const mutation = useMutation({
        mutationFn: () =>
            toggleSaved({ userId: userId!, quizId: quizId!, isCurrentlySaved: isSaved }),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey })
            const previousSavedState = queryClient.getQueryData<boolean>(queryKey)
            queryClient.setQueryData<boolean>(queryKey, (old) => !old)
            return { previousSavedState }
        },
        onError: (_err, _newSaved, context) => {
            if (context?.previousSavedState !== undefined) {
                queryClient.setQueryData(queryKey, context.previousSavedState)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey })
            if (userId !== undefined) {
                queryClient.invalidateQueries({ queryKey: ['savedQuizzes', userId] })
            }
        }
    })

    const toggle = () => {
        if (userId !== undefined && quizId !== undefined) {
            mutation.mutate()
        }
    }

    return {
        isSaved,
        toggle,
        isLoading,
        isError,
        isMutating: mutation.isPending
    }
}
