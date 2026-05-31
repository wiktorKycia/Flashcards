import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const checkIsSaved = async (userId: number, quizId: number): Promise<boolean> => {
    const response = await fetch(`/api/saved-quizzes?userId=${userId}&quizId=${quizId}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
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
        const response = await fetch(`/api/saved-quizzes?userId=${userId}&quizId=${quizId}`, {
            method: 'DELETE'
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
    } else {
        const response = await fetch(`/api/saved-quizzes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, quizId })
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
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
        mutationFn: () => toggleSaved({ userId: userId!, quizId: quizId!, isCurrentlySaved: isSaved }),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey })
            const previousSavedState = queryClient.getQueryData<boolean>(queryKey)

            // Optimistically update to the new value
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
