import LoadingSpinner from '@/components/LoadingSpinner'
import { useQuizzes } from '@/hooks/useQuizzes'
import type FullQuiz from '@/types/FullQuiz'
import { useLocation } from 'react-router'
import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import styles from './Home.module.scss'
import LikedQuizzesList from '@/components/LikedQuizzesList/LikedQuizzesList.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import { useCheckIfLoggedIn } from '@/hooks/useCheckIfLoggedIn.ts'
import ListableQuiz from '@/components/ListableQuiz'

export default function Home() {
    const { data: quizzes = [], isLoading, isError } = useQuizzes()
    const [isExpanded, setIsExpanded] = useState(false)
    const { search: urlQuesryString } = useLocation()
    const isLoggedIn = useCheckIfLoggedIn()
    const { user } = useAuth()

    let userId = undefined
    if (isLoggedIn && user) {
        userId = user.id
    }

    const sortedItems = useMemo(() => {
        const params = new URLSearchParams(urlQuesryString)
        const searchQuery = params.get('search')?.trim() || ''

        if(!searchQuery) return quizzes

        const fuseOptions = {
            keys: ['name'],
            threshold: 0.5,
        }

        const fuse = new Fuse(quizzes, fuseOptions)
        const searchResults = fuse.search(searchQuery)

        return searchResults.map(result => result.item)
    }, [quizzes, urlQuesryString])

    const displayedItems = isExpanded ? sortedItems : sortedItems.slice(0, 10)

    return (
        <div className={styles.mainWrapper}>
            {isError && <div className={styles.errorMessage}>Wystąpił błąd</div>}
            {isLoading && <LoadingSpinner />}
            {!isLoading && !isError && quizzes && (
                sortedItems.length > 0 ? (
                    <div className={styles.quizzesListWrapper}>
                        <h2 className={styles.quizzesBoxTitle}>Znalezione zestawy fiszek</h2>
                        <div className={styles.quizPreviewsBox}>
                            {displayedItems.map((quiz: FullQuiz) => (
                                <ListableQuiz id={quiz.id} name={quiz.name} description={quiz.description}/>
                            ))}
                        </div>

                        {sortedItems.length > 10 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={styles.expandButton}
                            >
                                {isExpanded ? "Zwiń" : "Rozwiń"}
                            </button>
                        )}
                    </div>
                ) : (
                    quizzes.length > 0 ? (
                        <p className={styles.infoMessage}>Nie ma zestawów pasujących do wyszukiwania</p>
                    ) : (
                        <p className={styles.infoMessage}>Nie znaleziono żadnych zestawów w aplikacji</p>
                    )
                )
            )}
            {isLoggedIn && userId && (
                <aside>
                    <LikedQuizzesList userId={userId} isSmallVersion={false}/>
                </aside>
            )}
        </div>
    )
}
