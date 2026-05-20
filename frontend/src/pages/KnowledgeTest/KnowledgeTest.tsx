import { useState } from 'react'
import { Link, useParams } from 'react-router'
import type KnowledgeTestSettings from '@/types/KnowledgeTestSettings'
import KnowledgeTestSetup from '@/components/KnowledgeTestSetup'
import KnowledgeTestView from '@/components/KnowledgeTestView'
import { useGenerateTasks } from '@/hooks/useGenerateTasks.ts'
import styles from './KnowledgeTest.module.scss'

export default function KnowledgeTest() {
    const [settings, setSettings] = useState<KnowledgeTestSettings | null>(null)
    const { mutate, data, isPending, isError } = useGenerateTasks()
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
                        <div>Generowanie testu...</div>
                    )}

                    {isError && (
                        <div>Wystąpił błąd</div>
                    )}

                    {(data?.status == 500 || data?.status == 503) && (
                        <div>
                            {data.errorMessage}
                        </div>
                    )}

                    {(data?.status == 404 || data?.status == 422) && (
                        <div>
                            Brakuje fiszek do utworzenia wymaganej liczby zadań
                        </div>
                    )}

                    {data?.warning && (
                        <div>{data.warning}</div>
                    )}

                    {hasAnyData ? (
                        <KnowledgeTestView data={data} />
                    ) : (
                        <div>Brak zadań</div>
                    )}
                </div>
            )}
        </div>
    )
}