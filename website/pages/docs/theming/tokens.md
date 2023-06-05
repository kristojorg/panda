---
title: Tokens
description: Design tokens are the platform-agnostic way to manage design decisions in your application or website.
---

# Tokens

Design tokens are the platform-agnostic way to manage design decisions in your application or website.

A design token is a collection of attributes that describe any fundamental/atomic visual style. Each attribute is a key-value pair.

> Design tokens in Panda are largely influenced by the [W3C Token Format](https://tr.designtokens.org/format/).

Tokens are defined in the `panda.config.(ts|mjs)` file, and can contain the following categories: `colors`, `fonts`, `sizes`, `shadows`, `borders`, `gradients`, and `spacing`.

```js
// panda.config.ts
export default defineConfig({
  theme: {
    // 👇🏻 Define your tokens here
    tokens: {}
  }
})
```

Here's an example of a basic token definition:

```js
const theme = {
  tokens: {
    colors: {
      primary: { value: '#0FEE0F' },
      secondary: { value: '#EE0F0F' }
    },
    fonts: {
      body: { value: 'system-ui, sans-serif' }
    },
    sizes: {
      small: { value: '12px' },
      medium: { value: '16px' },
      large: { value: '24px' }
    }
  }
}
```

## Defining a Token

A design token consist of the following properties:

- `value`: The value of the token. This can be any valid CSS value.
- `description`: An optional description of what the token can be used for.
- `extensions`: An optional metadata to store token-related information (e.g. Figma source, deprecation, etc.).

```js
const theme = {
  tokens: {
    colors: {
      danger: { value: '#EE0F0F' }
    }
  }
}
```

Now you can use the defined color when writing styles.

```js
import { css } from '../styled-system/css'

const className = css({ color: 'danger' })
```

### Adding a description

```js {6}
const theme = {
  tokens: {
    colors: {
      danger: {
        value: '#EE0F0F',
        description: 'Color for signyfying errors'
      }
    }
  }
}
```

## Semantic or Alias Tokens

An alias token is a token that references another token or defines a more specific context. It is often used to
communicate the intended purpose of a token independent of its raw value.

Semantic tokens can reference existing tokens using the `{}` syntax.

Let's take a quick example, assuming we've defined the following tokens:

- `red` and `green` are raw tokens that define the color red and green.
- `danger` and `success` are semantic tokens that reference to the `red` and `green` tokens.

```js
const theme = {
  tokens: {
    colors: {
      red: { value: '#EE0F0F' },
      green: { value: '#0FEE0F' }
    }
  },
  semanticTokens: {
    colors: {
      danger: { value: '{colors.red}' },
      success: { value: '{colors.green}' }
    }
  }
}
```

## Composite Tokens

Composite tokens combine multiple values that follow a pre-defined structure. Take "Shadow" as an example, it comprises of a color, a blur radius, and an x/y offset. We can define it as a composite token like so:

```js
const theme = {
  tokens: {
    shadows: {
      basic: {
        value: {
          color: '{colors.shadow}',
          blur: '2px',
          offsetX: '2px',
          offsetY: '4px'
        }
      }
    }
  }
}
```

The following token type support composite tokens:

### Border Tokens

You can define the border width, style, and color of a border as separate values.

```js
const theme = {
  tokens: {
    borders: {
      basic: {
        value: { width: '1px', style: 'solid', color: '{colors.gray.200}' }
      }
    }
  }
}
```

### Gradient Tokens

You can define the gradient direction, color stops, and the color mode of a gradient as separate values.

```js
const theme = {
  tokens: {
    gradients: {
      basic: {
        value: {
          type: 'linear',
          placement: 'to right',
          stops: ['{colors.red}', '{colors.blue}']
        }
      }
    }
  }
}
```

### Asset Tokens

You can define image, svg, gif, and video assets as tokens.

```js
const theme = {
  tokens: {
    assets: {
      logo: {
        value: { type: 'url', url: '/static/logo.png' }
      },
      checkmark: {
        value: { type: 'svg', svg: '<svg>...</svg>' }
      }
    }
  }
}
```

> Good to know: To use asset tokens, apply them to the `background-image` or `list-style-image` CSS properties.

## Conditional Tokens

Semantic tokens can also be changed based on the [conditions](/docs/concepts/conditional-styles). For example, if you want to a color to change based on light or dark mode automatically.

> NOTE 🚨: The conditions used in semantic tokens most be an at-rule or a parent selector. To see the list of supported conditions, see [Conditional Styles](/docs/concepts/conditional-styles).

```js
const theme = {
  // ...
  semanticTokens: {
    colors: {
      danger: { value: { base: '{colors.red}', _dark: '{colors.darkred}' } },
      success: {
        value: { base: '{colors.green}', _dark: '{colors.darkgreen}' }
      }
    }
  }
}
```