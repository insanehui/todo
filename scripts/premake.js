/*
 * 同步utils
 */
const fs = require('fs-extra')
const path = require('path')
const d = path.resolve.bind(null, __dirname)
const _ = require('lodash')
const chalk = require('chalk')

function inlist(list, dest) { // 要在list里面
  // return _.includes(list, dest)
  return _.some(list, v=>{
    if ( v === dest ) {
      return true
    } 
    if ( v.startsWith(`${dest}${path.sep}`) ) { // 如果有文件包含该目录，也为true
      return true
    } 
    return false
  })
}

function newer(src, dest) {
  try {
    return fs.statSync(src).ctimeMs > fs.statSync(dest).ctimeMs
  } 
  catch(e) {
    return true 
  }
}

function isDir(src) {
  return fs.statSync(src).isDirectory()
}

async function copy(_from, to, list) {
  list = _.map(list, s=>d(to, s))
  const _to = d(to)
  await fs.copy(_from, _to, {filter : (src, dest)=>{
    const ok = inlist(list, dest) && ( isDir(src) || newer(src, dest) )
    if ( ok && 
      !( isDir(src) && fs.existsSync(dest) ) // 对于目录，如果不是新建的话，则不输出
    ) {
      console.log(`${src} -> ${dest}`)
    } 
    return ok
  }})
}

async function main() {
  const _src_ = 'C:/Users/guanghui/js_utils'

  await copy(_src_, '../src/utils', [
    'css_preset.js',
    'cssobj.js',
    'browser.js',
    'redux_middleware.js',
    'components/Textarea.js',
    'components/utils.js',
    'components/displayName.js',
    'components/Sortable.js',
    'web/webpack_node_env.js',
  ])

  console.log(chalk.cyan('premake done'))
}

main()

