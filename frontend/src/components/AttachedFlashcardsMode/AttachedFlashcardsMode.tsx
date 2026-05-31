import BigFlashcard from '../BigFlashcard'
import { useState, useEffect } from 'react'
import type Flashcard from '../../types/Flashcard.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import styles from './AttachedFlashcardsMode.module.scss'
import Container from '@/components/Container'
import ButtonToggle from '@/components/ButtonToggle'
import { useUpdateFlashcardKnowledge } from '@/hooks/useUpdateFlashcardKnowledge.ts'
import { useResetQuizProgress } from '@/hooks/useResetQuizProgress.ts'

interface AttachedFlashcardsModeProps {
    quizId: number
    flashcards: Flashcard[]
}

export default function AttachedFlashcardsMode(props: AttachedFlashcardsModeProps) {
    const [flashcardsIterator, setFlashcardsIterator] = useState<number>(0)
    const [flashcards, setFlashcards] = useState<Flashcard[]>(props.flashcards)
    const [unknownFlashcards, setUnknownFlashcards] = useState<Flashcard[]>(
        props.flashcards.filter((flashcard) => !flashcard.isKnown)
    )

    const [isTrackingProgress, setIsCheckingProgress] = useState<boolean>(false)
    const [finishedTrackingProgress, setFinishedTrackingProgress] = useState<boolean>(unknownFlashcards.length === 0)

    const [nextTurn, setNextTurn] = useState<Flashcard[]>([])
    const [requiresNextTurn, setRequiresNextTurn] = useState<boolean>(false)

    const [isFront, setIsFront] = useState<boolean>()

    const [isShuffled, setIsShuffled] = useState<boolean>(false)

    const updateFlashcardsKnowledge = useUpdateFlashcardKnowledge()
    const resetQuizProgress = useResetQuizProgress()

    const auth = useAuth()

    const isLoggedIn = !!auth.token

    useEffect(() => {
        // Zaktualizuj stan jedynie, jeśli użytkownik wpada na nowe dane wchodząc na stronę
        // lub z tła, ale chroniąc przed przerwaniem jego aktualnej, aktywnej sesji.
        if (!isTrackingProgress) {
            const newUnknowns = props.flashcards.filter((flashcard) => !flashcard.isKnown)

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFlashcards(props.flashcards)
            setUnknownFlashcards(newUnknowns)
            setFinishedTrackingProgress(newUnknowns.length === 0)
        }
    }, [props.flashcards, isTrackingProgress])

    function handleShuffle() {
        setIsShuffled((prevState) => !prevState)
        if (!isShuffled) {
            const array = [...flashcards]
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                ;[array[i], array[j]] = [array[j], array[i]]
            }
            setFlashcards(array)
            setFlashcardsIterator(0)
        } else {
            setFlashcards(props.flashcards)
            setFlashcardsIterator(0)
        }
    }

    function handleIncrement() {
        if (flashcardsIterator < flashcards.length - 1) {
            setFlashcardsIterator((prevState) => prevState + 1)
            setIsFront(true)
        }
    }
    function handleDecrement() {
        if (flashcardsIterator > 0) {
            setFlashcardsIterator((prevState) => prevState - 1)
            setIsFront(true)
        }
    }

    function handleFlashcardOnClick() {
        setIsFront((prevState) => !prevState)
    }

    function handleKnow(flashcardsIterator: number) {
        setUnknownFlashcards((prev) =>
            prev.map((flashcard, index) => (index === flashcardsIterator ? { ...flashcard, isKnown: true } : flashcard))
        )
        setFlashcardsIterator((prevState) => prevState + 1)
        if (flashcardsIterator + 1 == unknownFlashcards.length) {
            setRequiresNextTurn(true)
        }
    }

    function handleDontKnow(flashcardsIterator: number) {
        setNextTurn((prev) => [...prev, unknownFlashcards[flashcardsIterator]])
        setFlashcardsIterator((prevState) => prevState + 1)
        if (flashcardsIterator + 1 == unknownFlashcards.length) {
            setRequiresNextTurn(true)
        }
    }

    function handleNextTurn() {
        setRequiresNextTurn(false)
        setFlashcardsIterator(0)

        unknownFlashcards.forEach((flashcard) => {
            if (flashcard.isKnown && auth.user) {
                updateFlashcardsKnowledge.mutate({
                    quizId: props.quizId,
                    userId: auth.user.id,
                    flashcardId: flashcard.database_id,
                    isKnown: true
                })
            }
        })

        setUnknownFlashcards(nextTurn)
        if (nextTurn.length === 0) {
            setFinishedTrackingProgress(true)
        }
        setNextTurn([])
    }

    async function handleResetProgress() {
        if (!auth.user) return
        const confirmed = window.confirm('czy na pewno chcesz zresetować swoją pamięć?')
        if (!confirmed) return

        await resetQuizProgress.mutateAsync({
            quizId: props.quizId,
            userId: auth.user.id
        })

        const resetFlashcards = flashcards.map((flashcard) => ({
            ...flashcard,
            isKnown: false
        }))

        setFlashcards(resetFlashcards)
        setUnknownFlashcards(resetFlashcards)
        setFlashcardsIterator(0)
        setRequiresNextTurn(false)
        setNextTurn([])
        setFinishedTrackingProgress(false)
        setIsCheckingProgress(false)
    }

    if (flashcards.length === 0) {
        return (
            <Container cssClassName="container-positioner">
                <div className={styles.OptionsArrowsContainerIterator}>Ten quiz jeszcze nie ma fiszek</div>
            </Container>
        )
    }

    return (
        <>
            {!finishedTrackingProgress && isTrackingProgress ? (
                <div className={styles.FlashcardPositioner}>
                    {requiresNextTurn ? (
                        <button onClick={handleNextTurn} className={styles.NextTurnButton}>Następna tura</button>
                    ) : (
                        <>
                            <BigFlashcard
                                front={unknownFlashcards[flashcardsIterator].front}
                                back={unknownFlashcards[flashcardsIterator].back}
                                isFront={isFront ?? true}
                                handleOnClick={handleFlashcardOnClick}
                            />
                            <Container cssClassName={'container-positioner ' + styles.ArrowsContainer}>
                                <button onClick={() => handleDontKnow(flashcardsIterator)}>nie znam</button>
                                <div className={styles.ArrowsContainerIterator}>
                                    {flashcardsIterator + 1} / {unknownFlashcards.length}
                                </div>
                                <button onClick={() => handleKnow(flashcardsIterator)}>znam</button>
                            </Container>
                        </>
                    )}
                </div>
            ) : (
                <div className={styles.FlashcardPositioner}>
                    <BigFlashcard
                        front={flashcards[flashcardsIterator].front}
                        back={flashcards[flashcardsIterator].back}
                        isFront={isFront ?? true}
                        handleOnClick={handleFlashcardOnClick}
                    />

                    <Container cssClassName={'container-positioner ' + styles.ArrowsContainer}>
                        <button onClick={handleDecrement}>←</button>
                        <div className={styles.ArrowsContainerIterator}>
                            {flashcardsIterator + 1} / {flashcards.length}
                        </div>
                        <button onClick={handleIncrement}>→</button>
                    </Container>
                </div>
            )}

            <Container cssClassName={'container-positioner ' + styles.OptionsContainer}>
                {isLoggedIn && !finishedTrackingProgress && (
                    <div className={styles.TrackProgress}>
                        <label htmlFor="track_progress">Śledź postępy</label>
                        <input
                            type="checkbox"
                            name="track_progress"
                            id="track_progress"
                            defaultChecked={isTrackingProgress}
                            onClick={() => {
                                setIsCheckingProgress((prevState) => !prevState)
                                setFlashcardsIterator(0)
                            }}
                        />
                    </div>
                )}
                {isLoggedIn && finishedTrackingProgress && (
                    <div className={styles.TrackProgress}>
                        <button onClick={handleResetProgress} disabled={resetQuizProgress.isPending}>
                            {resetQuizProgress.isPending ? 'Resetowanie...' : 'Zresetuj progres'}
                        </button>
                    </div>
                )}
                <div className={styles.Options}>
                    <ButtonToggle isOn={isShuffled} setIsOn={handleShuffle} content={'Losowa kolejność'} />
                </div>
            </Container>
        </>
    )
}
