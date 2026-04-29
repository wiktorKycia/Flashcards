import styles from './MatchCard.module.scss'

export default function MatchCard({content, status, onClick}: { content: string, status: "idle" | "selected" | "correct" | "wrong" | "hidden", onClick: () => void}) {
    return (
        <div
            className={`${styles.MatchCard} ${styles[status]}`}
            onClick={() => {
                if (status === "idle") onClick()
            }}
        >
            <p className={styles.MatchCardContent}>
                {content}
            </p>
        </div>
    )
}