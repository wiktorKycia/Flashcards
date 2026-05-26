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
                                <button>eksport do pliku</button>

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
