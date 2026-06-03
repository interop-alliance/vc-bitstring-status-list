/*!
 * Copyright (c) 2022-2024 Digital Bazaar, Inc. All rights reserved.
 */
import { describe, it, expect } from 'vitest'
import { BitstringStatusList } from '../../src/BitstringStatusList.js'

const encodedList100k =
  'uH4sIAAAAAAAAA-3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAP4GcwM92tQwAAA'
const encodedList100KWith50KthRevoked =
  'uH4sIAAAAAAAAA-3OMQ0AAAgDsElHOh72EJJWQRMAAAAAAIDWXAcAAAAAAIDHFvRitn7UMAAA'

describe('BitstringStatusList', () => {
  it('should create an instance', async () => {
    const list = new BitstringStatusList({ length: 8 })
    expect(list.length).toBe(8)
  })

  it('should fail to create an instance if no length nor buffer is provided', async () => {
    let err
    try {
      new BitstringStatusList()
    } catch (e) {
      err = e
    }
    expect(err).toBeDefined()
    expect((err as Error).name).toBe('TypeError')
  })

  it('should encode (multibase formatted)', async () => {
    const list = new BitstringStatusList({ length: 100000 })
    let encodedList
    let err
    try {
      encodedList = await list.encode()
    } catch (e) {
      err = e
    }
    expect(err).toBeUndefined()
    expect(encodedList).toBeDefined()
    expect(encodedList).toBe(encodedList100k)
  })

  it('should decode', async () => {
    let err
    let list
    try {
      list = await BitstringStatusList.decode({ encodedList: encodedList100k })
    } catch (e) {
      err = e
    }
    expect(err).toBeUndefined()
    expect(list).toBeDefined()
    expect(list!.length).toBe(100000)
  })

  it('should fail to decode non-multibase encoded list', async () => {
    let err
    let list
    try {
      list = await BitstringStatusList.decode({
        encodedList: encodedList100k.slice(1)
      })
    } catch (e) {
      err = e
    }
    expect(err).toBeDefined()
    expect((err as Error).message).toContain(
      '"encodedList" must start with the character "u".'
    )
    expect(list).toBeUndefined()
  })

  it('should mark a credential revoked', async () => {
    const list = new BitstringStatusList({ length: 8 })
    expect(list.getStatus(0)).toBe(false)
    expect(list.getStatus(1)).toBe(false)
    expect(list.getStatus(2)).toBe(false)
    expect(list.getStatus(3)).toBe(false)
    expect(list.getStatus(4)).toBe(false)
    expect(list.getStatus(5)).toBe(false)
    expect(list.getStatus(6)).toBe(false)
    expect(list.getStatus(7)).toBe(false)
    list.setStatus(4, true)
    expect(list.getStatus(0)).toBe(false)
    expect(list.getStatus(1)).toBe(false)
    expect(list.getStatus(2)).toBe(false)
    expect(list.getStatus(3)).toBe(false)
    expect(list.getStatus(4)).toBe(true)
    expect(list.getStatus(5)).toBe(false)
    expect(list.getStatus(6)).toBe(false)
    expect(list.getStatus(7)).toBe(false)
  })

  it('should fail to mark a credential revoked if no "status" boolean param is passed', async () => {
    const list = new BitstringStatusList({ length: 8 })
    let err
    try {
      ;(list as any).setStatus(0)
    } catch (e) {
      err = e
    }
    expect(err).toBeDefined()
    expect((err as Error).name).toBe('TypeError')
    expect((err as Error).message).toBe('"status" must be a boolean.')
  })

  it('should fail to get a credential status for position that is out of range', async () => {
    const list = new BitstringStatusList({ length: 8 })
    let err
    try {
      list.getStatus(8)
    } catch (e) {
      err = e
    }
    expect(err).toBeDefined()
    expect((err as Error).name).toBe('Error')
    expect((err as Error).message).toBe('Position "8" is out of range "0-7".')
  })

  it('should mark a credential revoked, encode and decode', async () => {
    const list = new BitstringStatusList({ length: 100000 })
    expect(list.getStatus(50000)).toBe(false)
    list.setStatus(50000, true)
    expect(list.getStatus(50000)).toBe(true)
    const encodedList = await list.encode()
    expect(encodedList).toBe(encodedList100KWith50KthRevoked)
    const decodedList = await BitstringStatusList.decode({ encodedList })
    expect(decodedList.getStatus(50000)).toBe(true)
  })

  it('should fail when decoding an empty string', async () => {
    let err
    try {
      await BitstringStatusList.decode({ encodedList: '' })
    } catch (e) {
      err = e
    }
    expect(err).toBeDefined()
    expect((err as Error).message).toContain(
      '"encodedList" must start with the character "u".'
    )
  })
})
