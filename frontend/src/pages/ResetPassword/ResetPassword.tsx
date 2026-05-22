import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useResetPassword } from '@/hooks/useResetPassword'
import styles from './ResetPassword.module.scss'

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') || ''

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const resetPassword = useResetPassword()

    const handleSubmit = (event: { preventDefault: () => void }) => {
        event.preventDefault()
        setMessage(null)
        setError(null)

        const trimmedPassword = password.trim()
        const trimmedConfirm = confirmPassword.trim()

        if (!token) {
            setError('Brak tokenu')
            return
        }

        if (!trimmedPassword) {
            setError('Haslo nie moze byc puste')
            return
        }

        if (trimmedPassword !== trimmedConfirm) {
            setError('Hasla nie sa zgodne')
            return
        }

        resetPassword.mutate(
            { token, password: trimmedPassword },
            {
                onSuccess: (data) => {
                    setMessage(data.message)
                    setPassword('')
                    setConfirmPassword('')
                },
                onError: () => {
                    setError('Nie udalo sie zresetowac hasla')
                }
            }
        )
    }

    return (
        <main className={styles.Main}>
            <form onSubmit={handleSubmit} className={styles.FormContainer}>
                <h1>Ustaw nowe haslo</h1>
                <input
                    type="password"
                    placeholder="nowe haslo"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <input
                    type="password"
                    placeholder="powtorz haslo"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button type="submit" disabled={resetPassword.isPending || !token}>
                    {resetPassword.isPending ? 'Zapisywanie...' : 'Zmien haslo'}
                </button>
                {message && <div className={styles.Message}>{message}</div>}
                {error && <div className={styles.Message}>{error}</div>}
                <div>
                    <Link to={'/login'}>Powrot do logowania</Link>
                </div>
            </form>
        </main>
    )
}

