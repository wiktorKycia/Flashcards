import { useState } from 'react'
import { Link } from 'react-router'
import { useRequestPasswordReset } from '@/hooks/useRequestPasswordReset'
import styles from './ForgotPassword.module.scss'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const requestReset = useRequestPasswordReset()

    const handleSubmit = (event: { preventDefault: () => void }) => {
        event.preventDefault()
        setMessage(null)
        setError(null)

        const trimmedEmail = email.trim()
        if (!trimmedEmail) {
            setError('Email jest wymagany')
            return
        }

        requestReset.mutate(
            { email: trimmedEmail },
            {
                onSuccess: (data) => {
                    setMessage(data.message)
                },
                onError: () => {
                    setError('Nie udalo sie wyslac emaila')
                }
            }
        )
    }

    return (
        <main className={styles.Main}>
            <form onSubmit={handleSubmit} className={styles.FormContainer}>
                <h1>Reset hasla</h1>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <button type="submit" disabled={requestReset.isPending}>
                    {requestReset.isPending ? 'Wysylanie...' : 'Wyslij link'}
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
