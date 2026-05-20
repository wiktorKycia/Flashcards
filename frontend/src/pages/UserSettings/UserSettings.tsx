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

    const [draft, setDraft] = useState<UserDraft | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [saveMessage, setSaveMessage] = useState<string | null>(null)

    useEffect(() => {
        if (isLoading || isError) return
        if (!data) return

        if (auth.user?.id !== data.id)
        {
            navigate(-1) // go back by one page
            return
        }

        if (draft) return

        setDraft({
            name: data.name,
            email: data.email
        })
    }, [auth.user?.id, data, draft, isError, isLoading, navigate])
    
    function handleFieldChange(field: 'name' | 'email', value: string)
    {
        setDraft((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                [field]: value
            }
        })
    }
    
    async function handleButtonSave(event: SubmitEvent<HTMLFormElement>)
    {
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
        }
        catch {
            setSaveError('Nie udało się zapisać zmian')
        }
        finally {
            setIsSaving(false)
        }
    }

    if (!user)
    {
        return <LoadingSpinner/>
    }

    return (
        <main className={styles.UserSettings}>
            <h1>Ustawienia użytkownika</h1>
            <section className={styles.UserSettingsSection}>
                <Container>
                    <h2>Dane</h2>

                    <form
                        onSubmit={handleButtonSave}
                    >
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
                    <h2>Akcje</h2>
                    <button onClick={auth.logout}>Wyloguj</button>
                    <button>Resetuj hasło</button>
                    {user.id && (
                        <button onClick={() => navigate(`/user/${user.id}`)}>Zobacz profil</button>
                    )}
                </Container>
            </section>
        </main>
    )
}
