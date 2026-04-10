import styles from './EditableFlashcard.module.scss'

export default function EditableFlashcard() {
    return (
        <div className={styles.EditableFlashcard}>
            <div>lang1</div>
            <div>lang2</div>
            <div>star</div> {/*zalogowany*/}
            <div>edit</div> {/*twórca*/}
        </div>
    )
}