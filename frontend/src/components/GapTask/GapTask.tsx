import styles from "./GapTask.module.scss"

type TaskData = {
    task: {
        sentence: string
        phrase: string
    }
    taskId: string
    value: string
    isFirstLetter: boolean
    onChange: (taskID: string, value: string) => void
    isFinished: boolean
}

export default function GapTask({ task, taskId, value, isFirstLetter, onChange, isFinished }: TaskData) {
    const parts: string[] = task.sentence.split(/_+/)
    const phrase: string = isFirstLetter ? task.phrase.trim().slice(1) : task.phrase
    let isCorrect: boolean

    if (isFirstLetter) {
        isCorrect = value.trim() === phrase.trim()
    }
    else {
        isCorrect = value.trim().slice(1) === phrase.trim().slice(1) && value.trim()[0]?.toLowerCase() === phrase.trim()[0]?.toLowerCase()
    }

    return (
        <div className={styles.taskWrapper}>
            <label>
                <span>{parts[0]}</span>
                <input
                    id={`${taskId}-gap`}
                    className={
                        isFinished
                            ? isCorrect
                                ? styles.correctGap
                                : styles.incorrectGap
                            : ''
                    }
                    type="text"
                    value={value}
                    disabled={isFinished}
                    autoComplete="off"
                    onChange={(e) =>
                        onChange(taskId, e.target.value)
                    }
                />
                <span>{parts[1]}</span>
            </label>

            {isFinished && !isCorrect && (
                <p>Poprawna odpowiedź: {phrase}</p>
            )}
        </div>
    )
}