import { useQuery } from '@tanstack/react-query'
import type FullQuiz from '@/types/FullQuiz.ts'

const getData = async (): Promise<Array<FullQuiz>> => {
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
