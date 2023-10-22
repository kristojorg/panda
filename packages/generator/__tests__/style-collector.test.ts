import { describe, expect, test } from 'vitest'
import { createRuleProcessor } from './fixture'
import type { Dict } from '@pandacss/types'
import { createGeneratorContext } from '@pandacss/fixture'

const css = (styles: Dict) => {
  const ctx = createGeneratorContext()
  ctx.hashFactory.processAtomic(styles)
  ctx.styleCollector.collect(ctx.hashFactory)
  return ctx.styleCollector.atomic
}

const recipe = (name: string, styles: Dict) => {
  const ctx = createGeneratorContext()
  if ('slots' in styles) {
    ctx.hashFactory.processSlotRecipe(name, styles)
    ctx.styleCollector.collect(ctx.hashFactory)
    return {
      base: ctx.styleCollector.recipes_slots_base.get(name)!,
      variants: ctx.styleCollector.recipes_slots.get(name)!,
    }
  }

  ctx.hashFactory.processRecipe(name, styles)
  ctx.styleCollector.collect(ctx.hashFactory)
  return { base: ctx.styleCollector.recipes_base.get(name)!, variants: ctx.styleCollector.recipes.get(name)! }
}

const cva = (styles: Dict) => {
  const ctx = createGeneratorContext()
  if ('slots' in styles) {
    ctx.hashFactory.processAtomicSlotRecipe(styles)
  }

  ctx.hashFactory.processAtomicRecipe(styles)
  ctx.styleCollector.collect(ctx.hashFactory)
  return ctx.styleCollector.atomic
}

