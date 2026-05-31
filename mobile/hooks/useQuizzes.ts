import { useQuery } from '@tanstack/react-query'
import type FullQuiz from '@/types/FullQuiz.ts'
import { API_BASE_URL } from '@/lib/api'

const getData = async (): Promise<FullQuiz[]> => {
    const quizResponse = await fetch(`${API_BASE_URL}/api/quizzes`)

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
