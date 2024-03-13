# express-http-2

Implementing an HTTP/2 with Express

## Prerequisite knowledge

- [node-http-2](https://github.com/JeHwanYoo/node-http-2)
- [Express](https://expressjs.com/)

## SSL Certification for localhost

```sh
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout ./src/key.pem -out ./src/cert.pem
```

This example is written in HTTP/2, so it requires an SSL connection.

## Important Things

### Using http2 module to create the server

```js
import express from 'express'
import * as http2 from 'node:http2'
import * as fs from 'node:fs'
import * as path from 'node:path'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello, HTTP/2 with Express!')
})

const options = {
  key: fs.readFileSync(path.join(import.meta.dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(import.meta.dirname, 'cert.pem')),
}

const server = http2.createSecureServer(options, app)

server.listen(3000, () => {
  console.log('Server is running on https://localhost:3000')
})
```

But it has a serious problem.

```sh
node:events:497
      throw er; // Unhandled 'error' event
      ^

TypeError: Cannot read properties of undefined (reading 'readable')
    at IncomingMessage._read (node:_http_incoming:214:19)
    at Readable.read (node:internal/streams/readable:737:12)
    at resume_ (node:internal/streams/readable:1255:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
Emitted 'error' event on IncomingMessage instance at:
    at emitErrorNT (node:internal/streams/destroy:169:8)
    at errorOrDestroy (node:internal/streams/destroy:238:7)
    at Readable.read (node:internal/streams/readable:739:7)
    at resume_ (node:internal/streams/readable:1255:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)

Node.js v21.6.2
```

How should I solve this?

### Express still does not officially support Node `http2`

- [stackoverflow](https://stackoverflow.com/questions/59534717/how-to-integrate-http2-with-expressjs-using-nodejs-module-http2)

- Solution:
    - First, consider using [`spdy`](https://www.npmjs.com/package/spdy) as an alternative to `node:http2`.
        - Pros: Widely used and popular.
        - Cons: Does not use of official `node:http2`.

    - Second, consider using [`http2-express-bridge`](https://www.npmjs.com/package/http2-express-bridge) in conjunction
      with `node:http2`.
        - Pros: Enables the use of `node:http2`.
        - Cons: Less utilized compared to `spdy`.

I provide examples for both solutions.

#### solution 1 (spdy)

```sh
npm run start:spdy
```

```js
import express from 'express'
import spdy from 'spdy'
import * as fs from 'node:fs'
import * as path from 'node:path'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello, HTTP/2 with Express!')
})

const options = {
  key: fs.readFileSync(path.join(import.meta.dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(import.meta.dirname, 'cert.pem')),
}

const server = spdy.createServer(options, app)

server.listen(3001, () => {
  console.log('Server is running on https://localhost:3001')
})
```

#### solution 2 (http2-express-bridge)

```sh
npm run start:bridge
```

```js
import express from 'express'
import http2Express from 'http2-express-bridge'
import * as http2 from 'node:http2'
import * as fs from 'node:fs'
import * as path from 'node:path'

const app = http2Express(express)

app.get('/', (req, res) => {
  res.send('Hello, HTTP/2 with Express!')
})

const options = {
  key: fs.readFileSync(path.join(import.meta.dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(import.meta.dirname, 'cert.pem')),
}

const server = http2.createSecureServer(options, app)

server.listen(3002, () => {
  console.log('Server is running on https://localhost:3002')
})
```

![example](assets/http2_example.jpeg)
