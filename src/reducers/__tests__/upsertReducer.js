import { EntityConfig } from '../../EntityConfig'
import { upsert } from '..'

describe('upsert reducer', () => {
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
    expect(upsert(state, action, config)).toBe(state)
  })

  it('appends item to state given payload object item does not exist', () => {
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
    expect(upsert(state, action, config)).toEqual([
      { uuid: 'x3', name: 'foo' },
      { uuid: 'x9', name: 'bar' }
    ])
  })

  it('appends item to state given payload object item does not exist and it uses HAL link', () => {
    const state = [
      { name: 'foo', _links: { self: '/users/1' } }
    ]
    const action = {
      type: 'TEST',
      payload: {
        name: 'bar',
        _links: {
          self: '/users/2'
        }
      }
    }
    const config = new EntityConfig({ name: 'sound', identSource: halLinkResolver })
    expect(upsert(state, action, config)).toEqual([
      expect.objectContaining({ name: 'foo', _links: { self: '/users/1' } }),
      expect.objectContaining({ name: 'bar', _links: { self: '/users/2' } })
    ])
  })

  it('modifies item given payload object item exists', () => {
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
    expect(upsert(state, action, config)).toEqual([
      { uuid: 'x3', name: 'bar' }
    ])
  })

  it('modifies item given payload object item exists and it uses HAL link', () => {
    const state = [
      { uuid: 'x3', name: 'foo', _links: { self: '/users/1' } }
    ]
    const action = {
      type: 'TEST',
      payload: {
        name: 'bar',
        _links: { self: '/users/1' }
      }
    }
    const config = new EntityConfig({ name: 'sound', identSource: halLinkResolver })
    expect(upsert(state, action, config)).toEqual([
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
    expect(upsert(state, action, config)).toEqual([
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
    expect(upsert(state, action, config)).toEqual([
      { uuid: 'x3', name: 'bar' },
      { uuid: 'x9', name: 'bar' }
    ])
  })

  it('returns previous state given action payload is empty', () => {
    const state = [
      { uuid: 'x3', name: 'foo' }
    ]
    const action = { type: 'TEST' }
    const config = new EntityConfig({ name: 'sound', identSource: 'uuid' })
    expect(upsert(state, action, config)).toBe(state)
  })

  it('appends string item to state', () => {
    const state = [
      { uuid: 'x3', name: 'foo' }
    ]
    const action = { type: 'TEST', payload: 'x4' }
    const config = new EntityConfig({ name: 'sound', identSource: 'uuid' })
    expect(upsert(state, action, config)).toContainEqual({
      uuid: 'x4'
    })
  })
})
