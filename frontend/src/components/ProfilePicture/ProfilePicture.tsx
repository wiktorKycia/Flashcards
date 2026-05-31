import profileLogo from '@/assets/placeholder-profile-picture-1.png'
import styles from './ProfilePicture.module.scss'
import { useUserProfilePicture } from '@/hooks/useUserProfilePicture'

export default function ProfilePicture({ userId }: { userId?: number | null }) {
    const { data: avatarUrl } = useUserProfilePicture(userId)

    return <img className={styles.ProfilePicture} src={avatarUrl || profileLogo} alt="profile picture" />
}
