import React, { PureComponent } from 'react'
import {HotKeys} from 'react-hotkeys'
import Textarea from '../utils/components/Textarea.js'

export default class App extends PureComponent {
  render() {
    return <HotKeys>
      <Textarea />
    </HotKeys>
  }
}

