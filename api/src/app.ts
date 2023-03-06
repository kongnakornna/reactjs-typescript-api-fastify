import * as fastify from 'fastify'
import * as path from 'path'
const multer = require('fastify-multer')
const envPath = path.join(__dirname, './.env')
require('dotenv').config({ path: envPath })
const packageJSON:any = require('../package.json')
const port:any = packageJSON.port;
const env: any = process.env 
const fileUpload = require('fastify-file-upload')
//console.warn(`packageJSON=>`,  packageJSON);
//console.warn(`port=>`,  port);
//console.warn(`env=>`, env);   
import WebSocket from 'ws'
import routers from './router/router'
import fp from 'fastify-plugin';
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');
const app: fastify.FastifyInstance = fastify.fastify({
  logger: {
    level: 'info'
  }
})
app.register(multer.contentParser)
app.register(require('fastify-cors'), {
  origin:'*', 
  credentials: "true",
  preflightContinue: true,
  optionsSuccessStatus: 200,
  allowedHeaders: "*",
  methods: "GET,POST,OPTIONS,PUT,DELETE,PATCH"    
}) 
app.register(require('fastify-formbody'))
// app.register(fileUpload)
// register knex database
app.register(require('./plugins/mysqldb'), {
  options: {
    client: 'mysql2',
    connection: {
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME
    },
    debug: true
  },
  connectionName: 'db'
})
// typeorm database
app.register(require('./plugins/typeorm'), {
      options: {
        client: 'mysql',
        entities:"../entities/*{.ts,.js}",
        migrations:"../migration/*{.ts,.js}", 
        subscribers: "../subscriber/*{.ts,.js}",
        connection: {
              host: process.env.DB_HOST,
              port: Number(process.env.DB_PORT),
              user: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
        },
        debug: true
      },
      connectionName: 'db'
})
app.register(require('./plugins/jwt'), { secret: env.JWT_SECRET || '$#200011124441##@'})
app.register(require('fastify-static'), {
  root: path.join(__dirname, '../public'),
  prefix: '/assets/'
})
app.register(require('point-of-view'), {
  engine: {
    ejs: require('ejs'),
    root: path.join(__dirname, '../views'),
  },
  includeViewExtension: true
})
// app.register(fastifyCookie);
// app.register(fastifySession, {secret: 'fastapi'});
// app.register(fileUpload)
/*
// websocket
app.register(require('./plugins/ws'))
// socket.io
app.register(require('./plugins/io'), {})
app.ready((error: any) => {
  if (error) throw error
  console.log('WebSocket server running....')
  app.io.on('connection', (socket: any) => {
    console.log('user connected!')
    socket.on('welcome', (message: any) => {
      socket.emit('welcome', 'Hello from server')
    })
    socket.on('chat message', (message: any) => {
      socket.broadcast.emit('chat message', message)
    })

  })
  app.ws.on('connection', (ws: any) => {
    console.log('Client connected!')
    ws.on('message', (message: any) => {
      const clients: any[] = app.ws.clients
      clients.forEach((client: any) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })

    })
  })
})
*/
app.register(routers, { prefix: `${packageJSON.endPoint}` });
// app.register(routers) 
export default app