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
