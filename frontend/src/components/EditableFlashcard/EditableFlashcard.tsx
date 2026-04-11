import styles from './EditableFlashcard.module.scss'
import {useState} from "react";

interface PropsType {
    side1: string,
    side2: string,
    isStarred: boolean,
    isUserLoggedIn: boolean,
    isUserAuthor: boolean
}

export default function EditableFlashcard(props: PropsType) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isStarred, setIsStarred] = useState<boolean>(props.isStarred)

    const [text1, setText1] = useState<string>(props.side1)
    const [text2, setText2] = useState<string>(props.side2)

    return (
        <div className={styles.EditableFlashcard}>
            { isEditing ? (
                <input type="text" value={text1} onChange={(event) => setText1(event.target.value)}/>
            ) : (
                <div>{text1}</div>
            )}

            { isEditing ? (
                <input type="text" value={text2} onChange={(event) => setText2(event.target.value)}/>
            ) : (
                <div>{text2}</div>
            )}

            { props.isUserLoggedIn && ( /*zalogowany*/
                <button onClick={() => setIsStarred((prevState) => !prevState)}>
                    {isStarred ? "*" : "-"}
                </button>
            )}

            { props.isUserAuthor && ( /*twórca*/
                <button onClick={() => setIsEditing((prevState) => !prevState)}>
                    {isEditing ? "Save" : "Edit"}
                </button>
            )}
        </div>
    )
}