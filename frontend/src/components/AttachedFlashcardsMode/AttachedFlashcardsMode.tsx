import BigFlashcard from '../BigFlashcard'
import { useState } from 'react'
import type Flashcard from '../../types/Flashcard.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import styles from './AttachedFlashcardsMode.module.scss'
import Container from '@/components/Container'
import ButtonToggle from "@/components/ButtonToggle";

interface AttachedFlashcardsModeProps {
    quizId: number
    flashcards: Flashcard[]
}

export default function AttachedFlashcardsMode(
    props: AttachedFlashcardsModeProps
) {
    const [flashcardsIterator, setFlashcardsIterator] = useState<number>(0)
    const [flashcards, setFlashcards] = useState<Flashcard[]>(props.flashcards)
    const [unknownFlashcards, setUnknownFlashcards] = useState<Flashcard[]>(props.flashcards.filter(flashcard => !flashcard.isKnown))

    const [isTrackingProgress, setIsCheckingProgress] = useState<boolean>(false)
    const [finishedTrackingProgress, setFinishedTrackingProgress] = useState<boolean>(unknownFlashcards.length === 0)

    const [nextTurn, setNextTurn] = useState<Flashcard[]>([])
    const [requiresNextTurn, setRequiresNextTurn] = useState<boolean>(false)

    const [isFront, setIsFront] = useState<boolean>()

    const [isShuffled, setIsShuffled] = useState<boolean>(false)

    function handleShuffle() {
        setIsShuffled((prevState) => !prevState)
        if(!isShuffled)
        {
            const array = [...flashcards]
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                ;[array[i], array[j]] = [array[j], array[i]]
            }
            setFlashcards(array)
            setFlashcardsIterator(0)
        }
        else
        {
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

    const auth = useAuth()

    const isLoggedIn = !!auth.token

    function handleKnow(flashcardsIterator: number) {
        setUnknownFlashcards((prev) => prev.map((flashcard, index) => index === flashcardsIterator ? {...flashcard, isKnown: true} : flashcard))
        setFlashcardsIterator((prevState) => prevState + 1)
        if(flashcardsIterator + 1 == unknownFlashcards.length)
        {
            setRequiresNextTurn(true)
        }
    }

    function handleDontKnow(flashcardsIterator: number) {
        setNextTurn((prev) => [
            ...prev,
            unknownFlashcards[flashcardsIterator]
        ])
        setFlashcardsIterator((prevState) => prevState + 1)
        if(flashcardsIterator + 1 == unknownFlashcards.length)
        {
            setRequiresNextTurn(true)
        }
    }

    function handleNextTurn()
    {
        // database update

        setUnknownFlashcards(nextTurn)
        setNextTurn([])
        setRequiresNextTurn(false)
        setFlashcardsIterator(0)
        console.log(unknownFlashcards)
        if (unknownFlashcards.length === 0)
        {
            setFinishedTrackingProgress(true)
        }
    }

    if (flashcards.length === 0) {
        return (
            <Container cssClassName="container-positioner">
                <div className={styles.OptionsArrowsContainerIterator}>
                    Ten quiz jeszcze nie ma fiszek
                </div>
            </Container>
        )
    }

    return (
        <>
            {!finishedTrackingProgress && isTrackingProgress ? (
                <>
                    {requiresNextTurn ? (
                            <button onClick={handleNextTurn}>Następna tura</button>
                    ):(
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
                </>
            ):(
                <>
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
                </>
            )}

            <Container cssClassName={'container-positioner ' + styles.OptionsContainer}>
                {isLoggedIn && !finishedTrackingProgress && (
                    <div className={styles.TrackProgress}>
                        <label htmlFor="track_progress">Śledź postępy</label>
                        {/*tylko dla użytkowników zalogowanych*/}
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
                <div>
                    {!finishedTrackingProgress && isTrackingProgress && (
                        <button className={styles.ButtonPrev}>poprzedni</button> //*tylko jak checkbox ze śledzeniem postępów jest zaznaczony*/}
                    )}
                    <ButtonToggle isOn={isShuffled} setIsOn={handleShuffle} content={'Losowa kolejność'}/>
                </div>
            </Container>
        </>
    )
}
