import { useMutation } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/api'
import type { RegisterVariables } from '@/lib/auth'

const registerUser = async (variables: RegisterVariables) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(variables)
    })

    if (!response.ok) {
        let message = `HTTP ${response.status}`

        try {
            const data = (await response.json()) as { error?: string; message?: string }
            message = data.error ?? data.message ?? message
        }
        catch {
            // Ignore JSON parsing errors and keep the fallback message.
        }

        throw new Error(message)
    }

    return response.json()
}

export const useRegister = () => {
    return useMutation({
        mutationFn: registerUser
    })
}
