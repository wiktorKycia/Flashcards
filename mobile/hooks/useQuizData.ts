import { useQuery } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/api'

interface QuizProgress {
    flashcardId: number
    isKnown: boolean
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

export interface QuizData {
    quiz: Quiz
    flashcards: Flashcard[]
    quizAuthor: QuizAuthor
}

export const getQuizDataQueryKey = (id: number, userId?: number) =>
    ['quiz', id, userId] as const

export const fetchQuizData = async (
    quizId: number,
    userId?: number,
    signal?: AbortSignal
): Promise<QuizData> => {
    const fetchOptions = signal ? { signal } : undefined
    const quizResponse = await fetch(
        `${API_BASE_URL}/api/quizzes/${quizId}`,
        fetchOptions
    )
    const flashcardsResponse = await fetch(
        `${API_BASE_URL}/api/quizzes/${quizId}/flashcards`,
        fetchOptions
    )

    if (!quizResponse.ok) {
        throw new Error(`HTTP ${quizResponse.status}`)
    }
    if (!flashcardsResponse.ok) {
        throw new Error(`HTTP ${flashcardsResponse.status}`)
    }

    const quiz: Quiz = await quizResponse.json()
    const flashcards: Flashcard[] = await flashcardsResponse.json()

    const quizAuthorResponse = await fetch(
        `${API_BASE_URL}/api/users/${quiz.authorId}`,
        fetchOptions
    )
    if (!quizAuthorResponse.ok) {
        throw new Error(`HTTP ${quizAuthorResponse.status}`)
    }
    const quizAuthor: QuizAuthor = await quizAuthorResponse.json()

    let flashcardsWithProgress = flashcards.map((flashcard) => ({
        ...flashcard,
        isKnown: false
    }))

    if (userId != null) {
        const quizProgressResponse = await fetch(
            `${API_BASE_URL}/api/quizzes-progress/user/${userId}/quiz/${quizId}`,
            fetchOptions
        )

        if (quizProgressResponse.ok) {
            const quizProgress: QuizProgress[] = await quizProgressResponse.json()
            const progressByFlashcardId = new Map(
                quizProgress.map((progress) => [
                    progress.flashcardId,
                    progress.isKnown
                ])
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
    const enabled = Number.isFinite(id) && id > 0

    return useQuery({
        queryKey: getQuizDataQueryKey(id, userId),
        queryFn: ({ signal }) => fetchQuizData(id, userId, signal),
        enabled
    })
}
