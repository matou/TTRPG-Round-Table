import { useState } from 'react'
import './App.css'

function removeParticipant(participants, setParticipants, participantIndexToRemove) {
    setParticipants(participants.filter((_, index) => index !== participantIndexToRemove))
}

function updateInitiative(participants, setParticipants, participantIndex, newInitiative) {
    setParticipants(participants.map((participant, index) => 
        index === participantIndex ? {...participant, initiative: newInitiative} : participant
    ))
}

function updateName(participants, setParticipants, participantIndex, newName) {
    setParticipants(participants.map((participant, index) => 
        index === participantIndex ? {...participant, name: newName} : participant
    ))
}

function updateCurrentHP(participants, setParticipants, participantIndex, newCurrentHP) {
    setParticipants(participants.map((participant, index) => 
        index === participantIndex ? {...participant, hpCurrent: newCurrentHP} : participant
    ))
}

function updateMaxHP(participants, setParticipants, participantIndex, newMaxHP) {
    setParticipants(participants.map((participant, index) => 
        index === participantIndex ? {...participant, hpMax: newMaxHP} : participant
    ))
}

function ParticipantTable(participants, setParticipants, turn) {
    return (
      <table>
        <thead>
          <tr>
            <th>Initiative</th>
            <th>Name</th>
            <th>HP</th>
            <th></th>
            </tr>
        </thead>
        <tbody>
          {participants
              .sort((a, b) => b.initiative - a.initiative)
              .map((participant, index) => (
            <tr key={index}
                className={turn === index ? 'active-turn' : ''}>
              <td><input type="number" value={participant.initiative} 
                    onChange={(e) => updateInitiative(participants, setParticipants, index, parseInt(e.target.value))} /></td>
              <td><input type="text" value={participant.name} placeholder='New participant' 
                    onChange={(e) => updateName(participants, setParticipants, index, e.target.value)} /></td>
              <td>
                <input type="number" value={participant.hpCurrent} 
                      onChange={(e) => updateCurrentHP(participants, setParticipants, index, parseInt(e.target.value))} />
                /
                <input type="number" value={participant.hpMax} 
                      onChange={(e) => updateMaxHP(participants, setParticipants, index, parseInt(e.target.value))} />
              </td>
              <td><button onClick={() => removeParticipant(participants, setParticipants, index)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

function RoundTracker(round, setRound, turn, setTurn, size) {
    const nextTurn = () => {
        if (turn + 1 >= size) {
            setTurn(0)
            setRound(round + 1)
        } else {
            setTurn(turn + 1)
        }
    }

    const previousTurn = () => {
        if (turn - 1 < 0) {
            setTurn(size - 1)
            setRound(round - 1)
        } else {
            setTurn(turn - 1)
        }
    }
    
    return (
      <div>
        <button onClick={() => setRound(round - 1)}>&lt;&lt;</button>
        <button onClick={previousTurn}>&lt;</button>
        <span> Round: {round} </span>
        <button onClick={nextTurn}>&gt;</button>
        <button onClick={() => setRound(round + 1)}>&gt;&gt;</button>
      </div>
    )
  }

function App() {
  const [participants, setParticipants] = useState([])
  const [round, setRound] = useState(1)
  const [turn, setTurn] = useState(0)

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

        {RoundTracker(round, setRound, turn, setTurn, participants.length)}

        {ParticipantTable(participants, setParticipants, turn)}
      </div>
    </>
  )
}

export default App
