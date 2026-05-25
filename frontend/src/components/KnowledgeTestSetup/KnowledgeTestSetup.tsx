import { useState, type SubmitEvent } from 'react'
import type KnowledgeTestSettings from '@/types/KnowledgeTestSettings'
import styles from './KnowledgeTestSetup.module.scss'

type Props = {
    onSubmitSettings: (settings: KnowledgeTestSettings) => void
}

export default function KnowledgeTestSetup({ onSubmitSettings }: Props) {
    const [fillGapCount, setFillGapCount] = useState(5)
    const [firstLetterCount, setFirstLetterCount] = useState(5)
    const [singleChoiceCount, setSingleChoiceCount] = useState(5)
    const [flashcardsSide, setFlashcardsSide] = useState("FRONT")

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault()

        onSubmitSettings({
            fillGapCount,
            firstLetterCount,
            singleChoiceCount,
            flashcardsSide,
        })
    }

    return (
        <form onSubmit={handleSubmit} className={styles.setupForm}>
            <label className={styles.setupLabel}>
                Wybierz liczbę pytań z luką:
                <input
                    className={styles.setupInput}
                    type="number"
                    value={fillGapCount}
                    min="0"
                    max="5"
                    onChange={(e) =>
                        setFillGapCount(Number(e.target.value))
                    }
                />
            </label>

            <label className={styles.setupLabel}>
                Wybierz liczbę pytań z luką, w których podana jest pierwsza litera odpowiedzi:
                <input
                    className={styles.setupInput}
                    type="number"
                    value={firstLetterCount}
                    min="0"
                    max="5"
                    onChange={(e) =>
                        setFirstLetterCount(Number(e.target.value))
                    }
                />
            </label>

            <label className={styles.setupLabel}>
                Wybierz liczbę pytań jednokrotnego wyboru:
                <input
                    className={styles.setupInput}
                    type="number"
                    value={singleChoiceCount}
                    min="0"
                    max="5"
                    onChange={(e) =>
                        setSingleChoiceCount(Number(e.target.value))
                    }
                />
            </label>

            <div className={styles.wrapper}>
                <label className={styles.setupLabel} htmlFor="flashcards-side">Wybierz stronę fiszek, której mają dotyczyć pytania:</label>

                <select
                    className={styles.setupSelect}
                    id="flashcards-side"
                    value={flashcardsSide}
                    onChange={(e) => setFlashcardsSide(e.target.value)}
                >
                    <option value="FRONT">Przód</option>
                    <option value="BACK">Tył</option>
                </select>
            </div>

            <button type="submit">
                Rozpocznij
            </button>
        </form>
    )
}