/*
 * 基于react sortable hoc封装，最终成为一个标准的控件形态，使用更直接便捷
 * 省下了一系列hoc包装的过程
 * ps: react的controlled component的思想将'控件'的含义诠释到了极致！
 */
import React, { PureComponent, } from 'react'
import _ from 'lodash'

import {
  SortableContainer, SortableElement, arrayMove,
  // SortableHandle,
} from 'react-sortable-hoc';

export default class Sortable extends PureComponent {
  static defaultProps = {
    as : 'div', // 父容器的类型
    onChange : ()=>{},
  }

  children = ()=>{
    const {children} = this.props
    if ( !_.isArray(children) ) {
      return [children]
    } 
    return children
  }

  constructor(p) {
    super(p)
    const {as} = this.props
    const {children} = this
    this.Main = SortableContainer(as)
    for (const child of children()) {
      if ( _.isFunction(child) ) {
        this.Sub = SortableElement(child) // 只能有一个child是funtion
        break;
      } 
    }
  }

  getKey = (item, i)=>{
    const {itemKey} = this.props
    if ( !itemKey ) {
      return i
    } 
    if ( _.isFunction(itemKey) ) {
      return  itemKey(item)
    } 
    return _.get(item, itemKey)
  }

  Item = (item, i)=>{
    const {getKey, Sub} = this
    const {value, onChange} = this.props
    const props = {
      key : getKey(item, i),
      index : i,

      value : item,
      onChange : v=>{
        let newValue = [...value]
        newValue[i] = v
        onChange(newValue)
      },
      sortIndex : i, // 由于key和index会被过滤掉，因此再另外注入一个sortIndex
    }
    return <Sub {...props}/>
  }

  render() {
    const {Main, Item, children} = this // sortable容器
    const {
      value, onChange, children:__, 
      as, itemKey, // filter
      ...rest,
    } = this.props

    const props = {
      ...rest,
      onSortEnd : ({oldIndex, newIndex}) => {
        onChange(arrayMove(value, oldIndex, newIndex))
      },
    }

    return <Main {...props}>
      {children().map(child => {
        if ( _.isFunction(child) ) {
          return _.map(value, Item)
        } 
        return child
      })}
    </Main>
  }
}

