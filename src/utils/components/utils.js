// 提供一些常用的React组件编写的工具
import _ from 'lodash'
import React, { PureComponent } from 'react'
import {either} from 'ramda'

import {isDev} from '../web/webpack_node_env.js'
import displayName from './displayName/get.js'

export function merge_props(p0, p1){ // 两个props合并，主要是针对style再合并一层

  const style = (x=>{
    if ( !p0 || !p1 || !p0.style || !p1.style ) {
      return null
    } 

    return {
      style : {
        ...p0.style,
        ...p1.style,
      }
    }
  })()

  return {
    ...p0,
    ...p1,
    ...style,
  }
}

// TODO: 后续不再导出该函数，用addStyle更高级的函数来替代
export function merge_props_with_def_style(def_style, p){ // 返回新的props

  if ( !_.isObject(def_style) ) {
    return p
  }

  const st = p.style ? {
    style : {
      ...def_style,
      ...p.style,
    },
  } : { style : def_style }

  return {
    ...p,
    ...st,
  }
}

export class PS extends PureComponent { // 注：ps是一个很有争议的模式，慎用！使用时多思考用React标准的controlled和uncontrolled方式是否会更好
  constructor(p) {
    super(p)
    
    this.state = {...p}
  }

  componentWillReceiveProps(np) {
    this.setState({ ...np })
  }
}

// TODO: 后续分析一下有没有将其重写为支持多个style参数的必要
export const addStyle = (st = {}) => (Cmp = 'div') => { // => fn(Cmp0) => Cmp1，模仿redux里高阶组件的写法，使用柯里化的形式
  
  class styled extends PureComponent {

    render() {
      const p = this.props 
      return <Cmp {...merge_props_with_def_style(st, p)} />
    }
  }

  return styled
}

const isCmp =  either(_.isFunction, _.isString) // 判断一个参数是否代表一个组件

/*
 * 给组件加样式的函数（较新）
 * 注: 是否有必要搞一个props版？
 */
export function styler(para = {}, name1) { 
  /*
   * name是一个可选的名字
   */

  if (isCmp(para)) { // 如果参数已经是一个组件，则直接返回
    return para
  } 

  // 否则，储存基因（即样式）
  const style = para

  return (next = 'div', name2) =>{
    const name = name2 || name1

    if ( isCmp(next) ) { // 如果next是一个组件，则返回一个新组件
      const Cmp = next // 赋给一个大写的变量，这是React jsx的一个潜规则

      class Styler extends PureComponent {
        static displayName = isDev ? (name || `styler(${displayName(Cmp)})`) : null // 只在测试环境显示displayName

        render() {
          const p = this.props 
          return <Cmp {...merge_props_with_def_style(style, p)} />
        }
      }
      return Styler
    } 

    const sum = {...style, ...next} // 合并样式
    return styler(sum, name)
  }
}

export const rename = _.curry((Cmp, name)=>{ // 将组件改名
  /*
   * 但是这样又会多出一阶层次，所以感觉该函数的实用性不高
   * 实际中如果有命名的需求，可以直接给displayName属性赋值，不通过高阶组件的形式
   */
  class New extends PureComponent {
    static displayName = name
    render() {
      return <Cmp {...this.props} />
    }
  }
  return New
})

export const addProps = _.curry((p0, Cmp)=>{ // 2017年4月9日 尝试使用柯里化，看看是否有实用性

  class New extends PureComponent {
    render() {
      const p = this.props 
      return <Cmp {...merge_props(p0, p)} />
    }
  }

  return New

})

export function get_xy(event, el){ // 根据event（通常是鼠标事件），计算出其相对于html元素的client坐标
  const {top, left} = el.getBoundingClientRect()
  const x = event.clientX - left
  const y = event.clientY - top
  return {x, y}
}

export function parse_svg_transform(t){ // 将一个svg的transform字段解析成结构化的数据
  // 用状态机来实现
  // TODO: 后续可能要用数字来表示state，用于处理括号嵌套的场景
  const res = {}

  if ( !_.isString(t) ) {
    return res
  } 

  const space = /\s/

  let buf = ''
  let state = 'normal' // 表示下一步的状态，可选状态还有item

  function push(item) {
    const key = item.slice(0, item.indexOf('('))
    res[key] = item
  }

  for(let i = 0; i<t.length; i++){
    const c = t[i]

    // 改变状态部分
    if ( state ==='normal') {
      if ( !space.test(c) ) { // 如果非空白字符
        state = 'item'
      } 
    } 
    else if ( state === 'item' ) {
      if ( buf.endsWith(')') ) {
        state = 'normal'
      } 
    } 

    // 业务逻辑部分
    if ( buf && state === 'normal' ){ 
      push(buf)
      buf = ''
    }
    else { 
      buf += c
    }
  }

  if ( buf ) {
    push(buf)
  } 

  return res
}

