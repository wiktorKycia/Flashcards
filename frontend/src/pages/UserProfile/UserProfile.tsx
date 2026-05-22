import { useParams } from 'react-router'
import { useAuth } from '@/context/AuthContext.tsx'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useLoggedInOnly } from '@/hooks/useLoggedInOnly'
import { useUserName } from '@/hooks/useUserName'
import CreatedQuizzesList from '@/components/CreatedQuizzesList'
import SavedQuizzesList from '@/components/SavedQuizzesList'
import styles from './UserProfile.module.scss'

export default function UserProfile() {
    useLoggedInOnly()

    const userId: number = parseInt(useParams().id as string)
    const auth = useAuth()

    const isVisitingSelf = auth.user ? userId === auth.user.id : false

    const { data, isLoading, isError } = useUserName(userId)

    if (!auth.user) {
        return <LoadingSpinner />
    }

    return (
        <main className={styles.UserProfile}>
            {isError && <p style={{ color: 'var(--color-accent2)' }}>wystąpił błąd</p>}
            {isLoading && <LoadingSpinner />}

            {!isError && !isLoading && data && (
                <>
                    <h1>Profil użytkownika {data.name}</h1>
                    <CreatedQuizzesList userId={userId}/>

                    {isVisitingSelf && (
                        <SavedQuizzesList userId={userId} />
                    )}
                </>
            )}
        </main>
    )
}