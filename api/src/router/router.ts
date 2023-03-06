import { FastifyInstance } from 'fastify'
import indexRouter from '../controllers/index'
import usersRouter from '../controllers/users'
import loginRouter from '../controllers/login'
import uploadRouter from '../controllers/upload'
import seminarRouter from '../controllers/seminar'
import seminaruserRouter from '../controllers/seminaruser'
import narratorRouter from '../controllers/narrator' 
import csvimportRouter from '../controllers/csvimport'
export default async function router(fastify: FastifyInstance) {
  // router prefix
  fastify.register(indexRouter, { prefix: '/' }) 
  fastify.register(usersRouter, { prefix: '/users' }) 
  fastify.register(loginRouter, { prefix: '/login' }) 
  fastify.register(uploadRouter, { prefix: '/uploads' })
  fastify.register(seminarRouter, { prefix: '/seminar' })
  fastify.register(seminaruserRouter, { prefix: '/seminaruser' })
  fastify.register(narratorRouter, { prefix: '/narrator' })
  fastify.register(csvimportRouter, { prefix: '/csvimport' })
}