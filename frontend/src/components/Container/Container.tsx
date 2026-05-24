import type { ReactNode } from 'react'
import styles from './Container.module.scss'

interface ContainerProps {
    children: ReactNode
    cssClassName?: string
}

export default function Container(props: ContainerProps) {
    return <div className={props.cssClassName || styles.Container}>{props.children}</div>
}
