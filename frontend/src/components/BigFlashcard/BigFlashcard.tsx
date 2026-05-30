import styles from './BigFlashcard.module.scss'

interface BigFlashcardProps {
    front: string
    back: string
    isFront: boolean
    handleOnClick: () => void
}

export default function BigFlashcard(props: BigFlashcardProps) {
    return (
        <div className={styles.BigFlashcardContainer}>
            <div
                className={`${styles.BigFlashcard} ${!props.isFront ? styles.flipped : ''}`}
                onClick={props.handleOnClick}
            >
                <div className={styles.BigFlashcardFront}>{props.front}</div>
                <div className={styles.BigFlashcardBack}>{props.back}</div>
            </div>
        </div>
    )
}
