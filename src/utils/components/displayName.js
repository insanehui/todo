/*
 * 取一个component的displayName，主要用于hoc的设计中
 */
import _ from 'lodash'

export const displayName = cmp => {
  if ( _.isString(cmp) ) { // 字符串直接返回
    return cmp
  } 

  return _.get(cmp, 'displayName') || _.get(cmp, 'name') || 'cmp'
}
