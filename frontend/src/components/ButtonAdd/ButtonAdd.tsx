import styles from './ButtonAdd.module.scss'
import useCreateQuiz from '@/hooks/useCreateQuiz.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

export default function ButtonAdd() {
    const navigate = useNavigate()
    const auth = useAuth()
    const createQuiz = useCreateQuiz()
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
        }
    }, [])

    function openTooltip() {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current)
            closeTimerRef.current = null
        }
        setTooltipOpen(true)
    }

    function scheduleCloseTooltip() {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
        closeTimerRef.current = setTimeout(() => setTooltipOpen(false), 150)
    }

    async function handleButtonOnClick() {
        if (!auth.user) {
            navigate('/login')
            return
        }

        const authorId = auth.user.id

        createQuiz.mutate(authorId, {
            onSuccess: (createdQuiz) => {
                console.log(createdQuiz)
                navigate(`/quiz/${createdQuiz.id}/edit`)
            }
        })
    }

    return (
        <div className={styles.ButtonAddContainer} onMouseEnter={openTooltip} onMouseLeave={scheduleCloseTooltip}>
            <button onClick={handleButtonOnClick} className={styles.ButtonAdd}>
                +
            </button>
            <div className={`tooltip ${tooltipOpen ? 'tooltip-open' : ''}`}>
                <div className={'tooltip-links-container'}>
                    <span className={'tooltip-text'}>Stwórz quiz</span>
                </div>
            </div>
        </div>
    )
}
