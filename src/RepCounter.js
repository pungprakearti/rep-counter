import React, { Component } from 'react'

export default class RepCounter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activityNum: 0,
      repNum: 0
    }

    this.countClick = this.countClick.bind(this)
  }

  countClick() {
    this.setState({ repNum: this.state.repNum + 1 })
  }

  render() {
    return (
      <div className='outer' onClick={this.countClick}>
        {this.state.repNum}
      </div>
    )
  }
}