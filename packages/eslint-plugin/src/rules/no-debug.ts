import { createRule, type Rule } from '../utils'

export const RULE_NAME = 'no-debug'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Prevent shipping the debug attribute to production',
    },
    messages: {
      debug: 'Remove the debug utility.',
      debugProp: 'Remove the debug prop.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    return {
      'JSXAttribute > JSXIdentifier[name="debug"]': (node) => {
        context.report({
          node,
          messageId: 'debugProp',
        })
      },
      'Property[key.type="Identifier"][key.name="debug"]': (node) => {
        context.report({
          node,
          messageId: 'debug',
        })
      },
    }
  },
})

export default rule
