type TaskData = {
    task: {
        sentence: string
        phrase: string
    }
    taskId: string
    value: string
    onChange: (taskID: string, value: string) => void
    isFinished: boolean
}

export default function GapTask({ task, taskId, value, onChange, isFinished }: TaskData) {
    const parts: string[] = task.sentence.split(/_+/)
    const isCorrect: boolean = value.trim() === task.phrase.trim()

    return (
        <div>
            <label>
                <span>{parts[0]}</span>
                <input
                    id={`${taskId}-gap`}
                    className={
                        isFinished
                            ? isCorrect
                                ? 'correctGap'
                                : 'incorrectGap'
                            : ''
                    }
                    type="text"
                    value={value}
                    disabled={isFinished}
                    onChange={(e) =>
                        onChange(taskId, e.target.value)
                    }
                />
                <span>{parts[1]}</span>
            </label>

            {isFinished && !isCorrect && (
                <p>Poprawna odpowiedź: {task.phrase}</p>
            )}
        </div>
    )
}