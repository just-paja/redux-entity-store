import { reduceArray, requireIdent } from './decorators'
import { getItemIndex } from './identifiers'

function processEntity (config, entity) {
  if (config.entityProcessors && config.entityProcessors.length) {
    return config.entityProcessors.reduce((acc, processor) => processor(acc), entity)
  }
  return entity
}

export function upsertItem (state, action, config, ident, itemIndex) {
  if (itemIndex === -1) {
    return [
      ...state,
      processEntity(config, {
        ...config.initialState,
        ...action.payload
      })
    ]
  }
  const nextState = state.slice()
  nextState[itemIndex] = processEntity(config, action.payload)
  return nextState
}

export const upsert = reduceArray(requireIdent(function (state, action, config, ident) {
  return upsertItem(state, action, config, ident, getItemIndex(state, config, ident))
}))