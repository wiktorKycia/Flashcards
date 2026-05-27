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

export default function Quiz() {
    const id: number = parseInt(useParams().id as string)
    const navigate = useNavigate()
    const auth = useAuth()
    const { data, isLoading, isError, error } = useQuizData(id, auth.user?.id)
    console.log(data, isLoading, isError, error)

    let isUserAuthor = true

    const isLoggedIn = useCheckIfLoggedIn()
    const { isDeleting, deleteError, handleDeleteQuiz } = useDeleteQuiz()

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

        const safeName =
            (data.quiz.name && data.quiz.name.replace(/[^a-z0-9_-]+/gi, '_')) || 'quiz'
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${safeName}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return (
        <>
            <main className={styles.Main}>
                {isError && <div>wystąpił błąd</div>}
                {isLoading && <LoadingSpinner />}
                {!isLoading && !isError && data && (
                    <div className={styles.MainWrapper}>
                        <Container
                            cssClassName={'container-borderless ' + styles.MainTitleContainer}
                        >
                            <h1>{data.quiz.name || 'Quiz bez nazwy'}</h1>
                            {data.quiz.description && (
                                <p>{data.quiz.description}</p>
                            )}
                        </Container>
                        <Container cssClassName={'container-positioner ' + styles.MainOptionsContaier}>
                            <Container
                                cssClassName={'container-borderless ' + styles.MainOptions}
                            >
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
                                        <button>zapisz</button>
                                        <button>kopiuj</button>
                                    </>
                                )}
                                {isUserAuthor && (
                                    <>
                                        <button onClick={() => navigate(`/quiz/${id}/edit`)}>edytuj</button>
                                        <button onClick={handleDeleteQuizClick} disabled={isDeleting}>
                                            {isDeleting ? 'Usuwanie...' : 'usuń'}
                                        </button>
                                    </>
                                )}
                            </Container>
                            {deleteError && (
                                <div className={styles.StatusText}>{deleteError}</div>
                            )}
                            <Container
                                cssClassName={'container-borderless ' + styles.MainLearnOptions}
                            >
                                <button>ucz się</button>
                                <button>dopasowania</button>
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
                        <Container
                            cssClassName={'container-borderless ' + styles.MainAuthor}
                        >
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
