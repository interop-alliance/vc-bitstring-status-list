# @interop/vc-bitstring-status-list ChangeLog

## 3.0.2 - 2026-06-06

### Added

- Add default export to `package.json`.

## 3.0.0-3.0.1 - 2026-06-03

### Changed

- **BREAKING**: Fork, rename to `@interop/vc-bitstring-status-list`.
- **BREAKING**: Replaced the runtime `@digitalbazaar/vc` dependency with its
  TypeScript fork `@interop/vc`.
- Converted the library source to TypeScript; the package now publishes compiled
  output from `dist/` (with `.d.ts` type declarations) instead of `lib/` source.
- Raised the Node.js engine floor to `>=24`.
- Migrated project infrastructure to the `isomorphic-lib-template`: pnpm,
  Prettier, flat-config ESLint, `tsc` build, Vitest (Node) and Playwright
  (browser smoke) test runners.
- Dropped the Codecov coverage upload; coverage is now produced locally via
  Vitest v8 (`lcov`).

## 2.0.1 - 2025-03-07

### Changed

- Update dependencies.
  - `@digitalbazaar/credentials-context@3.2.0`.
  - `@digitalbazaar/vc@7.1.1`.
  - `@digitalbazaar/vc-bitstring-status-list-context@1.1.0`.

## 2.0.0 - 2024-11-06

### Changed

- **BREAKING**: The `verified` property returned from `checkStatus` only
  indicates whether the VC's SLC was property verified, it does not make any
  statement about the `status` value (true/false/other) expressed in the SLC for
  the credential status index. Only `status` indicates the value of the status
  at that index of interest.

## 1.1.0 - 2024-11-06

### Added

- Return `status` value so it can be used instead of `verified` in status check
  information. The `verified` property may be removed in the future, instead
  allowing for business rules to check `status` based against the status purpose
  and not conflating verification of the VC and its related SLC with the current
  status of the VC that was checked.

## 1.0.1 - 2024-11-06

### Fixed

- Ensure credentials that only use the VC v2 context match status type checks.

## 1.0.0 - 2024-08-02

### Changed

- Initial version.
- See git history for changes previous to this release.
