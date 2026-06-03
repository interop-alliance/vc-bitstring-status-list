/*!
 * Copyright (c) 2022-2024 Digital Bazaar, Inc. All rights reserved.
 */
import { Ed25519Signature2020, suiteContext } from '@interop/ed25519-signature'
import { Ed25519VerificationKey } from '@interop/ed25519-verification-key'
import { driver as didKeyDriver } from '@interop/did-method-key'
import { issue } from '@interop/vc'

const SUITE_CONTEXT_URL = suiteContext.constants.CONTEXT_URL

const didKey = didKeyDriver()
didKey.use({ keyPairClass: Ed25519VerificationKey })

const encodedList100KWith50KthRevoked =
  'uH4sIAAAAAAAAA-3OMQ0AAAgDsOHfNB72EJJWQRMAAAAAAIDWXAcAAAAAAIDHFrc4zDz' +
  'UMAAA'

/**
 * Generates a fresh `did:key` issuer and a matching Ed25519Signature2020
 * signing suite. Returns both so callers can sign several status list
 * credentials under the same issuer.
 */
export async function createIssuerSuite(): Promise<{
  suite: Ed25519Signature2020
  issuer: string
}> {
  const { didDocument, methodFor } = await didKey.generate()
  const key: any = methodFor({ purpose: 'assertionMethod' })
  const suite = new Ed25519Signature2020({ signer: key.signer() })
  return { suite, issuer: didDocument.id }
}

export async function createMockBitstringStatusListCredential({
  id,
  suite,
  issuer,
  statusPurpose,
  documentLoader
}: {
  id?: string
  suite?: Ed25519Signature2020
  issuer?: string
  statusPurpose?: string
  documentLoader?: any
}): Promise<any> {
  if (!id) {
    id = 'https://example.com/status/1'
  }
  if (!suite) {
    ;({ suite, issuer } = await createIssuerSuite())
  }
  const credential = {
    '@context': ['https://www.w3.org/ns/credentials/v2', SUITE_CONTEXT_URL],
    id,
    issuer,
    validFrom: '2022-06-02T16:00:21Z',
    type: ['VerifiableCredential', 'BitstringStatusListCredential'],
    credentialSubject: {
      id: `${id}#list`,
      type: 'BitstringStatusList',
      encodedList: encodedList100KWith50KthRevoked,
      statusPurpose
    }
  }
  return issue({ credential: credential as any, suite, documentLoader })
}
