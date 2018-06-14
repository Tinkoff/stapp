import React, { Component } from 'react'
import styled from 'styled-components'

const Counter = styled.span`
  display: inline-block;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  line-height: 32px;
  text-align: center;
  background: #ccc;
`

export class RenderCount extends Component {
  count = 0

  render () {
    return <Counter>{ ++this.count }</Counter>
  }
}
