import { composeActionType, createActionCreator } from './actions'
import { createOperationSelector, getOperationFlag, getOperationProp } from './selectors'

import camelCase from 'camelcase'

export function createRoutine (baseName, entityConfig) {
  const routine = createActionCreator(baseName)
  routine.routineName = baseName
  routine.entityConfig = entityConfig
  return routine
}

export function createSyncRoutine (baseName, entityConfig) {
  const routine = createRoutine(baseName, entityConfig)
  routine.trigger = routine
  routine.TRIGGER = baseName
  routine.SUCCESS = baseName
  routine.sync = true
  return routine
}

export function createAsyncRoutine (baseName, entityConfig) {
  const TRIGGER = composeActionType(baseName, 'TRIGGER')
  const routine = createRoutine(TRIGGER, entityConfig)

  routine.routineName = baseName
  routine.trigger = routine
  routine.TRIGGER = TRIGGER
  routine.FAILURE = composeActionType(baseName, 'FAILURE')
  routine.failure = createActionCreator(routine.FAILURE)
  routine.FULFILL = composeActionType(baseName, 'FULFILL')
  routine.fulfill = createActionCreator(routine.FULFILL)
  routine.REQUEST = composeActionType(baseName, 'REQUEST')
  routine.request = createActionCreator(routine.REQUEST)
  routine.SUCCESS = composeActionType(baseName, 'SUCCESS')
  routine.success = createActionCreator(routine.SUCCESS)

  routine.getState = createOperationSelector(baseName)
  routine.getError = getOperationProp(routine.getState, 'error')
  routine.isInitialized = getOperationFlag(routine.getState, 'initialized')
  routine.isLoading = getOperationFlag(routine.getState, 'loading')

  return routine
}

function reduceRoutinesToDict (entity, sync) {
  return function (acc, routine) {
    const routineName = routine.toUpperCase()
    const baseName = composeActionType(entity, routineName)
    const result = {
      ...acc,
      [camelCase(routine)]: sync
        ? createSyncRoutine(baseName)
        : createAsyncRoutine(baseName)
    }
    if (sync) {
      result[routineName] = baseName
    }
    return result
  }
}

export function createEntityRoutines (entity, routines, sync) {
  return routines.reduce(reduceRoutinesToDict(entity, sync), {})
}
