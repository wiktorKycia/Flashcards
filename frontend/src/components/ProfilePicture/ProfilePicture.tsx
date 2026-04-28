import { Link } from 'react-router'
import profileLogo from '../../assets/placeholder-profile-picture-1.jpg'
import styles from './ProfilePicture.module.scss'

export default function ProfilePicture() {
    return (
        <Link to={'/user/'}>
            <img
                className={styles.ProfilePicture}
                src={profileLogo}
                alt="profile picture"
            />
        </Link>
    )
}

