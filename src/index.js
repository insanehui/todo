import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import 'babel-polyfill'

import './utils/css_preset.js'
import {css} from './utils/cssobj.js'

import App from './component/App.js'
import './icon/iconfont.css'

import store from './store.js'
// import registerServiceWorker from './registerServiceWorker';

css({
  '@global' : {
    '::-webkit-scrollbar' : {
      width : '9px',
      height : '9px',
      background : 'white',
      borderLeft : '1px solid #e8e8e8',
    },
    '::-webkit-scrollbar-thumb' : {
      borderWidth : '1px',
      borderStyle : 'solid',
      borderColor : '#fff',
      borderRadius : '6px',
      background : '#c9c9c9',
    }
  },
})

render( <Provider store={store}><App /></Provider> , document.getElementById('root'))
// registerServiceWorker()
