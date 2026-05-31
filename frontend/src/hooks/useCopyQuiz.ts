import { useMutation } from '@tanstack/react-query'

interface CopyQuizVariables {
    name: string
    description: string | null
    frontLanguage: string
    backLanguage: string
    authorId: number
    flashcards: { front: string; back: string }[]
}

const copyQuiz = async ({
    name,
    description,
    frontLanguage,
    backLanguage,
    authorId,
    flashcards
}: CopyQuizVariables): Promise<number> => {
    // 1. Create new quiz
    const quizResponse = await fetch('/api/quizzes/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name ? `${name} - kopia` : 'Kopia quizu',
            description,
            frontLanguage,
            backLanguage,
            authorId
        })
    })

    if (!quizResponse.ok) {
        throw new Error(`HTTP error! status: ${quizResponse.status}`)
    }

    const createdQuiz = await quizResponse.json()

    // 2. Put flashcards
    const flashcardsResponse = await fetch(`/api/quizzes/${createdQuiz.id}/flashcards`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(flashcards)
    })

    if (!flashcardsResponse.ok) {
        throw new Error(`HTTP error! status: ${flashcardsResponse.status}`)
    }

    return createdQuiz.id
}

export const useCopyQuiz = () => {
    return useMutation({
        mutationFn: copyQuiz
    })
}
