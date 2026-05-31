import { useQuery } from '@tanstack/react-query'

interface QuizProgress {
    flashcardId: number
    isKnown: boolean
}

const getData = async (quizId: number, userId?: number): Promise<QuizData> => {
    const quizResponse = await fetch(`/api/quizzes/${quizId}`)
    const flashcardsResponse = await fetch(`/api/quizzes/${quizId}/flashcards`)

    if (!quizResponse.ok) {
        throw new Error(`HTTP ${quizResponse.status}`)
    } else if (!flashcardsResponse.ok) {
        throw new Error(`HTPP ${flashcardsResponse.status}`)
    }

    const quiz: Quiz = await quizResponse.json()
    const flashcards: Flashcard[] = await flashcardsResponse.json()

    const quizAuthorResponse = await fetch(`/api/users/${quiz.authorId}`)
    const quizAuthor: QuizAuthor = await quizAuthorResponse.json()

    let flashcardsWithProgress = flashcards.map((flashcard) => ({
        ...flashcard,
        isKnown: false
    }))

    if (userId != null) {
        const quizProgressResponse = await fetch(`/api/quizzes-progress/user/${userId}/quiz/${quizId}`)

        if (quizProgressResponse.ok) {
            const quizProgress: QuizProgress[] = await quizProgressResponse.json()
            const progressByFlashcardId = new Map(
                quizProgress.map((progress) => [progress.flashcardId, progress.isKnown])
            )

            flashcardsWithProgress = flashcards.map((flashcard) => ({
                ...flashcard,
                isKnown: progressByFlashcardId.get(flashcard.id) ?? false
            }))
        }
    }

    return { quiz, flashcards: flashcardsWithProgress, quizAuthor }
}

export const useQuizData = (id: number, userId?: number) => {
    return useQuery({
        queryKey: ['quiz', id, userId],
        queryFn: () => getData(id, userId)
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
    isKnown: boolean
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
