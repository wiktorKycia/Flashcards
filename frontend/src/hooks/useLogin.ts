import { useMutation } from '@tanstack/react-query'

interface LoginVariables {
    password: string
    login: string
}

const login = async ({ login, password }: LoginVariables): Promise<LoginReturn> => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ login: login, password: password }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        let message = `HTTP ${response.status}`

        try {
            const errorBody = (await response.json()) as { message?: string; error?: string }
            if (errorBody?.message) {
                message = errorBody.message
            } else if (errorBody?.error) {
                message = errorBody.error
            }
        } catch {
            // ignore JSON parse errors and fall back to default message
        }

        throw new Error(message)
    }

    return response.json()
}

export const useLogin = () => {
    return useMutation({
        mutationFn: login
    })
}

interface LoginReturn {
    token: string
    user: {
        id: number
        name: string
    }
}
