import styles from './UserSettings.module.scss'
import { useAuth } from '@/context/AuthContext.tsx'
import { useNavigate } from 'react-router-dom'

export default function UserSettings()
{
    const navigate = useNavigate()
    const auth = useAuth()

    const isLoggedIn = !!auth.token
    if(isLoggedIn)
    {
        navigate('/login')
    }

    return (
        <div className={styles.UserSettings}>

            <h1>Hello {auth.user?.name}</h1>

            <button onClick={auth.logout}>Logout</button>
            <button>Reset password</button>
            <button>Edit username</button>
        </div>
    )
}