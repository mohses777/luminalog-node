## [1.0.1](https://github.com/mohses777/luminalog-node/compare/v1.0.0...v1.0.1) (2026-03-13)


### Bug Fixes

* **sdk:** explicitly sync latest readme and performance settings to npm ([b14673e](https://github.com/mohses777/luminalog-node/commit/b14673eda1829e13c761d0acbff1105a03302193))

# 1.0.0 (2026-03-13)


### Bug Fixes

* **ci:** add debug logging and quote test glob ([6a5335a](https://github.com/mohses777/luminalog-node/commit/6a5335a3c913125667e996ca1389880531af8b21))
* **ci:** add NODE_AUTH_TOKEN and packages permission for npm auth ([a739cd6](https://github.com/mohses777/luminalog-node/commit/a739cd6e3221c0768465868956f6eb44274c1441))
* **ci:** build before testing to ensure dist folder exists ([0df4f0d](https://github.com/mohses777/luminalog-node/commit/0df4f0d6c6a7a96fe2c9630e5054a175361b3cd7))
* **ci:** use simpler non-quoted glob for test script compatibility ([b06118d](https://github.com/mohses777/luminalog-node/commit/b06118d321705506b39816fd24ef161e1e71e891))
* **sdk:** resolve memory leak by cleaning up shutdown hooks in tests ([5db1237](https://github.com/mohses777/luminalog-node/commit/5db1237e30395245542d66423c6a0b84f0dde2de))


### Features

* initial release of LuminaLog Node.js SDK ([e5f310c](https://github.com/mohses777/luminalog-node/commit/e5f310c033537bbd31a2e61ac1f265e717c2cf99))
* setup automated versioning and publishing with semantic-release ([a051990](https://github.com/mohses777/luminalog-node/commit/a0519902091c7d1ec1fb60fbf82630561449f1d8))
* use dev api endpoint for beta testing ([8137d9b](https://github.com/mohses777/luminalog-node/commit/8137d9b7221d69ddf50481a39698b263972ba730))
