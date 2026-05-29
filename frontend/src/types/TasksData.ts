type GapTask = {
    sentence: string
    phrase: string
}

type SingleChoiceTask = {
    sentence: string
    phrase1: string
    phrase2: string
    phrase3: string
    correctAnswer: string
}

export interface TasksData {
    fillGap: {
        data: GapTask[]
    } | null
    firstLetterGap: {
        data: GapTask[]
    } | null
    singleChoice: {
        data: SingleChoiceTask[]
    } | null
    status: number | null
    errorMessage: number | null
    warning: string | null
}

export interface Tasks {
    data: TasksData
}