import { useState } from 'react'

function TagManager({ tags, onAddExistingTag, onCreateNewTag, onDeleteTag, onClose }) {
  const [newTagName, setNewTagName] = useState('')
  const [showNewTagForm, setShowNewTagForm] = useState(tags.length === 0)

  const handleCreateNewTag = () => {
    if (newTagName.trim()) {
      onCreateNewTag(newTagName.trim())
      setNewTagName('')
      setShowNewTagForm(false)
    }
  }

  return (
    <div className="tag-manager">
      <div className="tag-manager-content">
        <h3>Add Tag</h3>
        
        {!showNewTagForm && (
          <>
            {tags.length > 0 && (
              <div className="existing-tags">
                {tags.map(tag => (
                  <div key={tag.id} className="tag-select-wrapper">
                    <button
                      onClick={() => onAddExistingTag(tag.id)}
                      className="tag-select-button"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </button>
                    <button
                      onClick={() => onDeleteTag(tag.id)}
                      className="tag-delete-button"
                      aria-label={`Delete ${tag.name} tag`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowNewTagForm(true)}
              className="new-tag-button"
            >
              + New Tag
            </button>
          </>
        )}
        
        {showNewTagForm && (
          <div className="new-tag-form">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateNewTag()}
              placeholder="Tag name..."
              autoFocus
              className="tag-input"
            />
            <div className="form-buttons">
              <button onClick={handleCreateNewTag} className="create-button">
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewTagForm(false)
                  setNewTagName('')
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  )
}

export default TagManager
