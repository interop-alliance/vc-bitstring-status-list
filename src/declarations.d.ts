// Ambient declarations for untyped `@digitalbazaar/*` dependencies that do not
// ship their own type definitions. These describe only the surface this library
// (and its tests) actually use -- they intentionally do not mirror the full
// upstream API.

declare module '@digitalbazaar/bitstring' {
  export class Bitstring {
    length: number
    constructor(options?: {
      length?: number
      buffer?: Uint8Array
      leftToRightIndexing?: boolean
      littleEndianBits?: boolean
    })
    set(position: number, on: boolean): void
    get(position: number): boolean
    encodeBits(): Promise<string>
    static decodeBits(options: { encoded: string }): Promise<Uint8Array>
  }
}

declare module '@digitalbazaar/credentials-context' {
  export const named: Map<string, { id: string }>
}

declare module '@digitalbazaar/vc-bitstring-status-list-context' {
  export const CONTEXT_URL: string
  export const CONTEXT: Record<string, unknown>
}
