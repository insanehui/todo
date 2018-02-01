/*
 * 用来判断浏览器类型的工具
 */

export function is_ms(){ // 是否为微软系列的浏览器
  /*
   * 依赖一些潜规则，在需要精准判断的场合不适合使用
   */
  return !!navigator.msLaunchUri
}

const userAgent = window.navigator.userAgent

export function has_chrome(){
  return userAgent.indexOf('Chrome') !== -1
}

export function has_firefox(){
  return userAgent.indexOf('Firefox') !== -1
}
