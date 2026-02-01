import { useState } from 'react'
import './App.css'
import TagManager from './TagManager.jsx'

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

function addConditionToParticipant(participants, setParticipants, participantIndex, newCondition) {
    setParticipants(participants.map((participant, index) => 
        index === participantIndex ? {...participant, conditions: [...participant.conditions, newCondition]} : participant
    ))
}

function removeConditionFromParticipant(participants, setParticipants, participantIndex, conditionIndex) {
    setParticipants(participants.map((participant, index) => 
        index === participantIndex ? {
            ...participant, 
            conditions: (participant.conditions || []).filter((_, i) => i !== conditionIndex),
          }
        : participant
    ))
}

function addTag(tags, setTags, newTag) {
    setTags([...tags, newTag])
}

function removeTag(tags, setTags, tagIndex) {
    setTags(tags.filter((_, index) => index !== tagIndex))
}

function ParticipantTable({ participants, setParticipants, turn, tags, setTags }) {
    const [tagManagerParticpantIndex, setTagManagerParticpantIndex] = useState(null);

    return (
      <>
      <table>
        <thead>
          <tr>
            <th>Initiative</th>
            <th>Name</th>
            <th>Conditions</th>
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
                <div className='conditions'>
                  <button onClick={() => setTagManagerParticpantIndex(index)}>+</button>
                  {participant.conditions?.map((condition, conditionIndex) => (
                      <span key={conditionIndex} className="condition">{condition}
                        <button
                          type="button"
                          className='condition-remove'
                          onClick={() => removeConditionFromParticipant(participants, setParticipants, index, conditionIndex)}>
                          ×
                        </button>
                      </span>
                  ))}
                </div>
              </td>
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
      { tagManagerParticpantIndex !== null &&
        <TagManager 
          tags={tags || []}
          onAddExistingCondition={(condition) => addConditionToParticipant(participants, setParticipants, tagManagerParticpantIndex, condition)}
          onAddNewCondition={(condition) => {
            addConditionToParticipant(participants, setParticipants, tagManagerParticpantIndex, condition)
            addTag(tags, setTags, condition)
          }}
          onClose={() => setTagManagerParticpantIndex(null)}
        />
      }
      </>
    )
  }

function RoundTracker({ round, setRound, turn, setTurn, size }) {
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
  const [tags, setTags] = useState([])

  const addParticipant = () => {
    const newParticipant = { initiative: 0, name: '', hpCurrent: 0, hpMax: 0, conditions: [] }
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

        <RoundTracker 
            round={round} 
            setRound={setRound} 
            turn={turn} 
            setTurn={setTurn} 
            size={participants.length} 
        />

        <ParticipantTable 
            participants={participants} 
            setParticipants={setParticipants} 
            turn={turn} 
            tags={tags}
            setTags={setTags}
        />
      </div>
    </>
  )
}

export default App
