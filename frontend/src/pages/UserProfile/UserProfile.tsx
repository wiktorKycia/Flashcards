// import styles from './UserProfile.module.scss'
import { useParams } from 'react-router'
import { useUserInfo } from '@/hooks/useUserInfo.ts'
import Container from '@/components/Container'

export default function UserProfile() {
    const userId: number = parseInt(useParams().id as string)

    const { data } = useUserInfo(userId)

    return (
        // <div className={styles.UserProfile}>information about the user {userId}</div>
        <>
            {data && (
                <h1>{data.name}</h1>

            )}
            {data && data.createdQuizzes.map((quiz) => (
                <Container>
                    <h2>{quiz.name}</h2>
                    <p>{quiz.description}</p>
                    <p>{quiz.id}</p>
                </Container>
            ))}
        </>
    )
}