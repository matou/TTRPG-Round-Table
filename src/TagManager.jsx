import { createPortal } from "react-dom"
import { useState } from "react"

function TagManager({ tags, onAddExistingCondition, onAddNewCondition, onClose }) {
    const [newCondition, setNewCondition] = useState('')

    const addCondition = () => {
        onAddNewCondition(newCondition)
        setNewCondition('')
    }

    return (
        createPortal(
            <div className="tag-manager-backdrop" onClick={onClose}>
                <div className="tag-manager" onClick={(e) => e.stopPropagation()}>
                    <h3>Add Condition</h3>
                    <div className="existing-tags">
                        {tags.map((tag, index) => (
                            <span key={index} className="condition">{tag}</span>
                        ))}
                    </div>
                    <input type="text" placeholder="New condition" onChange={(e) => setNewCondition(e.target.value)} />
                    <button onClick={() => addCondition()}>Add</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>,
            document.body
        )
    )
}

export default TagManager