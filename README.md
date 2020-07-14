# Run a yank command

This project is design to help developers and system administrators to quickly yank any text content between different OS where has internet.

## Features & Roadmap

- [x] Yank any text content and cache on Redis cloud.
- [x] Using cURL as cross-platform CLI tools.
- [ ] Support AES-128 text encryption with secret password.
- [ ] Support Linux/MacOS/Windows native CLI.
- [ ] Support binary stream: you will able to save any binary file.
- [ ] Support Deno script publishing.
- [ ] Persistent using IPFS decentralized network.

## Quick start

Saving file using:

```
cat data.txt | curl -X POST -d @- https://yank.run/api/set?key=mydoc&pw=secret
```

Get file content:

```
curl https://yank.run/api/get?key=mydoc&pw=secret
```

- `key`: is the unique name
- `pw`: secure text while yanking
