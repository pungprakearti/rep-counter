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
      time: this.props.eHold,
      rest: false
    }
    this.clickable = true
    this.stop = false
  }

  // Add promise to setTimeout to use await
  delay = async (ms) => {
    return await new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Count down in seconds
  countDown = async (sec) => {
    for (let i = 0; i < sec; i++) {
      if (!this.stop) {
        await this.delay(1000)
        this.setState({
          time: this.state.time - 1
        })
      }
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
          rest: true,
          time: eRest
        })

        // Rest
        await this.countDown(eRest)
        this.setState({
          rest: false,
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

      // if the direction buttons aren't pressed
      if (this.state.activity === activity) {
        this.setState({
          rep: 0,
          side: 'left'
        })
        this.clickable = true

      } else {
        // directions were pressed
        this.setState({
          rep: 0
        })
      }

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

  handleDirection = (e) => {
    const { exercises, stretches, eHold, sHold } = this.props
    const { activity } = this.state
    let direction = 0
    let duration

    // Make main button clickable
    this.clickable = true

    // Boundaries for buttons
    if (e.target.dataset.direction === 'prev') {
      if (activity > 0) {
        direction = -1
      }

    } else {
      if (activity < exercises.length + stretches.length - 1) {
        direction = 1
      }
    }

    if (activity + direction > exercises.length - 1) {
      duration = sHold
    } else {
      duration = eHold
    }

    this.setState({
      activity: activity + direction,
      time: duration,
      side: 'right'
    }, () => {
      this.stop = true
    })
  }

  handleClick = () => {
    this.stop = false

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
    const { activity, rep, showFinish, side, time, rest } = this.state

    return (
      <div className='counter'>
        <button className={`counter_Button${rest ? ' rest' : ''}`} onClick={this.handleClick}>
          <div className='counter_ButtonInner'>
            <button className='counter_ButtonInnerPrev' data-direction='prev' onClick={this.handleDirection}>
              {'<'}
            </button>
            <button className='counter_ButtonInnerNext' data-direction='next' onClick={this.handleDirection}>
              {'>'}
            </button>
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
