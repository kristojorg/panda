import { createElement, forwardRef } from 'react'
import { mergeCss } from '../css/css.mjs';
import { panda } from './factory.mjs';
import { getGridItemStyle } from '../patterns/grid-item.mjs';

export const GridItem = /* @__PURE__ */ forwardRef(function GridItem(props, ref) {
  const { colSpan, rowSpan, colStart, rowStart, colEnd, rowEnd, ...restProps } = props
const styleProps = getGridItemStyle({colSpan, rowSpan, colStart, rowStart, colEnd, rowEnd})

const mergedProps = { ref, ...styleProps, ...restProps }

return createElement(panda.div, mergedProps)
  })