import Logo from '../Logo/Logo.tsx'
import SearchBar from '../SearchBar/SearchBar.tsx'
import ButtonAdd from '../ButtonAdd/ButtonAdd.tsx'
import ProfilePicture from '../ProfilePicture/ProfilePicture.tsx'
import useTheme from '@/hooks/useTheme.ts'
import styles from './Header.module.scss'
import ThemeToggler from '@/components/ThemeToggler'
import { useCheckIfLoggedIn } from '@/hooks/useCheckIfLoggedIn.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import { Link } from 'react-router'
import { useEffect, useRef, useState } from 'react'

export default function Header() {
    const { theme, toggleTheme } = useTheme()

    const isLoggedIn = useCheckIfLoggedIn()
    const { user, logout } = useAuth()

    const [profileTooltipOpen, setProfileTooltipOpen] = useState(false)
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
        }
    }, [])

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

    function handleLogoutClick() {
        logout()
        setProfileTooltipOpen(false)
    }

    return (
        <header className={styles.Header}>
            <div className={styles.HeaderLeft}>
                <Logo />
            </div>
            <SearchBar />
            <div className={styles.HeaderRight}>
                <ThemeToggler toggleFn={toggleTheme} isLight={theme === 'light'} />
                {isLoggedIn && <ButtonAdd />}
                <div
                    className={styles.PictureContainer}
                    onMouseEnter={openProfileTooltip}
                    onMouseLeave={scheduleCloseProfileTooltip}
                >
                    <ProfilePicture />
                    {(isLoggedIn || !isLoggedIn) && (
                        <div
                            className={`tooltip ${profileTooltipOpen ? 'tooltip-open' : ''}`}
                            onMouseEnter={openProfileTooltip}
                            onMouseLeave={scheduleCloseProfileTooltip}
                        >
                            {isLoggedIn && user ? (
                                <>
                                    <div className={'tooltip-title'}>
                                        Zalogowany jako <span className={styles.Username}>{user.name}</span>
                                    </div>
                                    <div className={'tooltip-links-container'}>
                                        <Link className={'tooltip-link'} to={`/user/${user.id}`}>
                                            Profil
                                        </Link>
                                        <Link className={'tooltip-link'} to={'/user/'}>
                                            Ustawienia
                                        </Link>
                                        <button type="button" className={'tooltip-link'} onClick={handleLogoutClick}>
                                            Wyloguj
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className={'tooltip-links-container'}>
                                    <Link className={'tooltip-link'} to={'/login/'}>
                                        Zaloguj
                                    </Link>
                                    <Link className={'tooltip-link'} to={'/register/'}>
                                        Zarejestruj
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
