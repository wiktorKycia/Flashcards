import styles from './SingleChoiceTask.module.scss'

type TaskData = {
    task: {
        sentence: string
        phrase1: string
        phrase2: string
        phrase3: string
        correctAnswer: string
    }
    taskId: string
    selectedValue: string
    onChange: (taskId: string, value: string) => void
    isFinished: boolean
}

export default function SingleChoiceTask({ task, taskId, selectedValue, onChange, isFinished }: TaskData) {
    const isCorrect = selectedValue === task.correctAnswer

    const getOptionClassName = (option: string) => {
        const isSelected = selectedValue === option
        const isCorrect = option === task.correctAnswer

        if (!isFinished) {
            return ''
        }

        if (isCorrect) {
            return styles.correctOption
        }

        if (isSelected) {
            return styles.incorrectOption
        }

        return ''
    }

    return (
        <div className={styles.taskWrapper}>
            <p className={styles.sentence}>
                {task.sentence.split(/_+/)[0]}_____{task.sentence.split(/_+/)[1]}
            </p>

            <div className={styles.optionsWrapper}>
                <label className={getOptionClassName(task.phrase1)}>
                    <input
                        className={styles.optionMark}
                        type="radio"
                        name={`options-${taskId}`}
                        value={task.phrase1}
                        disabled={isFinished}
                        checked={selectedValue === task.phrase1}
                        onChange={(e) => onChange(taskId, e.target.value)}
                    />
                    {task.phrase1}
                </label>

                <label className={getOptionClassName(task.phrase2)}>
                    <input
                        className={styles.optionMark}
                        type="radio"
                        name={`options-${taskId}`}
                        value={task.phrase2}
                        disabled={isFinished}
                        checked={selectedValue === task.phrase2}
                        onChange={(e) => onChange(taskId, e.target.value)}
                    />
                    {task.phrase2}
                </label>

                <label className={getOptionClassName(task.phrase3)}>
                    <input
                        className={styles.optionMark}
                        type="radio"
                        name={`options-${taskId}`}
                        value={task.phrase3}
                        disabled={isFinished}
                        checked={selectedValue === task.phrase3}
                        onChange={(e) => onChange(taskId, e.target.value)}
                    />
                    {task.phrase3}
                </label>
            </div>

            {isFinished && !isCorrect && <p>Poprawna odpowiedź: {task.correctAnswer}</p>}
        </div>
    )
}
