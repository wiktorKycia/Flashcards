import { useEffect, useState } from 'react'

import { API_BASE_URL } from '@/lib/auth'

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

const getData = async (
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
    const [data, setData] = useState<QuizData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!Number.isFinite(id) || id <= 0) {
            setData(null)
            setIsLoading(false)
            setIsError(true)
            setError(new Error('Invalid quiz id'))
            return
        }

        const controller = new AbortController()
        let isActive = true

        const load = async () => {
            try {
                setIsLoading(true)
                setIsError(false)
                setError(null)

                const result = await getData(id, userId, controller.signal)
                if (isActive) {
                    setData(result)
                }
            } catch (err) {
                if (!isActive) {
                    return
                }
                if (err instanceof Error && err.name === 'AbortError') {
                    return
                }
                setIsError(true)
                setError(err instanceof Error ? err : new Error('Unknown error'))
                setData(null)
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        load()

        return () => {
            isActive = false
            controller.abort()
        }
    }, [id, userId])

    return { data, isLoading, isError, error }
}
