import { useMutation } from '@tanstack/react-query'
import { type TasksData } from '@/types/TasksData'
import { API_BASE_URL } from '@/lib/api'

type GenerateTasksProps = {
    fillGapCount: number
    firstLetterCount: number
    singleChoiceCount: number
    quizId: number
    languageSide: string
}

export const useGenerateTasks = () => {
    return useMutation({
        mutationFn: async ({
            fillGapCount,
            firstLetterCount,
            singleChoiceCount,
            quizId,
            languageSide
        }: GenerateTasksProps): Promise<TasksData> => {
            let firstError: string | null = null
            let firstWrongStatus: number | null = null
            let warning: string | null = null

            const generateTask = async (endpoint: string, questionsAmount: number) => {
                if (questionsAmount <= 0) {
                    return null
                }

                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        questionsAmount: questionsAmount,
                        quizId,
                        languageSide
                    })
                })

                let data = null

                try {
                    data = await res.json()
                } catch {
                    /* empty */
                }

                if (!res.ok) {
                    if (
                        [503, 404, 422].includes(res.status) ||
                        (res.status === 500 &&
                            data?.error === 'Nie skonfigurowano tokena GitHub wymaganego do korzystania z modeli AI')
                    ) {
                        if ((res.status === 503 || res.status === 422) && firstWrongStatus == null) {
                            firstWrongStatus = res.status
                            firstError = data?.error ?? null
                        } else {
                            throw new Error(data?.error)
                        }
                    } else {
                        throw new Error('Wystąpił nieoczekiwany błąd')
                    }
                }

                if (data?.warning && warning == null) {
                    warning = data?.warning
                }

                return data
            }

            const [data1, data2, data3] = await Promise.all([
                generateTask(`${API_BASE_URL}/api/tasks/generation/fill-gap`, fillGapCount),
                generateTask(`${API_BASE_URL}/api/tasks/generation/first-letter-gap`, firstLetterCount),
                generateTask(`${API_BASE_URL}/api/tasks/generation/single-choice`, singleChoiceCount)
            ])

            return {
                fillGap: data1?.subtasks ?? null,
                firstLetterGap: data2?.subtasks ?? null,
                singleChoice: data3?.subtasks ?? null,
                status: firstWrongStatus,
                errorMessage: firstError,
                warning
            }
        }
    })
}
