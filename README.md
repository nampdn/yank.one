# Yank it one!

Free tool to quickly yank (copy) any content between internet connected device.
Yanked content will be vanished immediately after someone GET it!

## Features & Roadmap

### Features

- [x] Yank any text content and cache on Redis cloud.
- [x] Using cURL as cross-platform CLI tool.
- [x] Support AES-128 text encryption with secret password.
- [x] Clean up cached content after a key is consumed.

### Roadmap

- [ ] Interactive CLI documentation
  - [ ] CLI docs when GET at `/`
  - [ ] CLI docs when POST at `/<key>`
- [ ] Add optional parameter to prevent the key expiration.
- [ ] Support Linux/MacOS/Windows native CLI.
- [ ] Support binary stream: you will able to save any binary file.
- [ ] Support `Deno` permanent script publishing.
- [ ] Persistent using `IPFS` decentralized network.
  - [ ] Save persistent `IPFS` `Qm` key into SQL map with shorten URL.

## Quick start

### Yanking:

Yank a plain text

```
curl -X POST https://yank.one/set/<key>/<secret> --data-raw "Hello World"
```

```
cat doc.txt | curl -X POST -d @- https://yank.one/set/<key>/<secret>
```

### Get file content:

Short-hand:

```
curl https://yank.one/<key>/<secret>
```

Full:

```
curl https://yank.one/get/<key>/<secret>
```

- `key`: your very own key
- `secret`: encrypt text while yanking

## License

Nam Pham (c) MIT
