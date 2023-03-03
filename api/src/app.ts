import * as fastify from 'fastify'
const express = require('express')
import * as path from 'path'
const multer = require('fastify-multer')
const envPath = path.join(__dirname, './.env')
// import { readAndUpload, createSecretUpdater } from "github-secret-dotenv";
require('dotenv').config({ path: envPath })
const packageJSON = require('../package.json')
import WebSocket from 'ws'
import routers from './router/router'
const app: fastify.FastifyInstance = fastify.fastify({
  logger: {
    level: 'info'
  }
})
/*
// upload the content of .env as secrets for the github repository
readAndUpload({
  owner: "platane",
  repo: "github-secret-dotenv",
  githubAccessToken: "xxxx",
  dotEnvFilename: ".env",
});

// upload arbitrary secret to the github repository
const updateSecret = createSecretUpdater({
  owner: "platane",
  repo: "github-secret-dotenv",
  githubAccessToken: "xxxx",
});
updateSecret("MY_SECRET", "XXXX");
*/
app.register(multer.contentParser)
app.register(require('fastify-cors'), {
  origin:'*', 
  credentials: "true",
  preflightContinue: true,
  optionsSuccessStatus: 200,
  allowedHeaders: "*",
  methods: "GET,POST,OPTIONS,PUT,DELETE,PATCH"    
}) 
 
app.register(require('@fastify/formbody'))
/*
console.warn(`process.env.DB_HOST=>`,  process.env.DB_HOST);  
console.warn(`process.env.DB_PORT=>`, process.env.DB_PORT);  
console.warn(`process.env.DB_USER=>`, process.env.DB_USER);  
console.warn(`process.env.DB_PASSWORD=>`, process.env.DB_PASSWORD);  
console.warn(`process.env.DB_NAME=> `, process.env.DB_NAME); 
*/ 
// register knex
app.register(require('./plugins/mysqldb'), {
  options: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT), 
      user: process.env.DB_USER, 
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    debug: true
  },
  pool: { min: 0, max: 7 }
  ,connectionName: 'db'
})

/*
app.register(require('./plugins/mysqldb'), {
  options: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || process.env.HOST_DEV || process.env.HOST_PROD || 'localhost',
      port: Number(process.env.DB_PORT) || 3307,
      user: process.env.DB_USER || process.env.USERS_DEV || process.env.USERS_PROD, 
      password: process.env.DB_PASSWORD || process.env.PASSWORD_DEV || process.env.PASSWORD_PROD,
      database: process.env.DB_NAME || process.env.DATABASE_DEV || process.env.DATABASE_PROD
    },
    debug: true
  },
  connectionName: 'db2'
})
*/
app.register(require('./plugins/jwt'), {
  secret: process.env.JWT_SECRET || '@0955#@#@'
})

// websocket
//app.register(require('./plugins/ws'))
// socket.io
//app.register(require('./plugins/io'), {})
/*
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
 
// typeorm
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
app.register(routers, { prefix: `${packageJSON.endPoint}` });
export default app