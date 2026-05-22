import { useQuery } from '@tanstack/react-query'

const getData = async (quizId: number): Promise<QuizData> => {
    const quizResponse = await fetch(`/api/quizzes/${quizId}`)

    if (!quizResponse.ok) {
        throw new Error(`HTTP ${quizResponse.status}`)
    } else {
        const quiz: Quiz = await quizResponse.json()
        const flashcardsResponse = await fetch(
            `/api/quizzes/${quizId}/flashcards`
        )
        const flashcards: Flashcard[] = await flashcardsResponse.json()

        const quizAuthorResponse = await fetch(
            `/api/users/${quiz.authorId}`
        )
        const quizAuthor: QuizAuthor = await quizAuthorResponse.json()

        return { quiz, flashcards, quizAuthor }
    }
}

export const useQuizData = (id: number) => {
    return useQuery({
        queryKey: ['quiz', id],
        queryFn: () => getData(id)
    })
}

interface Quiz {
    id: number
    name: string
    description: string
    authorId: number
    frontLanguage: string
    backLanguage: string
}

interface Flashcard {
    id: number
    front: string
    back: string
    quizId: number
    starred: boolean
}

interface QuizAuthor {
    id: number
    name: string
    email: string
    path_to_img: string
}

interface QuizData {
    quiz: Quiz
    flashcards: Flashcard[]
    quizAuthor: QuizAuthor
}
