import { createStore, 
  applyMiddleware,
} from 'redux'
import thunk from 'redux-thunk'

import Freezer from 'freezer-js'
import {logger} from './utils/redux_middleware.js'

const freezer = new Freezer({
  preview_url : null,
})

const reducer_table = {
  set_preveiw_url(s, {preview_url}) {
    s.set({preview_url})
  },
}

function reducer(s = freezer.get(), a) {
  const {type, ...data} = a
  const f = reducer_table[type]
  f && f(s, data)
  return freezer.get()
}

const createStoreWithMiddleware = applyMiddleware(
  thunk,
  logger,
)(createStore)

export default createStoreWithMiddleware(reducer)
