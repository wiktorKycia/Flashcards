import { useState } from 'react'
import { Link, useParams } from 'react-router'
import type KnowledgeTestSettings from '@/types/KnowledgeTestSettings'
import KnowledgeTestSetup from '@/components/KnowledgeTestSetup'
import KnowledgeTestView from '@/components/KnowledgeTestView'
import { useGenerateTasks } from '@/hooks/useGenerateTasks.ts'
import styles from './KnowledgeTest.module.scss'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function KnowledgeTest() {
    const [settings, setSettings] = useState<KnowledgeTestSettings | null>(null)
    const { mutate, data, isPending, isError, error } = useGenerateTasks()
    const params = useParams()
    const quizId = Number(params.id)

    if (Number.isNaN(quizId)) {
        throw new Error("Invalid quiz id")
    }

    const handleStart = (s: KnowledgeTestSettings) => {
        setSettings(s)

        mutate({
            fillGapCount: s.fillGapCount,
            firstLetterCount: s.firstLetterCount,
            singleChoiceCount: s.singleChoiceCount,
            quizId: quizId,
            languageSide: s.flashcardsSide
        })
    }

    const hasAnyData = !!(data?.fillGap?.data?.length ||
        data?.firstLetterGap?.data?.length ||
        data?.singleChoice?.data?.length)

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.buttonWrapper}>
                <Link
                    to={`/quiz/${quizId}`}
                    className="redirectButton"
                >Wróć do zestawu fiszek</Link>
            </div>
            {!settings ? (
                <KnowledgeTestSetup onSubmitSettings={handleStart} />
            ) : (
                <div>
                    {isPending && (
                        <LoadingSpinner />
                    )}

                    {isError && (
                        <div>{error.message}</div>
                    )}

                    {data?.errorMessage && (
                        <div>{data.errorMessage}</div>
                    )}

                    {data?.warning && (
                        <div>Uwaga: {data.warning}</div>
                    )}

                    {hasAnyData && !isError ? (
                        <KnowledgeTestView data={data} />
                    ) : (
                        !isPending && !isError && (<div>Brak zadań</div>)
                    )}
                </div>
            )}
        </div>
    )
}