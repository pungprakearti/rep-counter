import React, { Component } from 'react'
import './counter.scss'

export default class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activity: 0,
      rep: 0,
      timeRemaining: 10,
      showFinish: false,
    }
  }

  // start repetition and then rest
  countDown = (time, repMax) => {
    console.log('counting down')

    this.setState({
      timeRemaining: time
    }, () => {
      let interval = setInterval(() => {
        this.setState({
          timeRemaining: this.state.timeRemaining - 1
        }, () => {
          if (this.state.timeRemaining <= 0) {
            clearInterval(interval)
            console.log('killed interval - work')

            // rest time
            this.setState({
              timeRemaining: 5
            }, () => {
              let interval = setInterval(() => {
                this.setState({
                  timeRemaining: this.state.timeRemaining - 1
                }, () => {
                  if (this.state.timeRemaining <= 0) {
                    clearInterval(interval)
                    console.log('killed interval - rest')
                    this.setState({
                      rep: this.state.rep + 1
                    }, () => {
                      if (this.state.rep < repMax) {
                        this.countDown(time, repMax)
                      }
                    })
                  }
                })
              }, 100)
            })

          }
        })
      }, 100)
    })
  }

  doSet = (activity) => {
    const { eReps } = this.props

    console.log('do set')
    const { exercises, stretches, eHold, sHold } = this.props
    // const { rep } = this.state

    if (activity === exercises.length + stretches.length - 1) {
      // Stretch
        this.countDown(sHold, 1)

      // Exercise
      } else {
        this.countDown(eHold, eReps)
      }

  }

  handleClick = () => {
    const { activity } = this.state

    this.doSet(activity)
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

todo:
https://stackoverflow.com/questions/52184291/async-await-with-setinterval

create delay function to clean up setIntervals.
*/