// 用于叠加svg transform的函数
export const transformer = expr => (Cmp = 'g') => {

  let transform0 = parse_svg_transform(expr)

  class Transformer extends PureComponent {

    render() {
      const p = this.props 
      const transform1 = parse_svg_transform(p.transform)
      const transform = _.map({...transform0, ...transform1}).join(' ')

      const p1 = {
        ...p,
        transform,
      }

      return <Cmp {...p1} />
    }
  }

  return Transformer
}

// 用于svg的translate
export const translator = (x, y) => (Cmp = 'g') => transformer(`translate(${x}, ${y})`)(Cmp)

export const scaler = (x, y) => (Cmp = 'g' ) => transformer(`scale(${x}${_.isUndefined(y) ? '' : `, ${y}`})`)(Cmp)

// ========================= redux相关 =============================

// [deprecated] 移至modash
const decorative = fn => (t, n, d) => {
  const {value} = d
  d.value = fn(value)
}

// [deprecated] 移到redux.js
export const pick_store = (...keys) => fn => s => {
  return {
    ..._.pick(s, keys),
    ...(fn && fn(s)),
  }
}

// [deprecated] 移到redux.js
export const pick_store_decor = (...props) => decorative(pick_store(...props))

// [deprecated] 移到redux.js
export const inject_method = method_lib => fn => s => {
  return {
    ..._.mapValues(method_lib, method=>method(s)),
    ...(fn && fn(s)),
  }
}

// [deprecated] 移到redux.js
export const inject_method_dec = method_lib => (t, n, d)=> {
  /*
   * inject_method的decorator版
   * 例：
  const map = {
    @inject({method1}) s(s){...},
  }
  */ 
  const {value:fn} = d
  d.value = s=>{
    return {
      ..._.mapValues(method_lib, method=>method(s)),
      ...(fn && fn(s)),
    }
  }
}

// [deprecated] 移至redux.js
export const inject_action_decor = (...methods) => (t, n, desc) => {
  /*
   * 生成直接对应action的方法，作为装饰器使用
   */
  const {value:fn} = desc

  desc.value = d => {
    let obj = {}
    for (const method of methods) {
      obj[method] = para =>{
        return d({type : method, ...para})
      }
    }

    return {
      ...obj,
      ...(fn && fn(d)),
    }
  }
}

/*
 * [注：建议用thunker代替，为本函数的增加版]
 * 给dm生成直接与reducer对应的method
 * const dm = gen_method('aa', 'bb')(d=>{...})
 */
export const gen_method = (...methods) => fn => d => {
  let obj = {}
  for (const method of methods) {
    obj[method] = para =>{
      return d({type : method, ...para})
    }
  }

  return {
    ...obj,
    ...(fn && fn(d)),
  }
}

/*
 * 为get_method的增加版
 * TODO: 考虑如何支持异步thunk，以及异常处理
 */
export const thunker = (...methods) => (thunks={}, fn) => d => { // 更方便地使用thunk
  let lib = {} // 用来装方法的库
  for (const method of methods) {
    lib[method] = para =>{
      return d({type : method, ...para})
    }
  }

  thunks = _.mapValues(thunks, thunk=>{ // 注意，研究一下这里如果thunk是异步操作，如何处理？
    return (...para)=>{
      d((d, getState) => {
        const s = getState()
        return thunk(lib, s, getState, ...para)
      })
    }
  })

  return {
    ...lib,
    ...thunks,
    ...(fn && fn(d)),
  }
}


/*
 * 令dm自带一个set store的方法，会调用set store方法
 */
export const set_store_enable = (action_name = 'set') => fn => d => {
  return {
    set_store : data=>{
      d({ type: 'set', data,})
    },
    ...(fn && fn(d)),
  }
}

/*
 * 当store是一个freezer对象时的一个简单set的reducer
 */
export const freezer_set_store = (s, a) => {
  const {data} = a
  s = s.set(data)
}


