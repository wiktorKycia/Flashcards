import styles from './QuizPreview.module.scss'
import { useNavigate } from 'react-router'

type Props = {
    quizId: number
    quizName: string
    quizDescription: string
    likes: number
    dislikes: number
}

export default function QuizPreview({quizId, quizName, quizDescription, likes, dislikes}: Props) {
    const navigate = useNavigate()

    return (
        <div className={styles.previewWrapper}>
            <h3>{quizName}</h3>
            <p className={styles.description}>
                {quizDescription && quizDescription.slice(0, 50).trim()}
                {quizDescription && quizDescription.length > 50 && '...'}
            </p>
            <button onClick={() => navigate(`/quiz/${quizId}`)}>Otwórz zestaw</button>
            <div className={styles.votesWrapper}>
                <p className={styles.likes}>{likes}+</p>
                <p className={styles.dislikes}>{dislikes}-</p>
            </div>
        </div>
    )
}