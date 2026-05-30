import styles from './UserSettings.module.scss'
import { useAuth } from '@/context/AuthContext.tsx'
import Container from '@/components/Container'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useLoggedInOnly } from '@/hooks/useLoggedInOnly.ts'
import FieldGroup from '@/components/FieldGroup'
import { type ChangeEvent, type SubmitEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useUserInfo } from '@/hooks/useUserInfo.ts'
import { useUpdateUser } from '@/hooks/useUpdateUser.ts'
import { useChangePassword } from '@/hooks/useChangePassword'

interface UserDraft {
    name: string
    email: string
}

export default function UserSettings() {
    useLoggedInOnly()

    const navigate = useNavigate()

    const auth = useAuth()
    const user = auth.user

    const { data, isLoading, isError } = useUserInfo(user?.id)
    const updateUser = useUpdateUser()
    const changePassword = useChangePassword()

    const [draft, setDraft] = useState<UserDraft | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [saveMessage, setSaveMessage] = useState<string | null>(null)

    const [passwordDraft, setPasswordDraft] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    useEffect(() => {
        if (isLoading || isError) return
        if (!data) return

        if (auth.user?.id !== data.id) {
            navigate(-1) // go back by one page
            return
        }

        if (draft) return

        setDraft({
            name: data.name,
            email: data.email
        })
    }, [auth.user?.id, data, draft, isError, isLoading, navigate])

    function handleFieldChange(field: 'name' | 'email', value: string) {
        setDraft((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                [field]: value
            }
        })
    }

    async function handleButtonSave(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!draft || !user) return

        const name = draft.name.trim()
        const email = draft.email.trim()

        if (!name || !email) {
            setSaveError('Uzupełnij nazwę użytkownika i email')
            setSaveMessage(null)
            return
        }

        setIsSaving(true)
        setSaveError(null)
        setSaveMessage(null)

        try {
            const updatedUser = await updateUser.mutateAsync({
                id: user.id,
                name,
                email
            })

            setDraft({
                name: updatedUser.name,
                email: updatedUser.email
            })

            setSaveMessage('Zapisano zmiany')
        } catch {
            setSaveError('Nie udało się zapisać zmian')
        } finally {
            setIsSaving(false)
        }
    }

    async function handlePasswordSave(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!user) return

        const currentPassword = passwordDraft.currentPassword.trim()
        const newPassword = passwordDraft.newPassword.trim()
        const confirmPassword = passwordDraft.confirmPassword.trim()

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('Uzupełnij wszystkie pola')
            setPasswordMessage(null)
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Hasła nie są zgodne')
            setPasswordMessage(null)
            return
        }

        setIsChangingPassword(true)
        setPasswordError(null)
        setPasswordMessage(null)

        try {
            const result = await changePassword.mutateAsync({
                id: user.id,
                currentPassword,
                newPassword
            })

            setPasswordDraft({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            setPasswordMessage(result.message)
        } catch {
            setPasswordError('Nie udało się zmienić hasła')
        } finally {
            setIsChangingPassword(false)
        }
    }

    if (!user) {
        return <LoadingSpinner />
    }

    return (
        <main className={styles.UserSettings}>
            <h1>Ustawienia użytkownika</h1>
            <section className={styles.UserSettingsSection}>
                <Container>
                    <h2>Dane</h2>

                    <form onSubmit={handleButtonSave}>
                        <FieldGroup
                            labelText="Nazwa użytkownika"
                            inputHTMLId="input_username"
                            inputType="text"
                            inputValue={draft?.name ?? ''}
                            onInputChange={(event: ChangeEvent) => {
                                handleFieldChange('name', (event.target as HTMLInputElement).value)
                            }}
                            isVertical={false}
                        />

                        <FieldGroup
                            labelText="Email"
                            inputHTMLId="input_email"
                            inputType="text"
                            inputValue={draft?.email ?? ''}
                            onInputChange={(event: ChangeEvent) => {
                                handleFieldChange('email', (event.target as HTMLInputElement).value)
                            }}
                            isVertical={false}
                        />

                        <button type="submit" disabled={isSaving || !draft}>
                            {isSaving ? 'Zapisywanie...' : 'Zapisz'}
                        </button>

                        {saveError && <div className={'message-error'}>{saveError}</div>}
                        {saveMessage && <div className={'message-info'}>{saveMessage}</div>}
                    </form>
                </Container>

                <Container>
                    <h2>Hasło</h2>
                    <form onSubmit={handlePasswordSave}>
                        <FieldGroup
                            labelText="Aktualne hasło"
                            inputHTMLId="input_current_password"
                            inputType="password"
                            inputValue={passwordDraft.currentPassword}
                            onInputChange={(event: ChangeEvent) => {
                                setPasswordDraft((prev) => ({
                                    ...prev,
                                    currentPassword: (event.target as HTMLInputElement).value
                                }))
                            }}
                            isVertical={false}
                        />

                        <FieldGroup
                            labelText="Nowe hasło"
                            inputHTMLId="input_new_password"
                            inputType="password"
                            inputValue={passwordDraft.newPassword}
                            onInputChange={(event: ChangeEvent) => {
                                setPasswordDraft((prev) => ({
                                    ...prev,
                                    newPassword: (event.target as HTMLInputElement).value
                                }))
                            }}
                            isVertical={false}
                        />

                        <FieldGroup
                            labelText="Powtórz hasło"
                            inputHTMLId="input_confirm_password"
                            inputType="password"
                            inputValue={passwordDraft.confirmPassword}
                            onInputChange={(event: ChangeEvent) => {
                                setPasswordDraft((prev) => ({
                                    ...prev,
                                    confirmPassword: (event.target as HTMLInputElement).value
                                }))
                            }}
                            isVertical={false}
                        />

                        <button type="submit" disabled={isChangingPassword}>
                            {isChangingPassword ? 'Zapisywanie...' : 'Zmień hasło'}
                        </button>

                        {passwordError && <div className={'message-error'}>{passwordError}</div>}
                        {passwordMessage && <div className={'message-info'}>{passwordMessage}</div>}
                    </form>
                </Container>

                <Container>
                    <h2>Akcje</h2>
                    <button onClick={auth.logout}>Wyloguj</button>
                    {user.id && <button onClick={() => navigate(`/user/${user.id}`)}>Zobacz profil</button>}
                </Container>
            </section>
        </main>
    )
}
