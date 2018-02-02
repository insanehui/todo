import React, { PureComponent } from 'react'
import {encode, decode} from 'arson'

import {HotKeys} from 'react-hotkeys'
import injectSheet from 'react-jss'
import Textarea from '../utils/components/Textarea.js'
import Sortable from '../utils/components/Sortable.js'

@injectSheet({
  cheader : {
    display : 'flex',
  },
  cbutton : {
    margin : '0 12px',
    padding: '3px 10px',
    fontSize: '12px',
    lineHeight: '20px',
    display : 'block',
    fontWeight : 600, 
    color : '#333',
    whiteSpace : 'nowrap', 
    verticalAlign : 'middle', 
    cursor : 'pointer', 
    userSelect : 'none',
    backgroundColor : '#eee',
    backgroundImage : 'linear-gradient(#fcfcfc, #eee)', 
    border : '1px solid #d5d5d5', 
    borderRadius : 3,
    '&:hover' : {
      backgroundColor : '#ddd',
      backgroundImage : 'linear-gradient(#eee, #ddd)', 
      border : '1px solid #ccc', 
    }, 
    '&:active' : {
      backgroundColor : '#dcdcdc',
      backgroundImage : 'none', 
      border : '1px solid #b5b5b5', 
      boxShadow : 'inset 0 2px 4px rgba(0,0,0,0.15)',
    }, 
  },
})
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

  save = ()=>{
    const {todos} = this.state 
    localStorage.todos = encode(todos)
  }

  componentDidMount(){
    this.setState({ todos: decode(localStorage.todos) || [] })
  }

  componentDidUpdate(){
    this.save()
  }

  render() {
    const {todos} = this.state 
    const {add, save} = this
    const {classes:{cheader, cbutton}} = this.props

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
          const {text} = this
          add(text.value)
          text.clear()
          e.preventDefault()
          e.stopPropagation()
        }
      },
    }

    return <HotKeys {...main}>
      <div className={cheader}>
        <HotKeys {...input}>
          <Textarea ref={el=>this.text=el}/>
        </HotKeys>
        <button className={cbutton} onClick={save}>保存</button>
      </div>
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

