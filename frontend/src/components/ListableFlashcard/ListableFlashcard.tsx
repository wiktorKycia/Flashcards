import styles from './ListableFlashcard.module.scss'
import Container from '@/components/Container'

interface ListableFlashcardProps {
    front: string
    back: string
}

export default function ListableFlashcard(props: ListableFlashcardProps) {
    return (
        <Container cssClassName={styles.ListableFlashcard}>
            <div>{props.front}</div>
            <div>{props.back}</div>
        </Container>
    )
}
