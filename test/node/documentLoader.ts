/*!
 * Copyright (c) 2022-2024 Digital Bazaar, Inc. All rights reserved.
 */
import { securityLoader } from '@interop/security-document-loader'

// `securityLoader()` bundles the credentials v1/v2, DID, Ed25519-2020, Multikey
// and Bitstring Status List contexts, and resolves `did:key` DIDs
// automatically -- so the tests only need a registry for the ad-hoc status list
// credentials they mint and reference by id.
const builtLoader = securityLoader().build()

// Documents registered here take precedence over the bundled/static loader and
// the `did:key` resolver.
export const documents = new Map<string, unknown>()

export async function documentLoader(url: string): Promise<{
  contextUrl?: string | null
  documentUrl?: string
  document: unknown
}> {
  const registered = documents.get(url)
  if (registered !== undefined) {
    return {
      contextUrl: null,
      documentUrl: url,
      document: registered
    }
  }
  return builtLoader(url)
}
