import LoadingSpinner from '@/components/LoadingSpinner'
import { useQuizzes } from '@/hooks/useQuizzes'
import QuizPreview from '@/components/QuizPreview'
import type FullQuiz from '@/types/FullQuiz'
import { useLocation } from 'react-router'
import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import styles from './Home.module.scss'

export default function Home() {
    const { data: quizzes = [], isLoading, isError } = useQuizzes()
    const [isExpanded, setIsExpanded] = useState(false)
    const { search: urlQuesryString } = useLocation()

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

    const displayedItems = isExpanded ? sortedItems : sortedItems.slice(0, 16)

    return (
        <>
            {isError && <div className={styles.errorMessage}>Wystąpił błąd</div>}
            {isLoading && <LoadingSpinner />}
            {!isLoading && !isError && quizzes && (
                sortedItems.length > 0 ? (
                    <div className={styles.quizzesListWrapper}>
                        <p className={styles.quizzesBoxTitle}>Znalezione zestawy fiszek</p>
                        <div className={styles.quizPreviewsBox}>
                            {displayedItems.map((quiz: FullQuiz) => (
                                <QuizPreview
                                    key={`quiz-preview-${quiz.id}`}
                                    quizId={quiz.id}
                                    quizName={quiz.name}
                                    quizDescription={quiz.description}
                                    likes={quiz.likes}
                                    dislikes={quiz.dislikes}
                                />
                            ))}
                        </div>

                        {sortedItems.length > 16 && (
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
                        <p className={styles.infoMessage}>Nie znaleziono odpowiednich quizów</p>
                    ) : (
                        <p className={styles.infoMessage}>Nie znaleziono żadnych quizów</p>
                    )
                )
            )}
        </>
    )
}
