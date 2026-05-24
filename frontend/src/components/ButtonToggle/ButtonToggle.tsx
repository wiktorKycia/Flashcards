import styles from './ButtonToggle.module.scss'

interface ButtonToggleProps {
    isOn: boolean
    setIsOn: () => void
    content: string
}

export default function ButtonToggle(props: ButtonToggleProps) {
    return (
        <button onClick={props.setIsOn} className={props.isOn ? styles.ButtonToggleOn : styles.ButtonToggleOff}>
            {props.content}
        </button>
    )
}

