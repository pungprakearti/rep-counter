import React, { Component } from 'react'
import './counter.scss'

export default class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activity: 0,
      advance: false,
      rep: 0,
      timeRemaining: 10,
      showFinish: false,
      step: 0
    }
    this.steps = [
      'Start',
      'Begin',
      'Finished!'
    ]
  }

  // start repetition and then rest
  countDown = (mode) => {
    let timeRemaining
    const { eHold, eRest, sHold } = this.props

    switch(mode) {
      case 'workE':
        timeRemaining = eHold
        break
      case 'workS':
        timeRemaining = sHold
        break
      default:
        timeRemaining = eRest
    }

    console.log(timeRemaining)

    this.setState({
      timeRemaining: timeRemaining
    }, () => {
      let interval = setInterval(() => {
        this.setState({
          timeRemaining: this.state.timeRemaining - 1
        }, () => {
          if (this.state.timeRemaining <= 0) {
            clearInterval(interval)
            console.log('killed interval')
            this.setState({
              rep: this.state.rep + 1
            })
          }
        })
      }, 100)
    })
  }

  startRest = () => {

  }

  handleSteps = (step) => {
    // start exercises
    // show first activity
  }

  handleClick = () => {
    const { activity } = this.state
    const { exercises, stretches, eHold, sHold} = this.props

    // if (activity === exercises.length + stretches.length - 1) {
    //   this.setState({
    //     showFinish: true
    //   })
    // } else {
    //   this.setState({
    //     activity: this.state.activity + 1
    //   })
    // }

    let timeRemaining

    // set hold time based on exercise or stretch
    if (activity === exercises.length + stretches.length - 1) {
      timeRemaining = sHold
    } else {
      timeRemaining = eHold
    }

    this.setState({
      timeRemaining: timeRemaining
    }, this.countDown('workS'))
  
  }

  render () {
    const { exercises, stretches, eReps } = this.props

    return (
      <div className='counter'>
        <button className='counter_Button' onClick={this.handleClick}>
          <div>
            {this.state.timeRemaining}
          </div>
          {this.state.activity <= exercises.length - 1 ? (
            <div>
              {exercises[this.state.activity]}
            </div>
          ) : (
            <div>
              {stretches[this.state.activity - exercises.length]}
            </div>
          )}
          <div>
            {`${this.state.rep} / ${eReps}`}
          </div>
          {this.state.showFinish && (
            <div>
              Finished!
            </div>
          )}
        </button>
      </div>
    )
  }
}

/*
1. click Start
2. show first activity
3. Ready and wait 5 seconds
4. Show name of exercise
5. Begin
6. Count down timeRemaining
7. At end, rep++
8. At last rep, go to new exercise set and repeat
9. after all exercises, start stretch sets
*/