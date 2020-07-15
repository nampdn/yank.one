# Yank it one!

This project is design to help developers and system administrators to quickly yank any text content between different OS where has internet.

## Features & Roadmap

- [x] Yank any text content and cache on Redis cloud.
- [x] Using cURL as cross-platform CLI tools.
- [x] Support AES-128 text encryption with secret password.
- [ ] Support Linux/MacOS/Windows native CLI.
- [ ] Support binary stream: you will able to save any binary file.
- [ ] Support Deno script publishing.
- [ ] Persistent using IPFS decentralized network.

## Quick start

Saving file using:

```
cat data.txt | curl -X POST -d @- https://yank.one/set/mydoc/secret
```

Get file content:

```
curl https://yank.one/get/mydoc/secret
```

- `key`: is the unique name
- `pw`: secure text while yanking

## License

Nam Pham (c) MIT
