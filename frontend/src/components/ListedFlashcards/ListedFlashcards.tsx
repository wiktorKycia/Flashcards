import styles from './ListedFlashcards.module.scss'
import Container from '@/components/Container'
import ListableFlashcard from '@/components/ListableFlashcard'
import type FlashcardFromDatabase from '@/types/FlashcardFromDatabase.ts'

interface ListedFlashcardsProps {
    flashcards: FlashcardFromDatabase[]
}

export default function ListedFlashcards(props: ListedFlashcardsProps) {
    return (
        <div className={styles.ListedFlashcards}>
            <h2 className={styles.ListedFlashcardsHeading}>Fiszki</h2>
            <Container cssClassName={'container-vertical-borderless ' + styles.ListedFlashcardsFlashcardsContainer}>
                {props.flashcards.map((flashcard) =>(
                    <ListableFlashcard
                        key={flashcard.database_id}
                        front={flashcard.front}
                        back={flashcard.back}
                    />
                ))}
            </Container>
        </div>
    )
}
