import styles from './MatchCard.module.scss'

interface MatchCardProps {
    content: string
    status: 'idle' | 'selected' | 'correct' | 'wrong' | 'hidden'
    onClick: () => void
}

export default function MatchCard({ content, status, onClick }: MatchCardProps) {
    return (
        <div
            className={`${styles.MatchCard} ${styles[status]}`}
            onClick={() => {
                if (status === 'idle') onClick()
            }}
        >
            <p className={styles.MatchCardContent}>{content}</p>
        </div>
    )
}
