import { useQuery } from '@tanstack/react-query'

const getData = async (): Promise<Array<Quiz>> => {
    const quizResponse = await fetch(`/api/quizzes`)

    if (!quizResponse.ok) {
        throw new Error(`HTTP ${quizResponse.status}`)
    } else {
        return await quizResponse.json()
    }
}

export const useQuizzes = () => {
    return useQuery({
        queryKey: ['quiz'],
        queryFn: () => getData()
    })
}

interface Quiz {
    id: number
    name: string
    description: string
    authorId: number
    frontLanguage: string
    backLanguage: string
    likes: number
    dislikes: number
}
