/*
 * 能自动伸缩的textarea, 支持controlled和uncontrolled的模式
 * uncontrolled直接使用定时刷新机制来调整尺寸
 */

import React, { PureComponent } from 'react'
import _ from 'lodash'
import css from 'dom-css'

import {merge_props as P} from './utils.js'

class Textarea extends PureComponent {

  state = {} // state用来存储动态的style

  intervalUpdate = ()=>{
    window.requestAnimationFrame(()=>{
      // 由于是uncontrolled的控件，直接从dom中取出value来更新shadow
      const {textarea} = this
      if ( !textarea ) {
        return
      } 
      const {value} = textarea
      this.update_shadow(value)

      this.intervalUpdate()
      // 如果没有被切换成为controlled的话，继续定时地检查刷新
      // if ( _.isUndefined(this.props.value)  ) {
      //   this.intervalUpdate()
      // } 
    })
  }

  update_shadow = value =>{ // 根据主输入框value的变化，更新shadow

    const {style} = this.props
    const {shadow, textarea} = this

    // shadow会沿用textarea一些关键的样式配置
    let keys = [
      'fontSize', 'fontFamily', 'whiteSpace', 'wordWrap', 
      'boxSizing', 
      'borderTopStyle', 'borderLeftStyle', 'borderRightStyle', 'borderBottomStyle',
      'borderTopColor', 'borderLeftColor', 'borderRightColor', 'borderBottomColor',
      'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom',
      'width',
      /*
       * 不需要取 'minWidth', 'maxWidth' ，因为这些属性只支持绝对值，如果传calc这样的表达式，将不能正常工作
       */
    ]

    const text_style = _.pick(window.getComputedStyle(textarea), keys)

    css(shadow, {
      ...style,
      ...text_style,

      position: 'absolute',
      top: -9999,

      // 以下是临时测试
      // border : `1px solid gray`,
      // top : 300,
      // left : 300,
      // backgroundColor : 'lightblue',
    })

    value = value || ''
    if ( value.endsWith('\n') || !value ) { // 如果末尾有空行，或者为空
      value += ' ' // 多加一个空格
    } 

    shadow.innerHTML = value
    const shadow_style = window.getComputedStyle(shadow)
    // console.log("computed", shadow_style)
    const {height} = shadow_style
    this.setState({ height})
  }

  componentDidMount(){
    // 部署一个辅助div
    const shadow = document.createElement('div')
    document.body.appendChild(shadow)
    this.shadow = shadow

    // 为了简单起见，统一使用定时器来控制吧
    this.intervalUpdate()

    // const {value} = this.props
    // 更新shadow
    // if ( _.isUndefined(value) ) { // uncontrolled
    //   this.intervalUpdate()
    // } 
    // else { // controlled
    //   this.update_shadow(this.props.value)
    // }
  }

  componentWillUnmount(){
    document.body.removeChild(this.shadow)
  }

  // componentWillReceiveProps(np){
  //   if ( np.value === this.props.value ) {
  //     return
  //   } 
  //   this.update_shadow(np.value)
  // }

  ref = el=>{ this.textarea = el }

  get value(){
    return _.get(this, ['textarea', 'value'])
  }

  get isControlled(){
    const {onChange} = this.props
    return !!onChange
  }

  focus = ()=>{ // focus方法
    let {textarea} = this
    textarea && textarea.focus()
  }

  blur = ()=>{ // blur方法
    let {textarea} = this
    textarea && textarea.blur()
  }

  clear = ()=>{ // clear方法
    if ( this.isControlled ) { // 如果是controlled，它没有权力自己清空自己的值
      return
    } 
    this.textarea && (this.textarea.value = '')
  }

  render() {
    const props = P({
      style:{
        ...this.state,
        overflow : 'hidden',
        resize : 'none',
      },
      spellCheck : false,
    }, this.props)
    return <textarea {...props} ref={this.ref}/>
  }
}

export default Textarea

