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
        <div>
            <div>
                <h3>{quizName}</h3>
                <p>{quizDescription.slice(0, 50)}</p>
            </div>
            <button onClick={() => navigate(`/quiz/${quizId}`)}>Otwórz zestaw</button>
            <p>{likes}+</p>
            <p>{dislikes}-</p>
        </div>
    )
}