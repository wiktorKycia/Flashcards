import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLogin } from '@/hooks/useLogin.ts'
import styles from './Login.module.scss'
import { Link, type NavigateFunction } from 'react-router'

export default function Login() {
    const navigate: NavigateFunction = useNavigate()
    const { login, token } = useAuth()

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token, navigate])

    const [form, setForm] = useState({ login: '', password: '' })

    const loginMutation = useLogin()

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        loginMutation.mutate(
            {
                login: form.login,
                password: form.password
            },
            {
                onSuccess: (data) => {
                    console.log(data)
                    login(data.token, data.user)
                    navigate('/')
                }
            }
        )
    }

    return (
        <>
            <main className={styles.Main}>
                <form onSubmit={handleSubmit} className={styles.FormContainer}>
                    <h1>Zaloguj się</h1>
                    {loginMutation.isError && (
                        <div style={{ color: 'red', marginBottom: '0.5rem' }}>
                            {(loginMutation.error as Error).message}
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="login"
                        onChange={(e) => setForm({ ...form, login: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="hasło"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button type="submit">Zaloguj się</button>
                    <div>
                        Nie masz konta? <Link to={'/register'}>Zarejestruj się</Link>
                    </div>
                </form>
            </main>
        </>
    )
}
