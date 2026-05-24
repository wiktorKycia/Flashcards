import { useState, type MouseEvent } from 'react'
import GapTask from '@/components/GapTask'
import SingleChoiceTask from '@/components/SingleChoiceTask'
import styles from './KnowledgeTestView.module.scss'
import {type Tasks} from '@/types/TasksData'

export default function KnowledgeTestView({ data }: Tasks) {
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [score, setScore] = useState<number>(0)
    const [isFinished, setIsFinished] = useState<boolean>(false)

    const handleAnswerChange = (taskID: string, value: string) => {
        if (isFinished) return

        setAnswers(prev => ({
            ...prev,
            [taskID]: value
        }))
    }

    const handleCheck = () => {
        let points = 0

        data.fillGap?.data.forEach((task, i) => {
            const id = `fill-gap${i}`

            if (answers[id]?.trim().slice(1) === task.phrase.trim().slice(1) && answers[id]?.trim()[0]?.toLowerCase() === task.phrase.trim()[0]?.toLowerCase()) {
                points++
            }
        })

        data.firstLetterGap?.data.forEach((task, i) => {
            const id = `first-letter${i}`

            if (answers[id]?.trim() === task.phrase.trim().slice(1)) {
                points++
            }
        })

        data.singleChoice?.data.forEach((task, i) => {
            const id = `single-choice${i}`

            if (answers[id]?.trim() === task.correctAnswer.trim()) {
                points++
            }
        })

        setScore(points)
        setIsFinished(true)
    }

    const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        setAnswers({})
        setScore(0)
        setIsFinished(false)
    }

    const totalQuestions: number =
        (data.fillGap?.data.length || 0) +
        (data.firstLetterGap?.data.length || 0) +
        (data.singleChoice?.data.length || 0)

    const percentage: number = totalQuestions > 0 ? Math.round(score / totalQuestions * 100) : 0

    return (
        <form
            className={styles.tasksForm}
            onSubmit={(e) => {
                e.preventDefault()
                handleCheck()
            }}
        >
            {data.fillGap?.data?.length ? (
                <section className={styles.taskGroup}>
                    <h2>Wypełnij luki</h2>

                    {data.fillGap.data.map((task, i) => (
                        <GapTask
                            key={`fill-gap${i}`}
                            task={task}
                            taskId={`fill-gap${i}`}
                            value={answers[`fill-gap${i}`] || ''}
                            isFirstLetter={false}
                            onChange={handleAnswerChange}
                            isFinished={isFinished}
                        />
                    ))}
                </section>
            ) : null}

            {data.firstLetterGap?.data?.length ? (
                <section className={styles.taskGroup}>
                    <h2>Wypełnij pozostałe części fraz w lukach na podstawie ich pierwszych liter</h2>

                    {data.firstLetterGap.data.map((task, i) => (
                        <GapTask
                            key={`first-letter${i}`}
                            task={task}
                            taskId={`first-letter${i}`}
                            value={answers[`first-letter${i}`] || ''}
                            isFirstLetter={true}
                            onChange={handleAnswerChange}
                            isFinished={isFinished}
                        />
                    ))}
                </section>
            ) : null}

            {data.singleChoice?.data?.length ? (
                <section className={styles.taskGroup}>
                    <h2>Wybierz poprawne uzupełnienie luki</h2>

                    {data.singleChoice.data.map((task, i) => (
                        <SingleChoiceTask
                            key={`single-choice${i}`}
                            task={task}
                            taskId={`single-choice${i}`}
                            selectedValue={answers[`single-choice${i}`] || ''}
                            onChange={handleAnswerChange}
                            isFinished={isFinished}
                        />
                    ))}
                </section>
            ) : null}

            {isFinished && (
                <div className={styles.resultWrapper}>
                    <h2>Wynik</h2>
                    <p>{score} / {totalQuestions}</p>
                    <p>{percentage}%</p>
                </div>
            )}

            <div>
                {!isFinished ? (
                    <button type="submit">
                        Sprawdź
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleReset}
                    >
                        Resetuj test
                    </button>
                )}
            </div>
        </form>
    )
}