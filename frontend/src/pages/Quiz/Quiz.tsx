import Person from '@/components/Person'
import Container from '@/components/Container'
import AttachedFlashcardsMode from '@/components/AttachedFlashcardsMode'
import ButtonTop from '@/components/ButtonTop'
import styles from './Quiz.module.scss'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import ListedFlashcards from '@/components/ListedFlashcards'
import { useAuth } from '@/context/AuthContext.tsx'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useQuizData } from '@/hooks/useQuizData.ts'
import { useCheckIfLoggedIn } from '@/hooks/useCheckIfLoggedIn.ts'
import { useDeleteQuiz } from '@/hooks/useDeleteQuiz.ts'
import QuizLikeButtons from '@/components/QuizLikeButtons'
import ButtonToggle from '@/components/ButtonToggle'
import { useSavedQuizToggle } from '@/hooks/useSavedQuizToggle'
import { useCopyQuiz } from '@/hooks/useCopyQuiz.ts'

export default function Quiz() {
    const id: number = parseInt(useParams().id as string)
    const navigate = useNavigate()
    const auth = useAuth()
    const { data, isLoading, isError, error } = useQuizData(id, auth.user?.id)
    console.log(data, isLoading, isError, error)

    let isUserAuthor = true

    const isLoggedIn = useCheckIfLoggedIn()
    const { isDeleting, deleteError, handleDeleteQuiz } = useDeleteQuiz()
    const { isSaved, toggle: toggleSaved } = useSavedQuizToggle(auth.user?.id, id)
    const { mutateAsync: copyQuiz, isPending: isCopying } = useCopyQuiz()

    if (isLoggedIn && auth.user != null && data != undefined) {
        isUserAuthor = auth.user.id == data.quiz.authorId
    }

    async function handleDeleteQuizClick() {
        await handleDeleteQuiz({
            id,
            onSuccess: () => navigate('/')
        })
    }

    function handleExportClick() {
        if (!data) return

        const escapeCsv = (value: string | null | undefined) => {
            if (value == null) return ''
            const escaped = value.replace(/"/g, '""')
            if (/[",\n]/.test(escaped)) {
                return `"${escaped}"`
            }
            return escaped
        }

        const header = `${escapeCsv(data.quiz.frontLanguage)},${escapeCsv(data.quiz.backLanguage)}`
        const rows = data.flashcards.map((flashcard) => {
            const front = escapeCsv(flashcard.front)
            const back = escapeCsv(flashcard.back)
            return `${front},${back}`
        })

        const csvContent = [header, ...rows].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)

        const safeName = (data.quiz.name && data.quiz.name.replace(/[^a-z0-9_-]+/gi, '_')) || 'quiz'
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${safeName}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    async function handleCopyQuizClick() {
        if (!data || !auth.user) return

        try {
            const newQuizId = await copyQuiz({
                name: data.quiz.name,
                description: data.quiz.description,
                frontLanguage: data.quiz.frontLanguage,
                backLanguage: data.quiz.backLanguage,
                authorId: auth.user.id,
                flashcards: data.flashcards.map((f) => ({ front: f.front, back: f.back }))
            })

            navigate(`/quiz/${newQuizId}/edit`)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <main className={styles.Main}>
                {isError && <div>wystąpił błąd</div>}
                {isLoading && <LoadingSpinner />}
                {!isLoading && !isError && data && (
                    <div className={styles.MainWrapper}>
                        <Container cssClassName={'container-borderless ' + styles.MainTitleContainer}>
                            <h1>{data.quiz.name || 'Quiz bez nazwy'}</h1>
                            {data.quiz.description && <p>{data.quiz.description}</p>}
                        </Container>
                        <Container cssClassName={'container-positioner ' + styles.MainOptionsContaier}>
                            <Container cssClassName={'container-borderless ' + styles.MainOptions}>
                                <button onClick={handleExportClick} aria-label="Eksportuj do pliku CSV">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 3V15"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M6 9L12 15L18 9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M5 19H19"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                {isLoggedIn && (
                                    <>
                                        <ButtonToggle
                                            isOn={isSaved}
                                            setIsOn={toggleSaved}
                                            content={
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <svg
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        fill={isSaved ? 'currentColor' : 'none'}
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                                    </svg>
                                                </span>
                                            }
                                        />
                                        <button onClick={handleCopyQuizClick} disabled={isCopying}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                </svg>
                                            </span>
                                        </button>
                                    </>
                                )}
                                {isUserAuthor && (
                                    <>
                                        <button onClick={() => navigate(`/quiz/${id}/edit`)}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </span>
                                        </button>
                                        <button onClick={handleDeleteQuizClick} disabled={isDeleting}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {isDeleting ? (
                                                    <svg
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <polyline points="12 6 12 12 16 14"></polyline>
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                )}
                                            </span>
                                        </button>
                                    </>
                                )}
                            </Container>
                            {deleteError && <div className={styles.StatusText}>{deleteError}</div>}
                            <Container cssClassName={'container-borderless ' + styles.MainLearnOptions}>
                                <button onClick={() => navigate(`/quiz/${id}/test`)}>ucz się</button>
                                <button onClick={() => navigate(`/quiz/${id}/match-challenge`)}>dopasowania</button>
                            </Container>
                        </Container>
                        <Container cssClassName={'container-borderless'}>
                            <AttachedFlashcardsMode
                                quizId={id}
                                flashcards={data.flashcards.map((flashcard) => {
                                    return {
                                        database_id: flashcard.id,
                                        front: flashcard.front,
                                        back: flashcard.back,
                                        isKnown: flashcard.isKnown
                                    }
                                })}
                            />
                        </Container>
                        <Container cssClassName={'container-borderless ' + styles.MainAuthor}>
                            <Person id={data.quizAuthor.id} name={data.quizAuthor.name} title={'Autor'} />
                            <Container cssClassName={'container-positioner ' + styles.MainAuthorLikeContainer}>
                                <QuizLikeButtons quizId={id} />
                            </Container>
                        </Container>
                        <ListedFlashcards
                            flashcards={data.flashcards.map((flashcard) => {
                                return {
                                    database_id: flashcard.id,
                                    langFront: data.quiz.frontLanguage,
                                    langBack: data.quiz.backLanguage,
                                    front: flashcard.front,
                                    back: flashcard.back
                                }
                            })}
                        />
                    </div>
                )}
            </main>
            <ButtonTop />
        </>
    )
}
