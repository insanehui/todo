// css preset，目的在于令各浏览器展示统一，预填一些常用的设置

import {css, bdbox, } from './cssobj.js'

css({
  '@global' : {
    '*' : {
      // box-sizing 使用border box
      ...bdbox,

      // 所有元素margin置为0
      margin:0,
    },  

    iframe : {
      border : 'none',
    },

    ':focus' : {
      outline: 'none',
    },
  },
})

