import { useState } from 'react'
import './App.css'
import TrashIcon from './TrashIcon'

function App() {
  const [participants, setParticipants] = useState([])

  const addParticipant = () => {
    setParticipants([...participants, { id: participants.length + 1, name: 'New Participant', initiative: 0 }])
  }

  const removeParticipant = (id) => {
    setParticipants(participants.filter((participant) => participant.id !== id))
  }

  const updateParticipant = (id, field, value) => {
    setParticipants(participants.map((participant) =>
      participant.id === id ? { ...participant, [field]: value } : participant
    ))
  }

  return (
    <>
      <h1>TTRPG Round Table</h1>
      <div>
        <button onClick={addParticipant}>
          Add Participant
        </button>
      </div>
      <div>
        <h2>Participants</h2>
        {participants.length === 0 ? (
          <p>No participants yet. Add one to get started!</p>
        ) : (
          <table className="participants-table">
            <thead>
              <tr>
                <th>Initiative</th>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...participants].sort((a, b) => b.initiative - a.initiative).map((participant) => (
                <tr key={participant.id}>
                  <td>
                    <input
                      type="number"
                      value={participant.initiative}
                      onChange={(e) => updateParticipant(participant.id, 'initiative', parseInt(e.target.value) || 0)}
                      className="table-input"
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
      </div>
    </>
  )
}

export default App
