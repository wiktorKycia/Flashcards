import { useQuery } from '@tanstack/react-query'
import type Quiz from '@/types/Quiz.ts'

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
        queryKey: ['quizzes'],
        queryFn: () => getData()
    })
}
