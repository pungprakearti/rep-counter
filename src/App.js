import React from 'react'
import Counter from './Counter'

function App() {
  /*
  This is an app created to help keep track of exercises and stretches.
  
  At the time of writing this, I have patellar tracking disorder in my knee.

  The exercises require you to maintain a certain position for a certain
  amount of repetitions.
  
  After the exercises are stretches.
  */ 

  // data for the component looks like this:
  const exercises = [
    'Quad sets',
    'Mini squats',
    'Front straight leg raises',
    'Inside straight leg raises',
    'Outside straight leg raises',
    'Back straight leg raises',
    'Standing knee bends',
    'One leg knee bends',
  ]
  
  const stretches = [
    'Standing quad stretch',
    'Hamstring doorway stretch',
    'Hip rotator stretch',
    'Hamstring doorway stretch',
    'IT band stretch',
    'Calf stretch',
  ]

  // these are the amounts of reps and time to hold positions in seconds.
  const eHold = 10
  const eReps = 12
  const eRest = 5
  const sHold = 30

  return (
    <div className="App">
      <Counter
        exercises={exercises}
        stretches={stretches}
        eHold={eHold}
        eReps={eReps}
        eRest={eRest}
        sHold={sHold}
      />
    </div>
  )
}

export default App
