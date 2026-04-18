import { useQuery } from '@tanstack/react-query'

const register = async (password: string, username?: string, email?: string) => {
    const response = await fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({name: username, email: email, password: password}),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useRegister = (password: string, username?: string, email?: string) => {
    return useQuery({
        queryKey: ['userRegister', password, username, email],
        queryFn: () => register(password, username, email)
    })
}
