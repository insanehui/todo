import React, { PureComponent } from 'react'
import {HotKeys} from 'react-hotkeys'
import Textarea from '../utils/components/Textarea.js'

export default class App extends PureComponent {
  render() {
    const props = {
      handlers : {
        'enter': () => console.log('haha')
      },
      style : {
        width : '100vw',
        height : '100vh',
      },
    }

    return <HotKeys {...props}>
      <Textarea />
    </HotKeys>
  }
}

