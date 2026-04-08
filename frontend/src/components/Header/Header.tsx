import HamburgerButton from "../HamburgerButton/HamburgerButton.tsx";
import Logo from '../Logo/Logo.tsx'
import SearchBar from '../SearchBar/SearchBar.tsx'
import ButtonAdd from '../ButtonAdd/ButtonAdd.tsx'
import ProfilePicture from "../ProfilePicture/ProfilePicture.tsx";


export default function Header() {


    return (
        <header>
            <HamburgerButton/>
            <Logo/>
            <SearchBar/>
            <ButtonAdd/>
            <ProfilePicture/>
        </header>
    )
}