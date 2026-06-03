# @digitalbazaar/vc-bitstring-status-list

[Verifiable Credential Bitstring Status List](https://github.com/w3c/vc-bitstring-status-list/)

## Install

```sh
npm install @digitalbazaar/vc-bitstring-status-list
```

## Usage

### Creating a BitstringStatusListCredential

```js
import {
  BitstringStatusList,
  createCredential,
  VC_BSL_VC_V1_CONTEXT,
  VC_BSL_VC_V2_CONTEXT
} from '@digitalbazaar/vc-bitstring-status-list'
import { documentLoader } from './path-to/document-loader.js'
import { Ed25519Signature2020 } from '@interop/ed25519-signature'
import { Ed25519VerificationKey } from '@interop/ed25519-verification-key'
import { issue } from '@interop/vc'

// Issuer Setup
const key = await Ed25519VerificationKey.from({
  id: 'did:key:z6Mkrjy3khhKz1jPLEwhqYAWNn3xMURog2DdCqjWAmD6anRE#z6Mkrjy3khhKz1jPLEwhqYAWNn3xMURog2DdCqjWAmD6anRE',
  controller: 'did:key:z6Mkrjy3khhKz1jPLEwhqYAWNn3xMURog2DdCqjWAmD6anRE',
  type: 'Ed25519VerificationKey2020',
  publicKeyMultibase: 'z6Mkrjy3khhKz1jPLEwhqYAWNn3xMURog2DdCqjWAmD6anRE',
  privateKeyMultibase:
    'zrv5NrLP4CvUQPGqpoFFCq6ihnEJWF7DpA1r13cxqzeJcSWjbgpXabWbCuHPUUSYhCknd3qWxEfT2ax7cR8TcYr4Dkt'
})
const suite = new Ed25519Signature2020({ signer: key.signer() })

// Status List Details
const id = 'https://example.com/credentials/status/3'
const list = new BitstringStatusList({ length: 100000 })
const statusPurpose = 'revocation'

// Create BitstringStatusListCredential
const credential = await createCredential({
  id,
  list,
  statusPurpose,
  context: VC_BSL_VC_V2_CONTEXT // OR VC_BSL_VC_V1_CONTEXT for VCDM v1
})

// Create BitstringStatusListCredential Verifiable Credential
const statusVC = await issue({ credential, suite, documentLoader })
```

### Create a Verifiable Credential which uses a BitstringStatusList

```js
// see imports above
const credential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://www.w3.org/2018/credentials/examples/v1',
    'https://www.w3.org/ns/credentials/status/v1'
  ],
  id: 'https://example.com/credentials/3732',
  type: ['VerifiableCredential', 'UniversityDegreeCredential'],
  issuer: key.controller,
  issuanceDate: '2021-03-10T04:24:12.164Z',
  credentialStatus: {
    id: 'https://example.com/credentials/status/3#94567',
    type: 'BitstringStatusListEntry',
    statusListIndex: '94567',
    statusListCredential: 'https://example.com/credentials/status/3'
  },
  credentialSubject: {
    id: 'did:web:did.actor:bob',
    degree: {
      type: 'BachelorDegree',
      name: 'Bachelor of Science and Arts'
    }
  }
}
let verifiableCredential = await issue({
  credential: { ...credential },
  suite,
  documentLoader
})
```

## Develop

This package uses [pnpm](https://pnpm.io/) and is written in TypeScript.

```sh
pnpm install        # install dependencies
pnpm run build      # compile src/ -> dist/ (with .d.ts)
pnpm run lint       # eslint (flat config)
pnpm run test-node  # vitest (Node)
pnpm run test-browser  # playwright (chromium smoke test)
```

Run `pnpm exec playwright install --with-deps chromium` once before
`test-browser`.
