import { createEntitiesReducer, createEntityStore, createAsyncRoutine } from '..'
import { createManyToMany } from '../ManyToMany'

describe('ManyToMany', () => {
  it('does not fail given target name is missing in parent payload', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      name: 'sounds',
      identSource: 'uuid',
      hasManyToMany: ['tags'],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      name: 'tags',
      identSource: 'uuid',
      providedBy: [tagsRoutine]
    })
    const reducer = createEntitiesReducer(sounds, tags)
    const payload = [
      {
        uuid: '3',
        name: 'sound-1'
      }
    ]
    expect(() => reducer(undefined, soundsRoutine.success(payload))).not.toThrow()
  })

  it('does not fail given parent name is missing in target payload', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      name: 'sounds',
      identSource: 'uuid',
      hasManyToMany: ['tags'],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      name: 'tags',
      identSource: 'uuid',
      providedBy: [tagsRoutine]
    })
    const reducer = createEntitiesReducer(sounds, tags)
    const payload = [
      {
        uuid: '7',
        name: 'bar'
      }
    ]
    expect(() => reducer(undefined, tagsRoutine.success(payload))).not.toThrow()
  })

  it('stores parent entities without manyToMany attribute from parent payload', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      name: 'sounds',
      identSource: 'uuid',
      hasManyToMany: ['tags'],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      name: 'tags',
      identSource: 'uuid',
      providedBy: [tagsRoutine]
    })
    const reducer = createEntitiesReducer(sounds, tags)
    const payload = [
      {
        uuid: '3',
        name: 'sound-1',
        tags: [
          {
            uuid: '5',
            name: 'foo'
          }
        ]
      },
      {
        uuid: '4',
        name: 'sound-2',
        tags: [
          {
            uuid: '5',
            name: 'foo'
          },
          {
            uuid: '7',
            name: 'bar'
          }
        ]
      }
    ]
    expect(reducer(undefined, soundsRoutine.success(payload))).toHaveProperty('sounds', [
      { uuid: '3', name: 'sound-1', tags: ['5'] },
      { uuid: '4', name: 'sound-2', tags: ['5', '7'] }
    ])
  })

  it('creates relation target entities from parent payload', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      name: 'sounds',
      identSource: 'uuid',
      hasManyToMany: ['tags'],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      name: 'tags',
      identSource: 'uuid',
      providedBy: [tagsRoutine]
    })
    const reducer = createEntitiesReducer(sounds, tags)
    const payload = [
      {
        uuid: '3',
        name: 'sound-1',
        tags: [
          {
            uuid: '5',
            name: 'foo'
          }
        ]
      },
      {
        uuid: '4',
        name: 'sound-2',
        tags: [
          {
            uuid: '5',
            name: 'foo'
          },
          {
            uuid: '7',
            name: 'bar'
          }
        ]
      }
    ]
    expect(reducer(undefined, soundsRoutine.success(payload))).toHaveProperty('tags', [
      {
        uuid: '5',
        name: 'foo',
        sounds: ['3', '4']
      },
      {
        uuid: '7',
        name: 'bar',
        sounds: ['4']
      }
    ])
  })

  it('creates relation parent entities from target payload', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      name: 'sounds',
      identSource: 'uuid',
      hasManyToMany: ['tags'],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      name: 'tags',
      identSource: 'uuid',
      providedBy: [tagsRoutine]
    })
    const reducer = createEntitiesReducer(sounds, tags)
    const payload = [
      {
        uuid: '5',
        name: 'foo',
        sounds: [
          {
            uuid: '3',
            name: 'sound-1'
          }
        ]
      },
      {
        uuid: '7',
        name: 'bar',
        sounds: [
          {
            uuid: '3',
            name: 'sound-1'
          },
          {
            uuid: '4',
            name: 'sound-2'
          }
        ]
      }
    ]
    const result = reducer(undefined, tagsRoutine.success(payload))
    expect(result).toHaveProperty('sounds', [
      { uuid: '3', name: 'sound-1', tags: ['5', '7'] },
      { uuid: '4', name: 'sound-2', tags: ['7'] }
    ])
  })

  it('creates relation target entities from target payload', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      name: 'sounds',
      identSource: 'uuid',
      hasManyToMany: ['tags'],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      name: 'tags',
      identSource: 'uuid',
      providedBy: [tagsRoutine]
    })
    const reducer = createEntitiesReducer(sounds, tags)
    const payload = [
      {
        uuid: '5',
        name: 'foo',
        sounds: [
          {
            uuid: '3',
            name: 'sound-1'
          }
        ]
      },
      {
        uuid: '7',
        name: 'bar',
        sounds: [
          {
            uuid: '3',
            name: 'sound-1'
          },
          {
            uuid: '4',
            name: 'sound-2'
          }
        ]
      }
    ]
    expect(reducer(undefined, tagsRoutine.success(payload))).toHaveProperty('tags', [
      { uuid: '5', name: 'foo', sounds: ['3'] },
      { uuid: '7', name: 'bar', sounds: ['3', '4'] }
    ])
  })

  it('getObject returns item with mapped manyToMany relation from parent store', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      name: 'sounds',
      identSource: 'uuid',
      hasManyToMany: ['tags'],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      name: 'tags',
      identSource: 'uuid',
      providedBy: [tagsRoutine]
    })
    createEntitiesReducer(sounds, tags)
    const state = {
      entities: {
        tags: [
          {
            uuid: '5',
            name: 'foo',
            sounds: ['3', '4']
          },
          {
            uuid: '7',
            name: 'bar',
            sounds: ['4']
          }
        ],
        sounds: [
          {
            uuid: '3',
            name: 'sound-1',
            tags: ['5']
          },
          {
            uuid: '4',
            name: 'sound-2',
            tags: ['5', '7']
          }
        ]
      }
    }
    expect(sounds.getObject(state, '4')).toHaveProperty('tags', ['5', '7'])
  })

  it('getAll returns item with mapped manyToMany relation from parent store', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      name: 'sounds',
      identSource: 'uuid',
      hasManyToMany: ['tags'],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      name: 'tags',
      identSource: 'uuid',
      providedBy: [tagsRoutine]
    })
    createEntitiesReducer(sounds, tags)
    const state = {
      entities: {
        tags: [
          {
            uuid: '5',
            name: 'foo',
            sounds: ['3', '4']
          },
          {
            uuid: '7',
            name: 'bar',
            sounds: ['4']
          }
        ],
        sounds: [
          {
            uuid: '3',
            name: 'sound-1',
            tags: ['5']
          },
          {
            uuid: '4',
            name: 'sound-2',
            tags: ['5', '7']
          }
        ]
      }
    }
    expect(sounds.getAll(state, '4')).toEqual([
      expect.objectContaining({
        uuid: '3',
        tags: ['5']
      }),
      expect.objectContaining({
        uuid: '4',
        tags: ['5', '7']
      })
    ])
  })

  it('processes large amount of data', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      name: 'sounds',
      identSource: 'uuid',
      hasManyToMany: ['tags'],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      name: 'tags',
      identSource: 'uuid',
      providedBy: [tagsRoutine]
    })
    const reducer = createEntitiesReducer(sounds, tags)
    function getRandTags (amount) {
      const tags = []
      for (let i = 0; i < amount; i++) {
        const number = parseInt(Math.random() * 100 * i, 10)
        tags.push({
          uuid: number,
          title: number
        })
      }
      return tags
    }
    function getRandSounds (amount) {
      const sounds = []
      for (let i = 0; i < amount; i++) {
        sounds.push({
          uuid: i,
          name: i,
          tags: getRandTags(10)
        })
      }
      return sounds
    }
    const payload = getRandSounds(1000)
    const state = reducer(undefined, soundsRoutine.success(payload))
    sounds.getObject({ entities: state }, 10)
  })

  it('converts relationship representation to string in a readable way', () => {
    const parent = createEntityStore({
      name: 'user',
      identSource: 'uuid',
      hasManyToMany: ['group']
    })
    const target = createEntityStore({
      name: 'group',
      identSource: 'uuid'
    })
    const relations = createManyToMany([parent, target])
    expect(relations[0] + '').toBe('manyToMany(user:group)')
  })

  it('throws exception given target store does not exist', () => {
    const parent = createEntityStore({
      name: 'user',
      identSource: 'uuid',
      hasManyToMany: ['group']
    })
    expect(() => {
      createManyToMany([parent])
    }).toThrow(new Error('Cannot find entity store called group'))
  })

  it('does not fail given target has no providers', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const sounds = createEntityStore({
      name: 'sounds',
      identSource: 'uuid',
      hasManyToMany: ['tags'],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      name: 'tags',
      identSource: 'uuid'
    })
    expect(() => createEntitiesReducer(sounds, tags)).not.toThrow()
  })

  it('does not fail given parent has no providers', () => {
    const tagRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      name: 'sounds',
      identSource: 'uuid',
      hasManyToMany: ['tags']
    })
    const tags = createEntityStore({
      name: 'tags',
      identSource: 'uuid',
      providedBy: [tagRoutine]
    })
    expect(() => createEntitiesReducer(sounds, tags)).not.toThrow()
  })
})
