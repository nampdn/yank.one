# Yank it one!

This project is design to help developers and system administrators to quickly yank any text content between different OS where has internet.

## Features & Roadmap

### Features

- [x] Yank any text content and cache on Redis cloud.
- [x] Using cURL as cross-platform CLI tool.
- [x] Support AES-128 text encryption with secret password.
- [x] Clean up cached content after a key is consumed.

### Roadmap

- [ ] Interactive CLI documentation
  - [ ] CLI docs when GET at /
  - [ ] CLI docs when POST at /<key>
- [ ] Add optional parameter to prevent the key expiration.
- [ ] Support Linux/MacOS/Windows native CLI.
- [ ] Support binary stream: you will able to save any binary file.
- [ ] Support Deno script publishing.
- [ ] Persistent using IPFS decentralized network.
  - [ ] Save persistent IPFS `Qm` key into SQL map with shorten url.

## Quick start

### Saving file using:

```
cat doc.txt | curl -X POST -d @- https://yank.one/set/my-doc
```

### Get file content:

Short-hand:

```
curl https://yank.one/my-doc
```

Full:

```
curl https://yank.one/get/mydoc/secret
```

- `key`: is the unique name
- `pw`: secure text while yanking

## License

Nam Pham (c) MIT
