import React, { Component, Fragment } from 'react'
import './counter.scss'

export default class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activity: 0,
      rep: 0,
      showFinish: false,
      side: 'r',
      time: this.props.eHold
    }
  }

  delay = async (ms) => {
    return await new Promise((resolve) => setTimeout(resolve, ms))
  }

  countDown = async (sec) => {
    for (let i = 0; i < sec; i++) {
      await this.delay(1000)
      console.log('1 second later')
      this.setState({
        time: this.state.time - 1
      })
    }
  }

  doSet = async () => {
    const { activity } = this.state
    const { exercises, eHold, sHold, eReps, eRest } = this.props

    console.log(exercises.length, activity)
    if (activity >= exercises.length) {
      // Stretch
      console.log('stretching')

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

        // rest
        await this.countDown(eRest)
        this.setState({
          time: eHold
        })
      }
    }
  }

  doSides = async () => {
    const { activity, side } = this.state

    if ( side === 'r') {
      console.log('START RIGHT')
      await this.doSet()
      this.setState({
        rep: 0,
        side: 'l'
      })
    } else {
      console.log('START LEFT')
      await this.doSet()
      this.setState({
        activity: activity + 1,
        rep: 0,
        side: 'r'
      }, () => {
        // if first stretch, set new duration
        if (this.state.activity >= this.props.exercises.length) {
          this.setState({
            time: this.props.sHold
          })
        }

        // if last activity is over, show finish
        if (this.state.activity === this.props.exercises.length + this.props.stretches.length) {
          this.setState({
            showFinish: true
          })
        }
      })
    }
  }

  handleClick = () => {
    if (this.state.showFinish) {
      console.log('clicked and finished')
      this.setState({
        activity: 0,
        rep: 0,
        showFinish: false,
        side: 'r',
        time: this.props.eHold
      })
    } else {
      this.doSides()
    }
  }

  render () {
    const { exercises, stretches, eReps } = this.props

    return (
      <div className='counter'>
        <button className='counter_Button' onClick={this.handleClick}>
          {this.state.activity <= exercises.length - 1 ? (
            <Fragment>
              <div>
                {exercises[this.state.activity]}
              </div>
              <div>
                {`${this.state.rep} / ${eReps}`}
              </div>
          </Fragment>
          ) : (
            <div>
              {stretches[this.state.activity - exercises.length]}
            </div>
          )}
          {this.state.showFinish ? (
            <div>
              Great job! Restart?
            </div>
          ) : (
            <Fragment>
              <div>
                {this.state.time}
              </div>
              <div>
                {this.state.side}
              </div>
            </Fragment>
          )}
        </button>
      </div>
    )
  }
}
