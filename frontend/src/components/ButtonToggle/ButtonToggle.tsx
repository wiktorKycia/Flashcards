import styles from './ButtonToggle.module.scss'
import type { ReactNode } from 'react'

interface ButtonToggleProps {
    isOn: boolean
    setIsOn: () => void
    content: ReactNode
}

export default function ButtonToggle(props: ButtonToggleProps) {
    return (
        <button onClick={props.setIsOn} className={props.isOn ? styles.ButtonToggleOn : styles.ButtonToggleOff}>
            {props.content}
        </button>
    )
}
