/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
import { Bitstring } from '@digitalbazaar/bitstring'

export class BitstringStatusList {
  bitstring: Bitstring
  length: number

  constructor({
    length,
    buffer
  }: { length?: number; buffer?: Uint8Array } = {}) {
    this.bitstring = new Bitstring({ length, buffer })
    this.length = this.bitstring.length
  }

  setStatus(index: number, status: boolean): void {
    if (typeof status !== 'boolean') {
      throw new TypeError('"status" must be a boolean.')
    }
    return this.bitstring.set(index, status)
  }

  getStatus(index: number): boolean {
    return this.bitstring.get(index)
  }

  async encode(): Promise<string> {
    return 'u' + (await this.bitstring.encodeBits())
  }

  static async decode({
    encodedList
  }: {
    encodedList: string
  }): Promise<BitstringStatusList> {
    try {
      if (encodedList[0] !== 'u') {
        throw '"encodedList" must start with the character "u".'
      }
      const buffer = await Bitstring.decodeBits({
        encoded: encodedList.slice(1)
      })
      return new BitstringStatusList({ buffer })
    } catch (e) {
      if (e instanceof Error) {
        throw e
      }
      throw new Error(
        `Could not decode encoded status list; reason: ${String(e)}`,
        { cause: e }
      )
    }
  }
}