describe('hash factory', () => {
  test('css', () => {
    const result = css({
      color: 'red !important',
      border: '1px solid token(red.100)',
      bg: 'blue.300',
      textStyle: 'headline.h1',
      w: [1, 2, undefined, null, 3],
      fontSize: {
        base: 'xs',
        sm: 'sm',
        _hover: {
          base: 'md',
          md: 'lg',
          _focus: 'xl',
        },
        _dark: '2xl',
      },
      sm: {
        color: 'yellow',
        backgroundColor: {
          base: 'red',
          _hover: 'green',
        },
      },
      "&[data-attr='test']": {
        color: 'green',
        _expanded: {
          color: 'purple',
          '.target &': {
            color: {
              base: 'cyan',
              _opened: 'orange',
              _xl: 'pink',
            },
          },
        },
      },
    })

    expect(result).toMatchInlineSnapshot(
      `
      Set {
        {
          "className": "text_red",
          "conditions": undefined,
          "entry": {
            "prop": "color",
            "value": "red !important",
          },
          "hash": "color]___[value:red !important",
          "layer": undefined,
          "result": {
            ".text_red\\\\!": {
              "color": "red !important",
            },
          },
        },
        {
          "className": "border_1px_solid_token\\\\(red\\\\.100\\\\)",
          "conditions": undefined,
          "entry": {
            "prop": "border",
            "value": "1px solid token(red.100)",
          },
          "hash": "border]___[value:1px solid token(red.100)",
          "layer": undefined,
          "result": {
            ".border_1px_solid_token\\\\(red\\\\.100\\\\)": {
              "border": "1px solid token(red.100)",
            },
          },
        },
        {
          "className": "bg_blue\\\\.300",
          "conditions": undefined,
          "entry": {
            "prop": "background",
            "value": "blue.300",
          },
          "hash": "background]___[value:blue.300",
          "layer": undefined,
          "result": {
            ".bg_blue\\\\.300": {
              "background": "var(--colors-blue-300)",
            },
          },
        },
        {
          "className": "textStyle_headline\\\\.h1",
          "conditions": undefined,
          "entry": {
            "prop": "textStyle",
            "value": "headline.h1",
          },
          "hash": "textStyle]___[value:headline.h1",
          "layer": "compositions",
          "result": {
            ".textStyle_headline\\\\.h1": {
              "fontSize": "2rem",
              "fontWeight": "var(--font-weights-bold)",
            },
          },
        },
        {
          "className": "w_1",
          "conditions": undefined,
          "entry": {
            "prop": "width",
            "value": "1",
          },
          "hash": "width]___[value:1",
          "layer": undefined,
          "result": {
            ".w_1": {
              "width": "var(--sizes-1)",
            },
          },
        },
        {
          "className": "fs_xs",
          "conditions": undefined,
          "entry": {
            "prop": "fontSize",
            "value": "xs",
          },
          "hash": "fontSize]___[value:xs",
          "layer": undefined,
          "result": {
            ".fs_xs": {
              "fontSize": "var(--font-sizes-xs)",
            },
          },
        },
        {
          "className": "dark\\\\:fs_2xl",
          "conditions": [
            {
              "raw": "[data-theme=dark] &, .dark &, &.dark, &[data-theme=dark]",
              "type": "combinator-nesting",
              "value": "[data-theme=dark] &, .dark &, &.dark, &[data-theme=dark]",
            },
          ],
          "entry": {
            "cond": "_dark",
            "prop": "fontSize",
            "value": "2xl",
          },
          "hash": "fontSize]___[value:2xl]___[cond:_dark",
          "layer": undefined,
          "result": {
            ".dark\\\\:fs_2xl": {
              "[data-theme=dark] &, .dark &, &.dark, &[data-theme=dark]": {
                "fontSize": "var(--font-sizes-2xl)",
              },
            },
          },
        },
        {
          "className": "\\\\[\\\\&\\\\[data-attr\\\\=\\\\'test\\\\'\\\\]\\\\]\\\\:text_green",
          "conditions": [
            {
              "raw": "&[data-attr='test']",
              "type": "self-nesting",
              "value": "&[data-attr='test']",
            },
          ],
          "entry": {
            "cond": "&[data-attr='test']",
            "prop": "color",
            "value": "green",
          },
          "hash": "color]___[value:green]___[cond:&[data-attr='test']",
          "layer": undefined,
          "result": {
            ".\\\\[\\\\&\\\\[data-attr\\\\=\\\\'test\\\\'\\\\]\\\\]\\\\:text_green": {
              "&[data-attr='test']": {
                "color": "green",
              },
            },
          },
        },
        {
          "className": "hover\\\\:fs_md",
          "conditions": [
            {
              "raw": "&:is(:hover, [data-hover])",
              "type": "self-nesting",
              "value": "&:is(:hover, [data-hover])",
            },
          ],
          "entry": {
            "cond": "_hover",
            "prop": "fontSize",
            "value": "md",
          },
          "hash": "fontSize]___[value:md]___[cond:_hover",
          "layer": undefined,
          "result": {
            ".hover\\\\:fs_md": {
              "&:is(:hover, [data-hover])": {
                "fontSize": "var(--font-sizes-md)",
              },
            },
          },
        },
        {
          "className": "\\\\[\\\\&\\\\[data-attr\\\\=\\\\'test\\\\'\\\\]\\\\]\\\\:expanded\\\\:text_purple",
          "conditions": [
            {
              "raw": "&[data-attr='test']",
              "type": "self-nesting",
              "value": "&[data-attr='test']",
            },
            {
              "raw": "&:is([aria-expanded=true], [data-expanded], [data-state=\\"expanded\\"])",
              "type": "self-nesting",
              "value": "&:is([aria-expanded=true], [data-expanded], [data-state=\\"expanded\\"])",
            },
          ],
          "entry": {
            "cond": "&[data-attr='test']<___>_expanded",
            "prop": "color",
            "value": "purple",
          },
          "hash": "color]___[value:purple]___[cond:&[data-attr='test']<___>_expanded",
          "layer": undefined,
          "result": {
            ".\\\\[\\\\&\\\\[data-attr\\\\=\\\\'test\\\\'\\\\]\\\\]\\\\:expanded\\\\:text_purple": {
              "&[data-attr='test']": {
                "&:is([aria-expanded=true], [data-expanded], [data-state=\\"expanded\\"])": {
                  "color": "purple",
                },
              },
            },
          },
        },
        {
          "className": "hover\\\\:focus\\\\:fs_xl",
          "conditions": [
            {
              "raw": "&:is(:hover, [data-hover])",
              "type": "self-nesting",
              "value": "&:is(:hover, [data-hover])",
            },
            {
              "raw": "&:is(:focus, [data-focus])",
              "type": "self-nesting",
              "value": "&:is(:focus, [data-focus])",
            },
          ],
          "entry": {
            "cond": "_hover<___>_focus",
            "prop": "fontSize",
            "value": "xl",
          },
          "hash": "fontSize]___[value:xl]___[cond:_hover<___>_focus",
          "layer": undefined,
          "result": {
            ".hover\\\\:focus\\\\:fs_xl": {
              "&:is(:hover, [data-hover])": {
                "&:is(:focus, [data-focus])": {
                  "fontSize": "var(--font-sizes-xl)",
                },
              },
            },
          },
        },
        {
          "className": "\\\\[\\\\&\\\\[data-attr\\\\=\\\\'test\\\\'\\\\]\\\\]\\\\:expanded\\\\:\\\\[\\\\.target_\\\\&\\\\]\\\\:text_cyan",
          "conditions": [
            {
              "raw": "&[data-attr='test']",
              "type": "self-nesting",
              "value": "&[data-attr='test']",
            },
            {
              "raw": "&:is([aria-expanded=true], [data-expanded], [data-state=\\"expanded\\"])",
              "type": "self-nesting",
              "value": "&:is([aria-expanded=true], [data-expanded], [data-state=\\"expanded\\"])",
            },
            {
              "raw": ".target &",
              "type": "parent-nesting",
              "value": ".target &",
            },
          ],
          "entry": {
            "cond": "&[data-attr='test']<___>_expanded<___>.target &",
            "prop": "color",
            "value": "cyan",
          },
          "hash": "color]___[value:cyan]___[cond:&[data-attr='test']<___>_expanded<___>.target &",
          "layer": undefined,
          "result": {
            ".\\\\[\\\\&\\\\[data-attr\\\\=\\\\'test\\\\'\\\\]\\\\]\\\\:expanded\\\\:\\\\[\\\\.target_\\\\&\\\\]\\\\:text_cyan": {
              "&[data-attr='test']": {
                "&:is([aria-expanded=true], [data-expanded], [data-state=\\"expanded\\"])": {
                  ".target &": {
                    "color": "cyan",
                  },
                },
              },
            },
          },
        },
        {
          "className": "\\\\[\\\\&\\\\[data-attr\\\\=\\\\'test\\\\'\\\\]\\\\]\\\\:expanded\\\\:\\\\[\\\\.target_\\\\&\\\\]\\\\:_opened_orange",
          "conditions": [
            {
              "raw": "&[data-attr='test']",
              "type": "self-nesting",
              "value": "&[data-attr='test']",
            },
            {
              "raw": "&:is([aria-expanded=true], [data-expanded], [data-state=\\"expanded\\"])",
              "type": "self-nesting",
              "value": "&:is([aria-expanded=true], [data-expanded], [data-state=\\"expanded\\"])",
            },
            {
              "raw": ".target &",
              "type": "parent-nesting",
              "value": ".target &",
            },
          ],
          "entry": {
            "cond": "&[data-attr='test']<___>_expanded<___>.target &",
            "prop": "_opened",
            "value": "orange",
          },
          "hash": "_opened]___[value:orange]___[cond:&[data-attr='test']<___>_expanded<___>.target &",
          "layer": undefined,
          "result": {
            ".\\\\[\\\\&\\\\[data-attr\\\\=\\\\'test\\\\'\\\\]\\\\]\\\\:expanded\\\\:\\\\[\\\\.target_\\\\&\\\\]\\\\:_opened_orange": {
              "&[data-attr='test']": {
                "&:is([aria-expanded=true], [data-expanded], [data-state=\\"expanded\\"])": {
                  ".target &": {
                    "_opened": "orange",
                  },
                },
              },
            },
          },
        },
        {
          "className": "\\\\[\\\\&\\\\[data-attr\\\\=\\\\'test\\\\'\\\\]\\\\]\\\\:expanded\\\\:\\\\[\\\\.target_\\\\&\\\\]\\\\:_xl_pink",
          "conditions": [
            {
              "raw": "&[data-attr='test']",
              "type": "self-nesting",
              "value": "&[data-attr='test']",
            },
            {
              "raw": "&:is([aria-expanded=true], [data-expanded], [data-state=\\"expanded\\"])",
              "type": "self-nesting",
              "value": "&:is([aria-expanded=true], [data-expanded], [data-state=\\"expanded\\"])",
            },
            {
              "raw": ".target &",
              "type": "parent-nesting",
              "value": ".target &",
            },
          ],
          "entry": {
            "cond": "&[data-attr='test']<___>_expanded<___>.target &",
            "prop": "_xl",
            "value": "pink",
          },
          "hash": "_xl]___[value:pink]___[cond:&[data-attr='test']<___>_expanded<___>.target &",
          "layer": undefined,
          "result": {
            ".\\\\[\\\\&\\\\[data-attr\\\\=\\\\'test\\\\'\\\\]\\\\]\\\\:expanded\\\\:\\\\[\\\\.target_\\\\&\\\\]\\\\:_xl_pink": {
              "&[data-attr='test']": {
                "&:is([aria-expanded=true], [data-expanded], [data-state=\\"expanded\\"])": {
                  ".target &": {
                    "_xl": "pink",
                  },
                },
              },
            },
          },
        },
        {
          "className": "sm\\\\:w_2",
          "conditions": [
            {
              "name": "breakpoint",
              "params": "screen and (min-width: 40em)",
              "raw": "sm",
              "rawValue": "@media screen and (min-width: 40em)",
              "type": "at-rule",
              "value": "sm",
            },
          ],
          "entry": {
            "cond": "sm",
            "prop": "width",
            "value": "2",
          },
          "hash": "width]___[value:2]___[cond:sm",
          "layer": undefined,
          "result": {
            ".sm\\\\:w_2": {
              "@media screen and (min-width: 40em)": {
                "width": "var(--sizes-2)",
              },
            },
          },
        },
        {
          "className": "sm\\\\:fs_sm",
          "conditions": [
            {
              "name": "breakpoint",
              "params": "screen and (min-width: 40em)",
              "raw": "sm",
              "rawValue": "@media screen and (min-width: 40em)",
              "type": "at-rule",
              "value": "sm",
            },
          ],
          "entry": {
            "cond": "sm",
            "prop": "fontSize",
            "value": "sm",
          },
          "hash": "fontSize]___[value:sm]___[cond:sm",
          "layer": undefined,
          "result": {
            ".sm\\\\:fs_sm": {
              "@media screen and (min-width: 40em)": {
                "fontSize": "var(--font-sizes-sm)",
              },
            },
          },
        },
        {
          "className": "sm\\\\:text_yellow",
          "conditions": [
            {
              "name": "breakpoint",
              "params": "screen and (min-width: 40em)",
              "raw": "sm",
              "rawValue": "@media screen and (min-width: 40em)",
              "type": "at-rule",
              "value": "sm",
            },
          ],
          "entry": {
            "cond": "sm",
            "prop": "color",
            "value": "yellow",
          },
          "hash": "color]___[value:yellow]___[cond:sm",
          "layer": undefined,
          "result": {
            ".sm\\\\:text_yellow": {
              "@media screen and (min-width: 40em)": {
                "color": "yellow",
              },
            },
          },
        },
        {
          "className": "sm\\\\:bg_red",
          "conditions": [
            {
              "name": "breakpoint",
              "params": "screen and (min-width: 40em)",
              "raw": "sm",
              "rawValue": "@media screen and (min-width: 40em)",
              "type": "at-rule",
              "value": "sm",
            },
          ],
          "entry": {
            "cond": "sm",
            "prop": "backgroundColor",
            "value": "red",
          },
          "hash": "backgroundColor]___[value:red]___[cond:sm",
          "layer": undefined,
          "result": {
            ".sm\\\\:bg_red": {
              "@media screen and (min-width: 40em)": {
                "backgroundColor": "red",
              },
            },
          },
        },
        {
          "className": "xl\\\\:w_3",
          "conditions": [
            {
              "name": "breakpoint",
              "params": "screen and (min-width: 80em)",
              "raw": "xl",
              "rawValue": "@media screen and (min-width: 80em)",
              "type": "at-rule",
              "value": "xl",
            },
          ],
          "entry": {
            "cond": "xl",
            "prop": "width",
            "value": "3",
          },
          "hash": "width]___[value:3]___[cond:xl",
          "layer": undefined,
          "result": {
            ".xl\\\\:w_3": {
              "@media screen and (min-width: 80em)": {
                "width": "var(--sizes-3)",
              },
            },
          },
        },
        {
          "className": "sm\\\\:hover\\\\:bg_green",
          "conditions": [
            {
              "raw": "&:is(:hover, [data-hover])",
              "type": "self-nesting",
              "value": "&:is(:hover, [data-hover])",
            },
            {
              "name": "breakpoint",
              "params": "screen and (min-width: 40em)",
              "raw": "sm",
              "rawValue": "@media screen and (min-width: 40em)",
              "type": "at-rule",
              "value": "sm",
            },
          ],
          "entry": {
            "cond": "sm<___>_hover",
            "prop": "backgroundColor",
            "value": "green",
          },
          "hash": "backgroundColor]___[value:green]___[cond:sm<___>_hover",
          "layer": undefined,
          "result": {
            ".sm\\\\:hover\\\\:bg_green": {
              "&:is(:hover, [data-hover])": {
                "@media screen and (min-width: 40em)": {
                  "backgroundColor": "green",
                },
              },
            },
          },
        },
        {
          "className": "hover\\\\:md\\\\:fs_lg",
          "conditions": [
            {
              "raw": "&:is(:hover, [data-hover])",
              "type": "self-nesting",
              "value": "&:is(:hover, [data-hover])",
            },
            {
              "name": "breakpoint",
              "params": "screen and (min-width: 48em)",
              "raw": "md",
              "rawValue": "@media screen and (min-width: 48em)",
              "type": "at-rule",
              "value": "md",
            },
          ],
          "entry": {
            "cond": "_hover<___>md",
            "prop": "fontSize",
            "value": "lg",
          },
          "hash": "fontSize]___[value:lg]___[cond:_hover<___>md",
          "layer": undefined,
          "result": {
            ".hover\\\\:md\\\\:fs_lg": {
              "&:is(:hover, [data-hover])": {
                "@media screen and (min-width: 48em)": {
                  "fontSize": "var(--font-sizes-lg)",
                },
              },
            },
          },
        },
      }
    `,
    )
  })

  test('recipe', () => {
    const result = recipe('buttonStyle', { size: { base: 'sm', md: 'md' } })

    expect(result).toMatchInlineSnapshot(`
      {
        "base": Set {
          {
            "className": "buttonStyle",
            "details": [
              {
                "conditions": undefined,
                "entry": {
                  "prop": "display",
                  "recipe": "buttonStyle",
                  "value": "inline-flex",
                },
                "hash": "display]___[value:inline-flex]___[recipe:buttonStyle",
                "result": {
                  "display": "inline-flex",
                },
              },
              {
                "conditions": undefined,
                "entry": {
                  "prop": "alignItems",
                  "recipe": "buttonStyle",
                  "value": "center",
                },
                "hash": "alignItems]___[value:center]___[recipe:buttonStyle",
                "result": {
                  "alignItems": "center",
                },
              },
              {
                "conditions": undefined,
                "entry": {
                  "prop": "justifyContent",
                  "recipe": "buttonStyle",
                  "value": "center",
                },
                "hash": "justifyContent]___[value:center]___[recipe:buttonStyle",
                "result": {
                  "justifyContent": "center",
                },
              },
              {
                "conditions": [
                  {
                    "raw": "&:is(:hover, [data-hover])",
                    "type": "self-nesting",
                    "value": "&:is(:hover, [data-hover])",
                  },
                ],
                "entry": {
                  "cond": "_hover",
                  "prop": "backgroundColor",
                  "recipe": "buttonStyle",
                  "value": "red.200",
                },
                "hash": "backgroundColor]___[value:red.200]___[cond:_hover]___[recipe:buttonStyle",
                "result": {
                  "backgroundColor": "var(--colors-red-200)",
                },
              },
            ],
            "hashSet": Set {
              "display]___[value:inline-flex]___[recipe:buttonStyle",
              "alignItems]___[value:center]___[recipe:buttonStyle",
              "justifyContent]___[value:center]___[recipe:buttonStyle",
              "backgroundColor]___[value:red.200]___[cond:_hover]___[recipe:buttonStyle",
            },
            "recipe": "buttonStyle",
            "result": {
              ".buttonStyle": {
                "&:is(:hover, [data-hover])": {
                  "backgroundColor": "var(--colors-red-200)",
                },
                "alignItems": "center",
                "display": "inline-flex",
                "justifyContent": "center",
              },
            },
          },
        },
        "variants": Set {
          {
            "className": "buttonStyle--size_sm",
            "conditions": undefined,
            "entry": {
              "prop": "size",
              "recipe": "buttonStyle",
              "value": "sm",
            },
            "hash": "size]___[value:sm]___[recipe:buttonStyle",
            "layer": undefined,
            "result": {
              ".buttonStyle--size_sm": {
                "height": "2.5rem",
                "minWidth": "2.5rem",
                "padding": "0 0.5rem",
              },
            },
          },
          {
            "className": "md\\\\:buttonStyle--size_md",
            "conditions": [
              {
                "name": "breakpoint",
                "params": "screen and (min-width: 48em)",
                "raw": "md",
                "rawValue": "@media screen and (min-width: 48em)",
                "type": "at-rule",
                "value": "md",
              },
            ],
            "entry": {
              "cond": "md",
              "prop": "size",
              "recipe": "buttonStyle",
              "value": "md",
            },
            "hash": "size]___[value:md]___[cond:md]___[recipe:buttonStyle",
            "layer": undefined,
            "result": {
              ".md\\\\:buttonStyle--size_md": {
                "@media screen and (min-width: 48em)": {
                  "height": "3rem",
                  "minWidth": "3rem",
                  "padding": "0 0.75rem",
                },
              },
            },
          },
          {
            "className": "buttonStyle--variant_solid",
            "conditions": undefined,
            "entry": {
              "prop": "variant",
              "recipe": "buttonStyle",
              "value": "solid",
            },
            "hash": "variant]___[value:solid]___[recipe:buttonStyle",
            "layer": undefined,
            "result": {
              ".buttonStyle--variant_solid": {
                "&": {
                  "&:is(:hover, [data-hover])": {
                    "backgroundColor": "darkblue",
                  },
                  "&[data-disabled]": {
                    "backgroundColor": "gray",
                    "color": "var(--colors-black)",
                  },
                },
                "backgroundColor": "blue",
                "color": "var(--colors-white)",
              },
            },
          },
        },
      }
    `)
  })

  test('cva', () => {
    // packages/fixture/src/recipes.ts
    const buttonStyle = cva({
      base: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      variants: {
        size: {
          sm: {
            textStyle: 'headline.h1',
            height: '2.5rem',
            minWidth: '2.5rem',
            padding: '0 0.5rem',
          },
          md: {
            height: '3rem',
            minWidth: '3rem',
            padding: '0 0.75rem',
          },
        },
        variant: {
          solid: {
            backgroundColor: 'blue',
            color: 'white',
            _hover: {
              backgroundColor: 'darkblue',
            },
            '&[data-disabled]': {
              backgroundColor: 'gray',
              color: 'black',
            },
          },
          outline: {
            backgroundColor: 'transparent',
            border: '1px solid blue',
            color: 'blue',
            _hover: {
              backgroundColor: 'blue',
              color: 'white',
            },
            '&[data-disabled]': {
              backgroundColor: 'transparent',
              border: '1px solid gray',
              color: 'gray',
            },
          },
        },
      },
      defaultVariants: {
        size: 'md',
        variant: 'solid',
      },
    })

    expect(buttonStyle).toMatchInlineSnapshot(`
      Set {
        {
          "className": "d_inline-flex",
          "conditions": undefined,
          "entry": {
            "prop": "display",
            "value": "inline-flex",
          },
          "hash": "display]___[value:inline-flex",
          "layer": undefined,
          "result": {
            ".d_inline-flex": {
              "display": "inline-flex",
            },
          },
        },
        {
          "className": "items_center",
          "conditions": undefined,
          "entry": {
            "prop": "alignItems",
            "value": "center",
          },
          "hash": "alignItems]___[value:center",
          "layer": undefined,
          "result": {
            ".items_center": {
              "alignItems": "center",
            },
          },
        },
        {
          "className": "justify_center",
          "conditions": undefined,
          "entry": {
            "prop": "justifyContent",
            "value": "center",
          },
          "hash": "justifyContent]___[value:center",
          "layer": undefined,
          "result": {
            ".justify_center": {
              "justifyContent": "center",
            },
          },
        },
        {
          "className": "textStyle_headline\\\\.h1",
          "conditions": undefined,
          "entry": {
            "prop": "textStyle",
            "value": "headline.h1",
          },
          "hash": "textStyle]___[value:headline.h1",
          "layer": "compositions",
          "result": {
            ".textStyle_headline\\\\.h1": {
              "fontSize": "2rem",
              "fontWeight": "var(--font-weights-bold)",
            },
          },
        },
        {
          "className": "h_2\\\\.5rem",
          "conditions": undefined,
          "entry": {
            "prop": "height",
            "value": "2.5rem",
          },
          "hash": "height]___[value:2.5rem",
          "layer": undefined,
          "result": {
            ".h_2\\\\.5rem": {
              "height": "2.5rem",
            },
          },
        },
        {
          "className": "min-w_2\\\\.5rem",
          "conditions": undefined,
          "entry": {
            "prop": "minWidth",
            "value": "2.5rem",
          },
          "hash": "minWidth]___[value:2.5rem",
          "layer": undefined,
          "result": {
            ".min-w_2\\\\.5rem": {
              "minWidth": "2.5rem",
            },
          },
        },
        {
          "className": "p_0_0\\\\.5rem",
          "conditions": undefined,
          "entry": {
            "prop": "padding",
            "value": "0 0.5rem",
          },
          "hash": "padding]___[value:0 0.5rem",
          "layer": undefined,
          "result": {
            ".p_0_0\\\\.5rem": {
              "padding": "0 0.5rem",
            },
          },
        },
        {
          "className": "h_3rem",
          "conditions": undefined,
          "entry": {
            "prop": "height",
            "value": "3rem",
          },
          "hash": "height]___[value:3rem",
          "layer": undefined,
          "result": {
            ".h_3rem": {
              "height": "3rem",
            },
          },
        },
        {
          "className": "min-w_3rem",
          "conditions": undefined,
          "entry": {
            "prop": "minWidth",
            "value": "3rem",
          },
          "hash": "minWidth]___[value:3rem",
          "layer": undefined,
          "result": {
            ".min-w_3rem": {
              "minWidth": "3rem",
            },
          },
        },
        {
          "className": "p_0_0\\\\.75rem",
          "conditions": undefined,
          "entry": {
            "prop": "padding",
            "value": "0 0.75rem",
          },
          "hash": "padding]___[value:0 0.75rem",
          "layer": undefined,
          "result": {
            ".p_0_0\\\\.75rem": {
              "padding": "0 0.75rem",
            },
          },
        },
        {
          "className": "bg_blue",
          "conditions": undefined,
          "entry": {
            "prop": "backgroundColor",
            "value": "blue",
          },
          "hash": "backgroundColor]___[value:blue",
          "layer": undefined,
          "result": {
            ".bg_blue": {
              "backgroundColor": "blue",
            },
          },
        },
        {
          "className": "text_white",
          "conditions": undefined,
          "entry": {
            "prop": "color",
            "value": "white",
          },
          "hash": "color]___[value:white",
          "layer": undefined,
          "result": {
            ".text_white": {
              "color": "var(--colors-white)",
            },
          },
        },
        {
          "className": "bg_transparent",
          "conditions": undefined,
          "entry": {
            "prop": "backgroundColor",
            "value": "transparent",
          },
          "hash": "backgroundColor]___[value:transparent",
          "layer": undefined,
          "result": {
            ".bg_transparent": {
              "backgroundColor": "var(--colors-transparent)",
            },
          },
        },
        {
          "className": "border_1px_solid_blue",
          "conditions": undefined,
          "entry": {
            "prop": "border",
            "value": "1px solid blue",
          },
          "hash": "border]___[value:1px solid blue",
          "layer": undefined,
          "result": {
            ".border_1px_solid_blue": {
              "border": "1px solid blue",
            },
          },
        },
        {
          "className": "text_blue",
          "conditions": undefined,
          "entry": {
            "prop": "color",
            "value": "blue",
          },
          "hash": "color]___[value:blue",
          "layer": undefined,
          "result": {
            ".text_blue": {
              "color": "blue",
            },
          },
        },
        {
          "className": "\\\\[\\\\&\\\\[data-disabled\\\\]\\\\]\\\\:bg_gray",
          "conditions": [
            {
              "raw": "&[data-disabled]",
              "type": "self-nesting",
              "value": "&[data-disabled]",
            },
          ],
          "entry": {
            "cond": "&[data-disabled]",
            "prop": "backgroundColor",
            "value": "gray",
          },
          "hash": "backgroundColor]___[value:gray]___[cond:&[data-disabled]",
          "layer": undefined,
          "result": {
            ".\\\\[\\\\&\\\\[data-disabled\\\\]\\\\]\\\\:bg_gray": {
              "&[data-disabled]": {
                "backgroundColor": "gray",
              },
            },
          },
        },
        {
          "className": "\\\\[\\\\&\\\\[data-disabled\\\\]\\\\]\\\\:text_black",
          "conditions": [
            {
              "raw": "&[data-disabled]",
              "type": "self-nesting",
              "value": "&[data-disabled]",
            },
          ],
          "entry": {
            "cond": "&[data-disabled]",
            "prop": "color",
            "value": "black",
          },
          "hash": "color]___[value:black]___[cond:&[data-disabled]",
          "layer": undefined,
          "result": {
            ".\\\\[\\\\&\\\\[data-disabled\\\\]\\\\]\\\\:text_black": {
              "&[data-disabled]": {
                "color": "var(--colors-black)",
              },
            },
          },
        },
        {
          "className": "\\\\[\\\\&\\\\[data-disabled\\\\]\\\\]\\\\:bg_transparent",
          "conditions": [
            {
              "raw": "&[data-disabled]",
              "type": "self-nesting",
              "value": "&[data-disabled]",
            },
          ],
          "entry": {
            "cond": "&[data-disabled]",
            "prop": "backgroundColor",
            "value": "transparent",
          },
          "hash": "backgroundColor]___[value:transparent]___[cond:&[data-disabled]",
          "layer": undefined,
          "result": {
            ".\\\\[\\\\&\\\\[data-disabled\\\\]\\\\]\\\\:bg_transparent": {
              "&[data-disabled]": {
                "backgroundColor": "var(--colors-transparent)",
              },
            },
          },
        },
        {
          "className": "\\\\[\\\\&\\\\[data-disabled\\\\]\\\\]\\\\:border_1px_solid_gray",
          "conditions": [
            {
              "raw": "&[data-disabled]",
              "type": "self-nesting",
              "value": "&[data-disabled]",
            },
          ],
          "entry": {
            "cond": "&[data-disabled]",
            "prop": "border",
            "value": "1px solid gray",
          },
          "hash": "border]___[value:1px solid gray]___[cond:&[data-disabled]",
          "layer": undefined,
          "result": {
            ".\\\\[\\\\&\\\\[data-disabled\\\\]\\\\]\\\\:border_1px_solid_gray": {
              "&[data-disabled]": {
                "border": "1px solid gray",
              },
            },
          },
        },
        {
          "className": "\\\\[\\\\&\\\\[data-disabled\\\\]\\\\]\\\\:text_gray",
          "conditions": [
            {
              "raw": "&[data-disabled]",
              "type": "self-nesting",
              "value": "&[data-disabled]",
            },
          ],
          "entry": {
            "cond": "&[data-disabled]",
            "prop": "color",
            "value": "gray",
          },
          "hash": "color]___[value:gray]___[cond:&[data-disabled]",
          "layer": undefined,
          "result": {
            ".\\\\[\\\\&\\\\[data-disabled\\\\]\\\\]\\\\:text_gray": {
              "&[data-disabled]": {
                "color": "gray",
              },
            },
          },
        },
        {
          "className": "hover\\\\:bg_darkblue",
          "conditions": [
            {
              "raw": "&:is(:hover, [data-hover])",
              "type": "self-nesting",
              "value": "&:is(:hover, [data-hover])",
            },
          ],
          "entry": {
            "cond": "_hover",
            "prop": "backgroundColor",
            "value": "darkblue",
          },
          "hash": "backgroundColor]___[value:darkblue]___[cond:_hover",
          "layer": undefined,
          "result": {
            ".hover\\\\:bg_darkblue": {
              "&:is(:hover, [data-hover])": {
                "backgroundColor": "darkblue",
              },
            },
          },
        },
        {
          "className": "hover\\\\:bg_blue",
          "conditions": [
            {
              "raw": "&:is(:hover, [data-hover])",
              "type": "self-nesting",
              "value": "&:is(:hover, [data-hover])",
            },
          ],
          "entry": {
            "cond": "_hover",
            "prop": "backgroundColor",
            "value": "blue",
          },
          "hash": "backgroundColor]___[value:blue]___[cond:_hover",
          "layer": undefined,
          "result": {
            ".hover\\\\:bg_blue": {
              "&:is(:hover, [data-hover])": {
                "backgroundColor": "blue",
              },
            },
          },
        },
        {
          "className": "hover\\\\:text_white",
          "conditions": [
            {
              "raw": "&:is(:hover, [data-hover])",
              "type": "self-nesting",
              "value": "&:is(:hover, [data-hover])",
            },
          ],
          "entry": {
            "cond": "_hover",
            "prop": "color",
            "value": "white",
          },
          "hash": "color]___[value:white]___[cond:_hover",
          "layer": undefined,
          "result": {
            ".hover\\\\:text_white": {
              "&:is(:hover, [data-hover])": {
                "color": "var(--colors-white)",
              },
            },
          },
        },
      }
    `)
  })

  test('slot recipe', () => {
    const result = recipe('checkbox', { size: { base: 'sm', md: 'md' } })

    expect(result.variants).toMatchInlineSnapshot('undefined')
    expect(result).toMatchInlineSnapshot(`
      {
        "base": Set {
          {
            "className": "checkbox",
            "details": [
              {
                "conditions": undefined,
                "entry": {
                  "prop": "display",
                  "recipe": "checkbox",
                  "value": "flex",
                },
                "hash": "display]___[value:flex]___[recipe:checkbox",
                "result": {
                  "display": "flex",
                },
              },
              {
                "conditions": undefined,
                "entry": {
                  "prop": "alignItems",
                  "recipe": "checkbox",
                  "value": "center",
                },
                "hash": "alignItems]___[value:center]___[recipe:checkbox",
                "result": {
                  "alignItems": "center",
                },
              },
              {
                "conditions": undefined,
                "entry": {
                  "prop": "gap",
                  "recipe": "checkbox",
                  "value": "2",
                },
                "hash": "gap]___[value:2]___[recipe:checkbox",
                "result": {
                  "gap": "var(--spacing-2)",
                },
              },
              {
                "conditions": undefined,
                "entry": {
                  "prop": "borderWidth",
                  "recipe": "checkbox",
                  "value": "1px",
                },
                "hash": "borderWidth]___[value:1px]___[recipe:checkbox",
                "result": {
                  "borderWidth": "1px",
                },
              },
              {
                "conditions": undefined,
                "entry": {
                  "prop": "borderRadius",
                  "recipe": "checkbox",
                  "value": "sm",
                },
                "hash": "borderRadius]___[value:sm]___[recipe:checkbox",
                "result": {
                  "borderRadius": "var(--radii-sm)",
                },
              },
              {
                "conditions": undefined,
                "entry": {
                  "prop": "marginInlineStart",
                  "recipe": "checkbox",
                  "value": "2",
                },
                "hash": "marginInlineStart]___[value:2]___[recipe:checkbox",
                "result": {
                  "marginInlineStart": "var(--spacing-2)",
                },
              },
            ],
            "hashSet": Set {
              "display]___[value:flex]___[recipe:checkbox",
              "alignItems]___[value:center]___[recipe:checkbox",
              "gap]___[value:2]___[recipe:checkbox",
              "borderWidth]___[value:1px]___[recipe:checkbox",
              "borderRadius]___[value:sm]___[recipe:checkbox",
              "marginInlineStart]___[value:2]___[recipe:checkbox",
            },
            "recipe": "checkbox",
            "result": {
              ".checkbox": {
                "alignItems": "center",
                "borderRadius": "var(--radii-sm)",
                "borderWidth": "1px",
                "display": "flex",
                "gap": "var(--spacing-2)",
                "marginInlineStart": "var(--spacing-2)",
              },
            },
          },
        },
        "variants": undefined,
      }
    `)
  })

  test('sva', () => {
    // packages/fixture/src/slot-recipes.ts
    const checkbox = cva({
      slots: ['root', 'control', 'label'],
      base: {
        root: { display: 'flex', alignItems: 'center', gap: '2' },
        control: { borderWidth: '1px', borderRadius: 'sm' },
        label: { marginStart: '2' },
      },
      variants: {
        size: {
          sm: {
            control: { width: '8', height: '8' },
            label: { fontSize: 'sm' },
          },
          md: {
            control: { width: '10', height: '10' },
            label: { fontSize: 'md' },
          },
          lg: {
            control: { width: '12', height: '12' },
            label: { fontSize: 'lg' },
          },
        },
      },
      defaultVariants: {
        size: 'sm',
      },
    })

    expect(checkbox).toMatchInlineSnapshot(`
      Set {
        {
          "className": "d_flex",
          "conditions": undefined,
          "entry": {
            "prop": "display",
            "value": "flex",
          },
          "hash": "display]___[value:flex",
          "layer": undefined,
          "result": {
            ".d_flex": {
              "display": "flex",
            },
          },
        },
        {
          "className": "items_center",
          "conditions": undefined,
          "entry": {
            "prop": "alignItems",
            "value": "center",
          },
          "hash": "alignItems]___[value:center",
          "layer": undefined,
          "result": {
            ".items_center": {
              "alignItems": "center",
            },
          },
        },
        {
          "className": "gap_2",
          "conditions": undefined,
          "entry": {
            "prop": "gap",
            "value": "2",
          },
          "hash": "gap]___[value:2",
          "layer": undefined,
          "result": {
            ".gap_2": {
              "gap": "var(--spacing-2)",
            },
          },
        },
        {
          "className": "border-width_1px",
          "conditions": undefined,
          "entry": {
            "prop": "borderWidth",
            "value": "1px",
          },
          "hash": "borderWidth]___[value:1px",
          "layer": undefined,
          "result": {
            ".border-width_1px": {
              "borderWidth": "1px",
            },
          },
        },
        {
          "className": "rounded_sm",
          "conditions": undefined,
          "entry": {
            "prop": "borderRadius",
            "value": "sm",
          },
          "hash": "borderRadius]___[value:sm",
          "layer": undefined,
          "result": {
            ".rounded_sm": {
              "borderRadius": "var(--radii-sm)",
            },
          },
        },
        {
          "className": "w_8",
          "conditions": undefined,
          "entry": {
            "prop": "width",
            "value": "8",
          },
          "hash": "width]___[value:8",
          "layer": undefined,
          "result": {
            ".w_8": {
              "width": "var(--sizes-8)",
            },
          },
        },
        {
          "className": "h_8",
          "conditions": undefined,
          "entry": {
            "prop": "height",
            "value": "8",
          },
          "hash": "height]___[value:8",
          "layer": undefined,
          "result": {
            ".h_8": {
              "height": "var(--sizes-8)",
            },
          },
        },
        {
          "className": "w_10",
          "conditions": undefined,
          "entry": {
            "prop": "width",
            "value": "10",
          },
          "hash": "width]___[value:10",
          "layer": undefined,
          "result": {
            ".w_10": {
              "width": "var(--sizes-10)",
            },
          },
        },
        {
          "className": "h_10",
          "conditions": undefined,
          "entry": {
            "prop": "height",
            "value": "10",
          },
          "hash": "height]___[value:10",
          "layer": undefined,
          "result": {
            ".h_10": {
              "height": "var(--sizes-10)",
            },
          },
        },
        {
          "className": "w_12",
          "conditions": undefined,
          "entry": {
            "prop": "width",
            "value": "12",
          },
          "hash": "width]___[value:12",
          "layer": undefined,
          "result": {
            ".w_12": {
              "width": "var(--sizes-12)",
            },
          },
        },
        {
          "className": "h_12",
          "conditions": undefined,
          "entry": {
            "prop": "height",
            "value": "12",
          },
          "hash": "height]___[value:12",
          "layer": undefined,
          "result": {
            ".h_12": {
              "height": "var(--sizes-12)",
            },
          },
        },
        {
          "className": "ms_2",
          "conditions": undefined,
          "entry": {
            "prop": "marginInlineStart",
            "value": "2",
          },
          "hash": "marginInlineStart]___[value:2",
          "layer": undefined,
          "result": {
            ".ms_2": {
              "marginInlineStart": "var(--spacing-2)",
            },
          },
        },
        {
          "className": "fs_sm",
          "conditions": undefined,
          "entry": {
            "prop": "fontSize",
            "value": "sm",
          },
          "hash": "fontSize]___[value:sm",
          "layer": undefined,
          "result": {
            ".fs_sm": {
              "fontSize": "var(--font-sizes-sm)",
            },
          },
        },
        {
          "className": "fs_md",
          "conditions": undefined,
          "entry": {
            "prop": "fontSize",
            "value": "md",
          },
          "hash": "fontSize]___[value:md",
          "layer": undefined,
          "result": {
            ".fs_md": {
              "fontSize": "var(--font-sizes-md)",
            },
          },
        },
        {
          "className": "fs_lg",
          "conditions": undefined,
          "entry": {
            "prop": "fontSize",
            "value": "lg",
          },
          "hash": "fontSize]___[value:lg",
          "layer": undefined,
          "result": {
            ".fs_lg": {
              "fontSize": "var(--font-sizes-lg)",
            },
          },
        },
      }
    `)
  })

  test('simple recipe with alterning no-condition/condition props', () => {
    const processor = createRuleProcessor({
      theme: {
        extend: {
          recipes: {
            button: {
              className: 'btn',
              base: {
                lineHeight: '1.2',
                _focusVisible: {
                  boxShadow: 'outline',
                },
                _disabled: {
                  opacity: 0.4,
                },
                _hover: {
                  _disabled: { bg: 'initial' },
                },
                display: 'inline-flex',
                outline: 'none',
                _focus: {
                  zIndex: 1,
                },
              },
            },
          },
        },
      },
    })

    const result = processor.recipe('button', {})!
    expect(result.className).toMatchInlineSnapshot(`
      [
        "btn",
      ]
    `)
  })
})
