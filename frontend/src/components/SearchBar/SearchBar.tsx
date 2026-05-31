import styles from './SearchBar.module.scss'
import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router'

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    const handleSearchSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (searchQuery.trim() !== '') {
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            navigate('/')
        }
    }

    return (
        <form className={styles.SearchBar} onSubmit={handleSearchSubmit}>
            <input
                id="search-bar"
                type="search"
                placeholder="Wyszukaj zestaw fiszek..."
                className={styles.SearchBarInput}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
            />
        </form>
    )
}
