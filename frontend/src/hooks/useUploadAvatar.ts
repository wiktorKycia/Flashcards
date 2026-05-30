import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'

export function useUploadAvatar() {
    const queryClient = useQueryClient()
    const { token, user } = useAuth()

    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData()
            formData.append('avatar', file)

            const res = await fetch('/api/users/avatar', {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!res.ok) {
                const { error: msg } = await res.json()
                throw new Error(msg ?? 'Upload failed')
            }

            const data = await res.json()
            return data.avatarUrl as string
        },
        onSuccess: () => {
            if (user?.id) {
                queryClient.invalidateQueries({ queryKey: ['userAvatar', user.id] })
            }
        }
    })
}
