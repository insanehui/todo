import React, { PureComponent } from 'react'
import {HotKeys} from 'react-hotkeys'
import Textarea from '../utils/components/Textarea.js'
import Sortable from '../utils/components/Sortable.js'

export default class App extends PureComponent {
  state = {
    todos : [
      'aaaaa',
      'bbbbb',
      'ccccc',
    ],
  }

  add = v=>{
    const {todos} = this.state 
    this.setState({ todos:[v, ...todos] })
  }

  render() {
    const {todos} = this.state 
    const {add} = this

    const main = {
      handlers : {
        'enter': e => {
          this.text.focus()
          e.preventDefault()
        }
      },
      style : {
        width : '100vw',
        height : '100vh',
      },
    }

    const input = {
      handlers : {
        'enter': e => {
          add(this.text.value)
          e.preventDefault()
          e.stopPropagation()
        }
      },
    }

    return <HotKeys {...main}>
      <HotKeys {...input}>
        <Textarea ref={el=>this.text=el}/>
      </HotKeys>
      <Sortable value={todos} onChange={v=>this.setState({ todos:v })}>
        {item=>{
          return <div>
            {item.value}
          </div>
        }}
      </Sortable>
    </HotKeys>
  }
}

