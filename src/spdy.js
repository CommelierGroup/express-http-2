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
