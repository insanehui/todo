/*
 * 将一个控件的值与localStorage绑定
 * 只支持controlled，并且已经valuefy的组件
 */

import React, { PureComponent } from 'react'
import arson from 'arson'

import displayName from '../displayName/get.js'

const ident = x=>x

export const localStoragify = (encode = ident, decode = ident)=> key=> Control =>{

  class Storagified extends PureComponent{

    static displayName = `${process.env.NODE_ENV === 'development' ? 'localStoragify' : 'ls'}(${displayName(Control)})`

    static defaultProps = {
      onChange : ()=>{},
    }

    save = ()=>{
      const {value} = this.props
      localStorage[key] = encode(value)
    }

    componentDidMount(){
      // 取localStorage里的值，触发一次onChange
      const {onChange} = this.props
      // 只有当有值的时候，才触发
      const v = localStorage[key]
      if ( v !== undefined ) {
        onChange(decode(v))
      } 
      else {
        this.save()
      }
    }

    componentDidUpdate(){
      this.save()
    }

    render(){
      return <Control {...this.props} />
    }
  }

  return Storagified
}

export const localStorageArson = localStoragify(arson.encode, arson.decode)
