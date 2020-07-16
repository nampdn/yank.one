# Yank it one!

Free service to quickly yank (copy) any content between internet connected device.
Yanked content will be vanished immediately after someone GET it!

The design goal is to help you typing less on terminal. It's best for working with different physical devices without copy/paste functions available.

## Features & Roadmap

### Features

- [x] Yank any text content and cache on Redis cloud.
- [x] Using cURL as cross-platform CLI tool.
- [x] Support AES-128 text encryption with secret password.
- [x] Clean up cached content after a key is consumed.

### Roadmap

- [ ] Completely serverless
- [ ] Gist integration
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

Yank a plain text file

```
curl https://yank.one/set/<key>/<secret> --data-raw "Hello World"
```

```
cat doc.txt | curl -d @- https://yank.one/set/<key>/<secret>
```

Yank a binary file

```
hostA# base64 -w 0 ./myphoto.jpg | curl -d @- https://yank.one/set/myphoto
hostB# curl -s https://yank.one/myphoto | base64 --decode > myphoto.jpg
```

### Pasting:

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

## Different with other services:

### [txt.do](textuploader.com)

#### Pros:

- Have input GUI (soon).

#### Cons:

- Only friendly with non-technical user.
- Need to remember 5 random key.
- Need to set the timeout manually.

### [transfer.sh](transfer.sh)

#### Pros:

- File upload 10GB.
- Files stored for 14 days.
- Lots of usage.

#### Cons:

- Need to copy the key into your mind.
- 10 characters in domain.

## License

Nam Pham (c) MIT
