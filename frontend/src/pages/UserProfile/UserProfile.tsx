import styles from './UserProfile.module.scss'
// import { useAuth } from '@/context/AuthContext.tsx'

export default function UserProfile() {
    // const isLoggedIn = !!useAuth().token

    return (
        <div className={styles.UserProfile}>information about the user</div>
    )
}