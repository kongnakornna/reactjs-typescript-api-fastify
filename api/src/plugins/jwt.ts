import { FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'

module.exports = fp(async (fastify: any, opts: any) => {
  fastify.register(require('fastify-jwt'), {
    secret: opts.secret
  })
  fastify.register(require('fastify-api-key'), {  
    getSecret: (request: any, keyId: any, callback: any) => {  
      callback(null, 'secret')  
    },  
  })  
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (error) {
      reply.send(error)
    }
  }) 
})