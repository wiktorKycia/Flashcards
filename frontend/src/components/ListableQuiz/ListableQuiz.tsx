import { Link } from 'react-router'

interface ListableQuizProps {
    id: number
    name: string
    description: string
}

export default function ListableQuiz(props: ListableQuizProps) {
    return (
        <Link to={`/quiz/${props.id}`} key={props.id} className={'quiz-item'}>
            <h2>{props.name}</h2>
            {props.description && (
                <p>{props.description.length > 50 ? props.description.substring(0, 50) + "..." : props.description}</p>
            )}
        </Link>
    )
}

