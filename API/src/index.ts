import express from 'express'
import http from 'node:http'
import mongoose from 'mongoose'
import {router} from './router'
import path from 'node:path'
import { Server } from 'socket.io'

import 'dotenv/config'
console.log(process.env.DB_URL)

const app = express()

//web socket
const server = http.createServer(app) // diferente das requisições http que não tem uma conexão contínua entre db e frontend, este método (websocket) permite uma comunicação contínua entre os dois
export const io = new Server(server)

io.on('connect', () => {
	// console.log(('Conectou'))
})// quando o usuário se conectar, 'console' túnel bi-direcional, comunicação contínua de ambos os lados

// evitar erro de CORS:
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*') // se a request estiver vindo deste endereço, pode deixar passar ou wildcard
	res.setHeader('Access-Control-Allow-Methods', '*') // (*) wildcard -> pode liberar todos os métodos
	res.setHeader('Access-Control-Allow-Headers', '*') // (*) wildcard -> pode liberar todos os métodos

	next()
})
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))// arquivos que quando o usuário acessar, deve devolver literalmento aquilo (imagem dos produtos)
app.use(express.json())
app.use(router)

mongoose.connect('mongodb+srv://luiszamonaro1:8FrvPtPbYRO7orj1@cluster0.0flqpfx.mongodb.net/')

const port = 3001

server.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
