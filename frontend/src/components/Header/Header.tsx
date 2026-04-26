import HamburgerButton from '../HamburgerButton/HamburgerButton.tsx'
import Logo from '../Logo/Logo.tsx'
import SearchBar from '../SearchBar/SearchBar.tsx'
import ButtonAdd from '../ButtonAdd/ButtonAdd.tsx'
import ProfilePicture from '../ProfilePicture/ProfilePicture.tsx'
import useTheme from '@/hooks/useTheme.ts'
import styles from './Header.module.scss'

export default function Header() {
    const {theme, toggleTheme} = useTheme()

    return (
        <header className={styles.Header}>
            <div>
                <HamburgerButton />
                <Logo />
            </div>
            <SearchBar />
            <div>
                <button onClick={toggleTheme}>
                    {theme === "light" ? "Dark" : "Light"}
                </button>
                <ButtonAdd />
                <ProfilePicture />
            </div>
        </header>
    )
}
