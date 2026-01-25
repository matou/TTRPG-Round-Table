import { useState } from 'react'
import './App.css'
import TrashIcon from './TrashIcon'
import TagManager from './TagManager'

const COLOR_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#A8E6CF',
  '#FFB347', '#87CEEB', '#DDA0DD', '#F0E68C', '#20B2AA',
  '#FF69B4', '#6495ED'
]

function App() {
  const [participants, setParticipants] = useState([])
  const [tags, setTags] = useState([])
  const [selectedParticipantId, setSelectedParticipantId] = useState(null)
  const [nextTagId, setNextTagId] = useState(1)
  const [currentRound, setCurrentRound] = useState(1)
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0)

  const sortedParticipants = [...participants].sort((a, b) => b.initiative - a.initiative)

  const addParticipant = () => {
    setParticipants([...participants, { id: participants.length + 1, name: 'New Participant', initiative: 0, hpCurrent: 0, hpMax: 0, tags: [] }])
  }

  const removeParticipant = (id) => {
    const newParticipants = participants.filter((participant) => participant.id !== id)
    setParticipants(newParticipants)
    if (currentParticipantIndex >= newParticipants.length && currentParticipantIndex > 0) {
      setCurrentParticipantIndex(currentParticipantIndex - 1)
    }
  }

  const updateParticipant = (id, field, value) => {
    setParticipants(participants.map((participant) =>
      participant.id === id ? { ...participant, [field]: value } : participant
    ))
  }

  const getNextColor = () => {
    return COLOR_PALETTE[tags.length % COLOR_PALETTE.length]
  }

  const addTag = (tagName) => {
    if (!tags.find(t => t.name.toLowerCase() === tagName.toLowerCase())) {
      setTags([...tags, { id: nextTagId, name: tagName, color: getNextColor() }])
      setNextTagId(nextTagId + 1)
    }
  }

  const addTagToParticipant = (participantId, tagId) => {
    setParticipants(participants.map(p =>
      p.id === participantId && !p.tags.includes(tagId) ? { ...p, tags: [...p.tags, tagId] } : p
    ))
  }

  const removeTagFromParticipant = (participantId, tagId) => {
    setParticipants(participants.map(p =>
      p.id === participantId ? { ...p, tags: p.tags.filter(t => t !== tagId) } : p
    ))
  }

  const deleteTag = (tagId) => {
    setTags(tags.filter(t => t.id !== tagId))
    setParticipants(participants.map(p => ({
      ...p,
      tags: p.tags.filter(t => t !== tagId)
    })))
  }

  const getTagColor = (tagId) => {
    return tags.find(t => t.id === tagId)?.color || '#999'
  }

  const getTagName = (tagId) => {
    return tags.find(t => t.id === tagId)?.name || 'Unknown'
  }

  const goToNextTurn = () => {
    if (sortedParticipants.length === 0) return
    
    if (currentParticipantIndex >= sortedParticipants.length - 1) {
      setCurrentRound(currentRound + 1)
      setCurrentParticipantIndex(0)
    } else {
      setCurrentParticipantIndex(currentParticipantIndex + 1)
    }
  }

  const goToPreviousTurn = () => {
    if (sortedParticipants.length === 0) return
    
    if (currentParticipantIndex <= 0) {
      if (currentRound > 1) {
        setCurrentRound(currentRound - 1)
        setCurrentParticipantIndex(sortedParticipants.length - 1)
      }
    } else {
      setCurrentParticipantIndex(currentParticipantIndex - 1)
    }
  }

  const goToNextRound = () => {
    setCurrentRound(currentRound + 1)
    setCurrentParticipantIndex(0)
  }

  const goToPreviousRound = () => {
    if (currentRound > 1) {
      setCurrentRound(currentRound - 1)
      setCurrentParticipantIndex(0)
    }
  }

  const getCurrentParticipant = () => {
    return sortedParticipants[currentParticipantIndex]
  }

  return (
    <>
      <h1>TTRPG Round Table</h1>
      
      <div className="round-controls">
        <div className="round-info">
          <h2>Round {currentRound}</h2>
          {getCurrentParticipant() && (
            <p className="current-turn">Current turn: <strong>{getCurrentParticipant().name}</strong></p>
          )}
        </div>
        
        <div className="button-group">
          <button onClick={goToPreviousRound} disabled={currentRound === 1}>
            ← Previous Round
          </button>
          <button onClick={goToPreviousTurn} disabled={sortedParticipants.length === 0}>
            ← Previous Turn
          </button>
          <button onClick={goToNextTurn} disabled={sortedParticipants.length === 0}>
            Next Turn →
          </button>
          <button onClick={goToNextRound}>
            Next Round →
          </button>
        </div>
      </div>

      <button onClick={addParticipant} className="add-button">
        + Add Participant
      </button>

      {participants.length === 0 ? (
        <p className="empty-state">No participants yet. Add one to get started!</p>
      ) : (
        <table className="participants-table">
          <thead>
            <tr>
              <th>Initiative</th>
              <th>Name</th>
              <th>Tags</th>
              <th>HP</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedParticipants.map((participant, index) => (
              <tr key={participant.id} className={index === currentParticipantIndex ? 'active-participant' : ''}>
                  <td>
                    <input
                      type="number"
                      value={participant.initiative}
                      onChange={(e) => updateParticipant(participant.id, 'initiative', parseInt(e.target.value) || 0)}
                      className="table-input initiative-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={participant.name}
                      onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                      className="table-input"
                    />
                  </td>
                  <td>
                    <div className="tags-cell">
                      {participant.tags.map(tagId => (
                        <span key={tagId} className="tag" style={{ backgroundColor: getTagColor(tagId) }}>
                          {getTagName(tagId)}
                          <button
                            onClick={() => removeTagFromParticipant(participant.id, tagId)}
                            className="tag-remove"
                            aria-label={`Remove ${getTagName(tagId)} tag`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <button
                        onClick={() => setSelectedParticipantId(selectedParticipantId === participant.id ? null : participant.id)}
                        className="add-tag-button"
                      >
                        + Add Tag
                      </button>
                      {selectedParticipantId === participant.id && (
                        <TagManager
                          tags={tags}
                          onAddExistingTag={(tagId) => addTagToParticipant(participant.id, tagId)}
                          onCreateNewTag={(tagName) => {
                            addTag(tagName)
                            const newTag = tags.find(t => t.name.toLowerCase() === tagName.toLowerCase()) || { id: nextTagId, name: tagName, color: getNextColor() }
                            addTagToParticipant(participant.id, newTag.id)
                            setSelectedParticipantId(null)
                          }}
                          onDeleteTag={deleteTag}
                          onClose={() => setSelectedParticipantId(null)}
                        />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="hp-input-container">
                      <input
                        type="number"
                        value={participant.hpCurrent ?? 0}
                        onChange={(e) => updateParticipant(participant.id, 'hpCurrent', parseInt(e.target.value) || 0)}
                        className="table-input hp-input"
                      />
                      <span className="hp-separator">/</span>
                      <input
                        type="number"
                        value={participant.hpMax ?? 0}
                        onChange={(e) => updateParticipant(participant.id, 'hpMax', parseInt(e.target.value) || 0)}
                        className="table-input hp-input"
                      />
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => removeParticipant(participant.id)}
                      className="remove-button"
                      aria-label="Remove participant"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </>
  )
}

export default App
