import { useMutation } from '@tanstack/react-query'

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
        }: GenerateTasksProps) => {
            let firstError: string | null = null
            let firstWrongStatus: number | null = null
            let warning: string | null = null

            const generateTask = async (
                endpoint: string,
                questionsAmount: number
            ) => {
                if (questionsAmount <= 0){
                    return null
                }

                const res = await fetch(
                    endpoint,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            questionsAmount: questionsAmount,
                            quizId,
                            languageSide,
                        }),
                    }
                )

                let data = null

                try {
                    data = await res.json()
                } catch { /* empty */ }

                if (!res.ok && firstError == null) {
                    firstWrongStatus = res.status
                    firstError = data?.error ?? null
                }

                if (data?.warning && warning == null) {
                    warning = data?.warning
                }

                return data
            }

            const [data1, data2, data3] = await Promise.all([
                generateTask(
                    "/api/tasks/generation/fill-gap",
                    fillGapCount
                ),
                generateTask(
                    "/api/tasks/generation/first-letter-gap",
                    firstLetterCount
                ),
                generateTask(
                    "/api/tasks/generation/single-choice",
                    singleChoiceCount
                )
            ])

            return {
                fillGap: data1?.subtasks ?? null,
                firstLetterGap: data2?.subtasks ?? null,
                singleChoice: data3?.subtasks ?? null,
                status: firstWrongStatus,
                errorMessage: firstError,
                warning,
            }
        }
    })
}