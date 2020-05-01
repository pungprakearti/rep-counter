import React, { Component, Fragment } from 'react'
import './counter.scss'

export default class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activity: 0,
      rep: 0,
      showFinish: false,
      side: 'right',
      time: this.props.eHold
    }
    this.clickable = true
  }

  // Add promise to setTimeout to use await
  delay = async (ms) => {
    return await new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Count down in seconds
  countDown = async (sec) => {
    for (let i = 0; i < sec; i++) {
      await this.delay(1000)
      this.setState({
        time: this.state.time - 1
      })
    }
  }

  doSet = async () => {
    const { activity } = this.state
    const { exercises, eHold, sHold, eReps, eRest } = this.props

    if (activity >= exercises.length) {
      // Stretch
      await this.countDown(sHold)
      this.setState({
        time: sHold
      })

    } else {
      // Exercise
      for (let i = 0; i < eReps; i++) {
        this.setState({
          rep: this.state.rep + 1,
        })

        // 1 rep
        await this.countDown(eHold)
        this.setState({
          time: eRest
        })

        // Rest
        await this.countDown(eRest)
        this.setState({
          time: eHold
        })
      }
    }
  }

  doSides = async () => {
    const { activity, side } = this.state
    const { exercises, stretches } = this.props

    if ( side === 'right') {
      await this.doSet()
      this.setState({
        rep: 0,
        side: 'left'
      })
      this.clickable = true
    } else {
      await this.doSet()
      this.setState({
        activity: activity + 1,
        rep: 0,
        side: 'right'
      }, () => {
        this.clickable = true

        // First stretch, set new duration
        if (this.state.activity >= exercises.length) {
          this.setState({
            time: this.props.sHold
          })
        }

        // Last activity is over, show finish
        if (this.state.activity === exercises.length + stretches.length) {
          this.setState({
            showFinish: true
          })
        }
      })
    }
  }

  handleClick = () => {
    if (this.clickable) {
      // Reset all variables
      if (this.state.showFinish) {
        this.setState({
          activity: 0,
          rep: 0,
          showFinish: false,
          side: 'right',
          time: this.props.eHold
        })
      } else {
        this.clickable = false
        this.doSides()
      }
    }
  }

  render () {
    const { exercises, stretches, eReps } = this.props
    const { activity, rep, showFinish, side, time  } = this.state

    return (
      <div className='counter'>
        <button className='counter_Button' onClick={this.handleClick}>
          <div className='counter_ButtonInner'>
            {activity <= exercises.length - 1 ? (
              <Fragment>
                <div className='counter_ButtonInnerActivity'>
                  {exercises[activity]}
                </div>
                <div className='counter_ButtonInnerRep'>
                  {`${rep} / ${eReps}`}
                </div>
            </Fragment>
            ) : (
              <div>
                {stretches[activity - exercises.length]}
              </div>
            )}
            {showFinish ? (
              <div>
                Great job! Restart?
              </div>
            ) : (
              <Fragment>
                <div className='counter_ButtonInnerTime'>
                  <div className='counter_ButtonInnerTimeSec'>
                    {time}
                  </div>
                  <div className='counter_ButtonInnerTimeS'>
                    s
                  </div>
                </div>
                <div className='counter_ButtonInnerSide'>
                  {side}
                </div>
              </Fragment>
            )}
          </div>
        </button>
      </div>
    )
  }
}
