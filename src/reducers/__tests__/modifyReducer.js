import { EntityConfig } from '../../EntityConfig'
import { createModifyReducer } from '..'

describe('modify reducer', () => {
  function returnPayload (state, action) {
    return action.payload
  }

  function halLinkResolver (item) {
    return item._links.self
  }

  it('returns same state given payload has no ident', () => {
    const state = [
      { uuid: 'x3' }
    ]
    const action = {
      type: 'TEST',
      payload: {}
    }
    const config = new EntityConfig({ name: 'sound', identSource: 'uuid' })
    const reducer = createModifyReducer(state => state)
    expect(reducer(state, action, config)).toBe(state)
  })

  it('throws error given reducer is falsy', () => {
    expect(() => createModifyReducer()).toThrow()
  })

  it('appends item to state given payload object does not exist', () => {
    const state = [
      { uuid: 'x3', name: 'foo' }
    ]
    const action = {
      type: 'TEST',
      payload: {
        name: 'bar',
        uuid: 'x9'
      }
    }
    const config = new EntityConfig({ name: 'sound', identSource: 'uuid' })
    const reducer = createModifyReducer(jest.fn().mockImplementation(returnPayload))
    expect(reducer(state, action, config)).toEqual([
      { uuid: 'x3', name: 'foo' },
      { uuid: 'x9', name: 'bar' }
    ])
  })

  it('appends item to state given payload HATEOAS object does not exist', () => {
    const state = [
      { name: 'foo', _links: { self: '/users/1' } }
    ]
    const action = {
      type: 'TEST',
      payload: {
        name: 'bar',
        _links: { self: '/users/2' }
      }
    }
    const config = new EntityConfig({ name: 'user', identSource: halLinkResolver })
    const reducer = createModifyReducer(jest.fn().mockImplementation(returnPayload))
    expect(reducer(state, action, config)).toEqual([
      expect.objectContaining({ name: 'foo', _links: { self: '/users/1' } }),
      expect.objectContaining({ name: 'bar', _links: { self: '/users/2' } })
    ])
  })

  it('modifies item given payload object exists', () => {
    const state = [
      { uuid: 'x3', name: 'foo' }
    ]
    const action = {
      type: 'TEST',
      payload: {
        name: 'bar',
        uuid: 'x3'
      }
    }
    const config = new EntityConfig({ name: 'sound', identSource: 'uuid' })
    const reducer = createModifyReducer(jest.fn().mockImplementation(returnPayload))
    expect(reducer(state, action, config)).toEqual([
      { uuid: 'x3', name: 'bar' }
    ])
  })

  it('modifies item given payload HATEOAS object exists', () => {
    const state = [
      { name: 'foo', _links: { self: '/users/1' } }
    ]
    const action = {
      type: 'TEST',
      payload: {
        name: 'bar',
        _links: { self: '/users/1' }
      }
    }
    const config = new EntityConfig({ name: 'user', identSource: halLinkResolver })
    const reducer = createModifyReducer(jest.fn().mockImplementation(returnPayload))
    expect(reducer(state, action, config)).toEqual([
      { name: 'bar', _links: { self: '/users/1' } }
    ])
  })

  it('appends all items to state when called with array of payload objects', () => {
    const state = [
      { uuid: 'x3', name: 'foo' }
    ]
    const action = {
      type: 'TEST',
      payload: [
        { name: 'bar', uuid: 'x9' },
        { name: 'baz', uuid: 'x7' }
      ]
    }
    const config = new EntityConfig({ name: 'sound', identSource: 'uuid' })
    const reducer = createModifyReducer(jest.fn().mockImplementation(returnPayload))
    expect(reducer(state, action, config)).toEqual([
      { uuid: 'x3', name: 'foo' },
      { uuid: 'x9', name: 'bar' },
      { uuid: 'x7', name: 'baz' }
    ])
  })

  it('modifies all items when called with array of payload objects', () => {
    const state = [
      { uuid: 'x3', name: 'foo' }
    ]
    const action = {
      type: 'TEST',
      payload: [
        { uuid: 'x3', name: 'bar' },
        { uuid: 'x9', name: 'bar' }
      ]
    }
    const config = new EntityConfig({ name: 'sound', identSource: 'uuid' })
    const reducer = createModifyReducer(jest.fn().mockImplementation(returnPayload))
    expect(reducer(state, action, config)).toEqual([
      { uuid: 'x3', name: 'bar' },
      { uuid: 'x9', name: 'bar' }
    ])
  })

  it('appends string item to state', () => {
    const state = [
      { uuid: 'x3', name: 'foo' }
    ]
    const action = {
      type: 'TEST',
      payload: 'x9'
    }
    const config = new EntityConfig({ name: 'sound', identSource: 'uuid' })
    const reducer = createModifyReducer(jest.fn().mockImplementation(returnPayload))
    expect(reducer(state, action, config)).toEqual([
      { uuid: 'x3', name: 'foo' },
      { uuid: 'x9' }
    ])
  })

  it('appends string item to state after modifying it', () => {
    const state = [
      { uuid: 'x3', name: 'foo' }
    ]
    const action = {
      type: 'TEST',
      payload: 'x9'
    }
    const config = new EntityConfig({ name: 'sound', identSource: 'uuid' })
    const reducer = createModifyReducer(jest.fn().mockImplementation(item => ({
      ...item,
      name: 'bar'
    })))
    expect(reducer(state, action, config)).toEqual([
      { uuid: 'x3', name: 'foo' },
      { uuid: 'x9', name: 'bar' }
    ])
  })
})
