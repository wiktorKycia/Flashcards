import styles from './LoadingSpinner.module.scss'

export default function LoadingSpinner() {
    return (
        <div className={styles.Container}>
            <div className={styles.Spinner}></div>
        </div>
    )
}

