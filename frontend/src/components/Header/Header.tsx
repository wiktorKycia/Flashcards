import Logo from '../Logo/Logo.tsx'
import SearchBar from '../SearchBar/SearchBar.tsx'
import ButtonAdd from '../ButtonAdd/ButtonAdd.tsx'
import ProfilePicture from '../ProfilePicture/ProfilePicture.tsx'
import useTheme from '@/hooks/useTheme.ts'
import styles from './Header.module.scss'
import ThemeToggler from "@/components/ThemeToggler";
import { useCheckIfLoggedIn } from '@/hooks/useCheckIfLoggedIn.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import { Link } from 'react-router'
import { useEffect, useRef, useState } from 'react'

export default function Header() {
    const {theme, toggleTheme} = useTheme()

    const isLoggedIn = useCheckIfLoggedIn()
    const { user } = useAuth()

    const [profileTooltipOpen, setProfileTooltipOpen] = useState(false)
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
        }
    }, [])

    useEffect(() => {
        if (!isLoggedIn) setProfileTooltipOpen(false)
    }, [isLoggedIn])

    function openProfileTooltip() {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current)
            closeTimerRef.current = null
        }
        setProfileTooltipOpen(true)
    }

    function scheduleCloseProfileTooltip() {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
        closeTimerRef.current = setTimeout(() => setProfileTooltipOpen(false), 150)
    }

    return (
        <header className={styles.Header}>
            <div className={styles.HeaderLeft}>
                <Logo />
            </div>
            <SearchBar />
            <div className={styles.HeaderRight}>
                <ThemeToggler toggleFn={toggleTheme} isLight={theme === "light"}/>
                {isLoggedIn && (<ButtonAdd />)}
                <div
                    className={styles.PictureContainer}
                    onMouseEnter={openProfileTooltip}
                    onMouseLeave={scheduleCloseProfileTooltip}
                >
                    <ProfilePicture />
                    {isLoggedIn && user && (
                        <div
                            className={`${styles.ProfileTooltip} ${profileTooltipOpen ? styles.ProfileTooltipOpen : ''}`}
                            onMouseEnter={openProfileTooltip}
                            onMouseLeave={scheduleCloseProfileTooltip}
                        >
                            <div className={styles.ProfileTooltipTitle}>
                                Zalogowany jako <span className={styles.ProfileTooltipUsername}>{user.name}</span>
                            </div>
                            <div className={styles.ProfileTooltipLinks}>
                                <Link className={styles.ProfileTooltipLink} to={`/user/${user.id}`}>Profil</Link>
                                <Link className={styles.ProfileTooltipLink} to={'/user/'}>Ustawienia</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
