import { createEntitiesReducer, createEntityStore, createAsyncRoutine } from '..'

describe('store', () => {
  it('stores empty array by default', () => {
    const routine = createAsyncRoutine('TEST')
    const store = createEntityStore('users')
    const reducer = createEntitiesReducer(store)
    expect(reducer(undefined, routine.success())).toEqual({
      users: []
    })
  })

  it('stores entities on collectionName path', () => {
    const routine = createAsyncRoutine('TEST')
    const store = createEntityStore('users', {
      providedBy: [routine]
    })
    const reducer = createEntitiesReducer(store)
    expect(reducer(undefined, routine.success([
      { uuid: '3' },
      { uuid: '4' }
    ]))).toHaveProperty('users', [
      { uuid: '3' },
      { uuid: '4' }
    ])
  })
})
