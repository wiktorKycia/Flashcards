import { useMutation } from '@tanstack/react-query'

interface RegisterVariables {
    password: string
    name: string
    email: string
}

const register = async ({ password, name, email }: RegisterVariables) => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: name, email: email, password: password }),
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
        } catch (_err) {
            // ignore JSON parse errors and fall back to default message
        }

        throw new Error(message)
    }

    return response.json()
}

export const useRegister = () => {
    return useMutation({
        mutationFn: register
    })
}
