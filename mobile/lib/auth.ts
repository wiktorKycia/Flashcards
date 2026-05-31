export { API_BASE_URL } from '@/lib/api'

export interface LoginVariables {
    login: string
    password: string
}

export interface LoginResponse {
    token: string
    user: {
        id: number
        name: string
    }
}

export interface RegisterVariables {
    name: string
    email: string
    password: string
}
