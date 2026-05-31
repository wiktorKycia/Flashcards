import { useMutation } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/api'
import type { LoginResponse, LoginVariables } from '@/lib/auth'

const loginUser = async ({ login, password }: LoginVariables): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, password })
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

    return response.json() as Promise<LoginResponse>
}

export const useLogin = () => {
    return useMutation({
        mutationFn: loginUser
    })
}
