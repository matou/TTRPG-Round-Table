import { useState } from 'react'
import './App.css'

function removeParticipant(participants, setParticipants, participantIndexToRemove) {
    setParticipants(participants.filter((_, index) => index !== participantIndexToRemove))
}

function participantTable(participants, setParticipants) {
    return (
      <table>
        <thead>
          <tr>
            <th>Initiative</th>
            <th>Name</th>
            <th>HP</th>
            </tr>
        </thead>
        <tbody>
          {participants
              .sort((a, b) => b.initiative - a.initiative)
              .map((participant, index) => (
            <tr key={index}>
              <td><input type="number" value={participant.initiative} 
                    onChange={(e) => setParticipants(participants.map((p, i) => i === index ? {...p, initiative: parseInt(e.target.value)} : p))} /></td>
              <td><input type="text" value={participant.name} placeholder='New participant' onChange={(e) => setParticipants(participants.map((p, i) => i === index ? {...p, name: e.target.value} : p))}/></td>
              <td>
                <input type="number" value={participant.hpCurrent} onChange={(e) => setParticipants(participants.map((p, i) => i === index ? {...p, hpCurrent: parseInt(e.target.value)} : p))} />
                /
                <input type="number" value={participant.hpMax} onChange={(e) => setParticipants(participants.map((p, i) => i === index ? {...p, hpMax: parseInt(e.target.value)} : p))} />
              </td>
              <td><button onClick={() => removeParticipant(participants, setParticipants, index)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

function App() {
  const [participants, setParticipants] = useState([])

  const addParticipant = () => {
    const newParticipant = { initiative: 0, name: '', hpCurrent: 0, hpMax: 0 }
    setParticipants([...participants, newParticipant])
  }

  const clearParticipants = () => {
    setParticipants([])
  }

  return (
    <>
      <div className="App">
        <h1>TTRPG Round Table</h1>

        <button onClick={addParticipant}>+ Participant</button>
        <button onClick={clearParticipants}>Clear all</button>

        {participantTable(participants, setParticipants)}
      </div>
    </>
  )
}

export default App
